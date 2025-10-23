import fetch from 'cross-fetch';
import EpicenterError from './error';
import Fault from './fault';
import Result from './result';
import identification from './identification';
import errorManager from './error-manager';
import config from './config';
import { prefix, isBrowser } from './helpers';


type Version = number | undefined;
type Server = string | undefined;
type UseProjectProxy = boolean | undefined;
type AccountShortName = string | undefined;
type ProjectShortName = string | undefined;
type Authorization = string | undefined;
type QueryObject = Record<string, unknown>;
type SearchParams = string | string[][] | URLSearchParams | QueryObject;

export interface RoutingOptions {
    authorization?: Authorization;
    server?: Server;
    useProjectProxy?: UseProjectProxy;
    accountShortName?: AccountShortName;
    projectShortName?: ProjectShortName;
    query?: SearchParams;
    headers?: Record<string, string>;
    body?: unknown;
    includeAuthorization?: boolean;
    inert?: boolean | ((fault: Fault) => boolean);
    paginated?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parsePage?: (values: any[]) => any[];
}

interface RequestOptions extends RoutingOptions {
    method: string;
}

export interface RetryFunction<Output> {
    (): Promise<Output>;
    requestArguments?: { url: URL } & RequestOptions;
}

export interface Page<Item> {
    firstResult: number;
    maxResults: number;
    totalResults: number;
    values: Item[];
    prev: () => Promise<Item[]>;
    next: () => Promise<Item[]>;
    all: (first?: number, allValues?: Item[]) => Promise<Item[]>;
}

const MAX_URL_LENGTH = 2048;
function paginate(json: Page<unknown>, url: URL, options: RequestOptions) {
    const parsePage = options.parsePage ?? (<T>(i: T) => i);
    const page = { ...json, values: parsePage(json.values) };
    const prev = async function() {
        const searchParams = new URLSearchParams(url.search);
        if (page.firstResult === 0) {
            console.warn('Pagination: cannot call "prev" on first page');
            return [];
        }

        const first = page.firstResult - page.maxResults;
        const max = page.maxResults + (first < 0 ? first : 0);

        searchParams.set('first', Math.max(first, 0).toString());
        searchParams.set('max', max.toString());
        url.search = searchParams.toString();
        // eslint-disable-next-line no-use-before-define
        const prevPage = await request(url, { ...options, paginated: false }).then(({ body }) => body);
        prevPage.values = parsePage(prevPage.values);
        Object.assign(page, prevPage);
        return page.values;
    };

    const next = async function() {
        const searchParams = new URLSearchParams(url.search);
        const first = page.firstResult + page.maxResults;
        if (first >= page.totalResults) {
            console.warn('Pagination: cannot call "next" on final page');
            return [];
        }

        searchParams.set('first', first.toString());
        url.search = searchParams.toString();
        // eslint-disable-next-line no-use-before-define
        const nextPage = await request(url, { ...options, paginated: false }).then(({ body }) => body);
        nextPage.values = parsePage(nextPage.values);
        Object.assign(page, nextPage);
        return page.values;
    };

    const initialTotal = json.totalResults;
    const all = async function(first = 0, allValues: unknown[] = []): Promise<unknown[]> {
        if (first >= initialTotal) return allValues;

        const searchParams = new URLSearchParams(url.search);
        searchParams.set('first', first.toString());
        searchParams.delete('max');
        url.search = searchParams.toString();
        // eslint-disable-next-line no-use-before-define
        const nextPage = await request(url, { ...options, paginated: false }).then(({ body }) => body);
        allValues.push(...parsePage(nextPage.values));
        return all(first + nextPage.maxResults, allValues);
    };

    page.prev = prev;
    page.next = next;
    page.all = all;
    return page;
}

const parseQuery = (query: SearchParams) => {
    if (query.constructor === URLSearchParams) {
        return query;
    }

    /* 'query' should be either an array, or string. Objects will be coerced into [key, value] arrays */
    if (typeof query === 'object' && query.constructor === Object) {
        query = Object.entries(query).reduce((arr, [key, value]) => {
            if (Array.isArray(value)) {
                /* Special case for arrayed param values: use duplicated params here */
                return [...arr, ...value.map((v) => [key, v])];
            }
            if (value === undefined || value === null) {
                /* Skip nullish values */
                return arr;
            }
            arr.push([key, value.toString()]);
            return arr;
        }, [] as string[][]);
    }
    return new URLSearchParams(query as string | string[][] | URLSearchParams);
};


interface Message {
    headers: HeadersInit;
    body: BodyInit | null;
}

const createMessage = (
    headersRaw?: Record<string, string>,
    bodyRaw?: unknown,
    includeAuthorization?: boolean,
    authorization?: string,
): Message => {
    const headers = Object.assign({}, headersRaw);
    let body = null;
    if (isBrowser() && bodyRaw instanceof FormData) {
        body = bodyRaw;
    } else if (bodyRaw) {
        headers['Content-type'] = 'application/json; charset=UTF-8';
        body = JSON.stringify(bodyRaw);
    }

    if (!includeAuthorization) {
        delete headers.Authorization;
        return { headers, body };
    }

    const { session } = identification;
    if (!headers.Authorization) { // "headers" option as primary everything
        if (session) headers.Authorization = `Bearer ${session.token}`; // session token should be default
        if (authorization) headers.Authorization = authorization; // Router option as tertiary override
        if (config.authOverride) headers.Authorization = config.authOverride; // config fallback as secondary override
    }
    return { headers, body };
};

const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const OK = 200;
async function request(
    url: URL,
    options: RequestOptions,
): Promise<Result> {
    // Different browsers have different max URL lengths; we limit to 2048 as a safe
    // lower boundary to prevent truncation that might not be apparent to the user.
    // This can occur in particular with GET requests with large query strings.
    if (url.href.length > MAX_URL_LENGTH) {
        throw new EpicenterError(`URL length exceeds maximum of ${MAX_URL_LENGTH} characters: ${url.href.length} characters.`);
    }

    const {
        method,
        headers,
        body,
        includeAuthorization,
        inert,
        paginated,
        authorization,
    } = options;

    const message = createMessage(
        headers,
        body,
        includeAuthorization,
        authorization,
    );

    const response = await fetch(url.toString(), {
        method,
        cache: 'no-cache',
        redirect: 'follow',
        headers: message.headers,
        body: message.body,
    });

    if (response.status === NO_CONTENT) {
        return new Result(undefined, response);
    }

    const resContentType = response.headers.get('content-type');
    if (!resContentType || !resContentType.includes('application/json')) {
        throw new EpicenterError(`Response content-type '${resContentType}' does not include 'application/json' and my url is ${url.toString()}, ${method}`);
    }

    const json = await response.json();
    if ((response.status >= OK) && (response.status < BAD_REQUEST)) {
        const result = new Result(
            paginated ? paginate(json, url, options) : json,
            response,
        );
        return result;
    }

    const fault = new Fault(json, response);
    if (inert === true) throw fault;
    if (typeof inert === 'function' && inert(fault)) throw fault;

    const retryOptions = { ...options, inert: true };
    const retry = () => request(url, retryOptions);
    retry.requestArguments = {
        url,
        ...retryOptions,
    };
    return errorManager.handle<Result>(fault, retry);
}

/**
 * Used to make the network calls in all API adapters
 */
export default class Router {
    _version: Version = undefined;
    _server: Server = undefined;
    _useProjectProxy: UseProjectProxy = undefined;
    _accountShortName: AccountShortName = undefined;
    _projectShortName: ProjectShortName = undefined;
    _authorization: Authorization = undefined;
    _searchParams = new URLSearchParams();

    /**
     * The version of the Epicenter APIs being invoked; expected to stay at `3`
     */
    get version(): Version {
        return this._version;
    }

    set version(value: Version) {
        this._version = value;
    }

    /**
     * The root path used for the call, essentially protocol + hostname
     * @type {string}
     */
    get server(): Server {
        return this._server;
    }

    set server(value: Server) {
        this._server = value;
    }

    /**
     * If true, requests are routed to project proxy server.
     * The proxy server processes requests and forwards them to the Epicenter platform as appropriate,
     * usually with some modification. Can be used to grant heightened privileges to a request.
     *
     * If true, prefixes all request pathnames with `proxy/${accountShortName}/${projectShortName}/`.
     * @type {boolean}
     */
    get useProjectProxy(): UseProjectProxy {
        return this._useProjectProxy;
    }

    set useProjectProxy(value: UseProjectProxy) {
        this._useProjectProxy = value;
    }

    /**
     * Name of the account; for administrative use, this value should be set to 'epicenter'
     * @type {string}
     */
    get accountShortName(): AccountShortName {
        return this._accountShortName;
    }

    set accountShortName(value: AccountShortName) {
        this._accountShortName = value;
    }

    /**
     * Name of the project; for administrative use, this value should be set to 'manager'
     * @type {string}
     */
    get projectShortName(): ProjectShortName {
        return this._projectShortName;
    }

    set projectShortName(value: ProjectShortName) {
        this._projectShortName = value;
    }

    /**
     * Auth header; looks like `Bearer TOKEN` or `Basic TOKEN`
     * @type {string}
     */
    get authorization(): Authorization {
        return this._authorization;
    }

    set authorization(value: Authorization) {
        this._authorization = value;
    }

    /**
     * The search parameters for to use when making a network request. This property has should always return an instance of URLSearchParams or undefined. It has unique properties when used with the assignment operator (`=`); see the examples below for more details.
     * @type {URLSearchParams}
     *
     * @example
     * const router = new Router();
     * router.searchParams = '?foo=123';
     * console.log(router.searchParams);                            // always returns an instance object: URLSearchParams {}
     * console.log(router.searchParams.toString());                 // logs 'foo=123'
     *
     * router.searchParams = 'foo=123';                             // can omit the question mark
     * console.log(router.searchParams.toString());                 // logs 'foo=123'
     *
     * router.searchParams = [['foo', '123'], ['bar', '456']];      // can accept arrays
     * console.log(router.searchParams.toString());                 // logs 'foo=123&bar=456'
     *
     * router.searchParams = { foo: '123', bar: '456' };            // can accept objects
     * console.log(router.searchParams.toString());                 // logs 'foo=123&bar=456'
     *
     * router.searchParams = { foo: '123', bar: ['4', '5', '6'] };  // can accept objects with arrayed values
     * console.log(router.searchParams.toString());                 // logs 'foo=123&bar=4&bar=5&bar=6'
     *
     * router.searchParams = new URLSearchParams('foo=123');        // can accept instances of URLSearchParams
     * console.log(router.searchParams.toString());                 // logs 'foo=123'
     *
     * @param {object|array|string|URLSearchParams} query   Value used to set the search parameters
     */
    get searchParams(): SearchParams {
        return this._searchParams;
    }

    set searchParams(query: SearchParams) {
        this._searchParams = parseQuery(query);
    }

    /**
     * Sets the version. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [version]    Version to use
     * @returns {Router}            The Router instance
     */
    withVersion(version?: Version): Router {
        if (typeof version !== 'undefined') this.version = version;
        return this;
    }

    /**
     * Sets the root path. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [server] Root path to use
     * @returns {Router}        The Router instance
     */
    withServer(server?: Server): Router {
        if (typeof server !== 'undefined') this.server = server;
        return this;
    }

    /**
     * Sets whether to route requests to project proxy server. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [useProjectProxy] Whether to use the proxy server
     * @returns {Router}                 The Router instance
     */
    withProjectProxy(useProjectProxy: UseProjectProxy): Router {
        if (typeof useProjectProxy !== 'undefined') this.useProjectProxy = useProjectProxy;
        return this;
    }

    /**
     * Sets the account. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [accountShortName]   Account name to use
     * @returns {Router}                    The Router instance
     */
    withAccountShortName(accountShortName?: AccountShortName): Router {
        if (typeof accountShortName !== 'undefined') this.accountShortName = accountShortName;
        return this;
    }

    /**
     * Sets the project. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [projectShortName]   Project name to use
     * @returns {Router}                    The Router instance
     */
    withProjectShortName(projectShortName?: ProjectShortName): Router {
        if (typeof projectShortName !== 'undefined') this.projectShortName = projectShortName;
        return this;
    }

    /**
     * Sets the project. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [projectShortName]   Project name to use
     * @returns {Router}                    The Router instance
     */
    withAuthorization(authorization?: Authorization): Router {
        if (typeof authorization !== 'undefined') this.authorization = authorization;
        return this;
    }

    /**
     * Sets the search parameters. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string|array|object|URLSearchParams} [searchParams]  Search parameters to use, utilizes the same setter as [searchParams](#Router-searchParams)
     * @returns {Router}                                            The Router instance
     */
    withSearchParams(searchParams?: SearchParams): Router {
        if (typeof searchParams !== 'undefined') this.searchParams = searchParams;
        return this;
    }

    /**
     * Creates the URL that would be used for a network request. Should prioritize any overrides provided to it, falling back to any values set local to the Router instance, falling back to values set in the config
     * @param uriComponent                  The URI component used to generate the URL object
     * @param [overrides]                   Overrides for generating the URL object
     * @param [overrides.server]            Override for the root URL string -- composed of the protocol and the hostname; e.g., https://forio.com
     * @param [overrides.useProjectProxy]   Override for routing requests to the project proxy server
     * @param [overrides.accountShortName]  Override for the account short name
     * @param [overrides.projectShortName]  Override for the project short name
     * @param [overrides.version]           Override for the version (NIU, is set by the config)
     * @param [overrides.query]             Override for the URL search query
     * @returns URL object
     */
    getURL(
        uriComponent: string,
        overrides: {
            server?: string;
            useProjectProxy?: boolean;
            accountShortName?: string;
            projectShortName?: string;
            version?: number;
            query?: SearchParams;
        } = {},
    ): URL {
        const server = overrides.server ?? this.server ?? `${config.apiProtocol}://${config.apiHost}`;
        const useProjectProxy = overrides.useProjectProxy ?? this.useProjectProxy ?? config.useProjectProxy;
        const accountShortName = overrides.accountShortName ?? this.accountShortName ?? config.accountShortName;
        const projectShortName = overrides.projectShortName ?? this.projectShortName ?? config.projectShortName;
        const version = overrides?.version ?? this.version ?? config.apiVersion;

        const url = new URL(`${server}`);

        const proxyPathComponent = useProjectProxy ? `proxy/${accountShortName}/${projectShortName}/` : '';
        const commonPathComponent = `api/v${version}/${accountShortName}/${projectShortName}`;
        const uniquePathComponent = prefix('/', uriComponent);

        url.pathname = `${proxyPathComponent}${commonPathComponent}${uniquePathComponent}`;

        url.search = overrides.query !== undefined ?
            parseQuery(overrides.query).toString() :
            (this.searchParams ?? new URLSearchParams()).toString();
        return url;
    }

    // Network Requests
    async get(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName,
            projectShortName,
            authorization,
            server,
            query,
            useProjectProxy,
            headers,
            includeAuthorization,
            inert,
            paginated,
            parsePage,
        } = options;

        const url = this.getURL(uriComponent, {
            server,
            query,
            accountShortName,
            projectShortName,
            useProjectProxy,
        });

        return request(url, {
            method: 'GET',
            headers,
            includeAuthorization: includeAuthorization ?? true,
            authorization: authorization ?? this.authorization,
            inert,
            paginated,
            parsePage,
        });
    }

    async delete(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName,
            projectShortName,
            authorization,
            server,
            query,
            useProjectProxy,
            headers,
            includeAuthorization,
            inert,
        } = options;

        const url = this.getURL(uriComponent, {
            server,
            query,
            accountShortName,
            projectShortName,
            useProjectProxy,
        });

        return request(url, {
            method: 'DELETE',
            headers,
            includeAuthorization: includeAuthorization ?? true,
            authorization: authorization ?? this.authorization,
            inert,
        });
    }

    async patch(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName,
            projectShortName,
            authorization,
            server,
            query,
            useProjectProxy,
            headers,
            body,
            includeAuthorization,
            inert,
        } = options;

        const url = this.getURL(uriComponent, {
            server,
            query,
            accountShortName,
            projectShortName,
            useProjectProxy,
        });

        return request(url, {
            method: 'PATCH',
            headers,
            body,
            includeAuthorization: includeAuthorization ?? true,
            authorization: authorization ?? this.authorization,
            inert,
        });
    }

    async post(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName,
            projectShortName,
            authorization,
            server,
            query,
            useProjectProxy,
            headers,
            body,
            includeAuthorization,
            inert,
        } = options;

        const url = this.getURL(uriComponent, {
            server,
            query,
            accountShortName,
            projectShortName,
            useProjectProxy,
        });

        return request(url, {
            method: 'POST',
            headers,
            body,
            includeAuthorization: includeAuthorization ?? true,
            authorization: authorization ?? this.authorization,
            inert,
        });
    }

    async put(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName,
            projectShortName,
            authorization,
            server,
            query,
            useProjectProxy,
            headers,
            body,
            includeAuthorization,
            inert,
        } = options;

        const url = this.getURL(uriComponent, {
            server,
            query,
            accountShortName,
            projectShortName,
            useProjectProxy,
        });

        return request(url, {
            method: 'PUT',
            headers,
            body,
            includeAuthorization: includeAuthorization ?? true,
            authorization: authorization ?? this.authorization,
            inert,
        });
    }
}

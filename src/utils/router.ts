import fetch from 'cross-fetch';
import EpicenterError from './error';
import Fault from './fault';
import Result from './result';
import identification from './identification';
import errorManager from './error-manager';
import config from './config';
import { prefix, isBrowser } from './helpers';


// const DEFAULT_ACCOUNT_SHORT_NAME = 'epicenter';
// const DEFAULT_PROJECT_SHORT_NAME = 'manager';
const MAX_URL_LENGTH = 2048;

function paginate(json: Page<unknown>, url: URL, options: RequestOptions) {
    const parsePage = options.parsePage ?? (<T>(i: T) => i);
    const page = {...json, values: parsePage(json.values)};
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
        const prevPage = await request(url, {...options, paginated: false}).then(({body}) => body);
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
        const nextPage = await request(url, {...options, paginated: false}).then(({body}) => body);
        nextPage.values = parsePage(nextPage.values);
        Object.assign(page, nextPage);
        return page.values;
    };

    const initialTotal = json.totalResults;
    const all = async function(first = 0, allValues: unknown[] = []):Promise<unknown[]> {
        if (first >= initialTotal) return allValues;

        const searchParams = new URLSearchParams(url.search);
        searchParams.set('first', first.toString());
        searchParams.delete('max');
        url.search = searchParams.toString();
        // eslint-disable-next-line no-use-before-define
        const nextPage = await request(url, {...options, paginated: false}).then(({body}) => body);
        allValues.push(...parsePage(nextPage.values));
        return all(first + nextPage.maxResults, allValues);
    };

    page.prev = prev;
    page.next = next;
    page.all = all;
    return page;
}

interface Message {
    headers: HeadersInit,
    body: BodyInit | null,
}

const createMessage = (
    headersRaw?: Record<string, string>,
    bodyRaw?: Record<string, unknown>,
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
    if (!headers.Authorization) {                                               // "headers" option first
        if (session) headers.Authorization = `Bearer ${session.token}`;         // session token second
        if (authorization) headers.Authorization = authorization;               // Router fallback third
        if (config.authOverride) headers.Authorization = config.authOverride;   // config fallback last
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
    const { method, headers, body, includeAuthorization, inert, paginated, authorization } = options;
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
            response
        );
        return result;
    }

    const fault = new Fault(json, response);
    if (inert) throw fault;

    const retryOptions = {...options, inert: true};
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
    _version: Version = undefined
    _server: Server = undefined
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
        if (query.constructor === URLSearchParams) {
            this._searchParams = query;
            return;
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
        this._searchParams = new URLSearchParams(query as string | string[][] | URLSearchParams);
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

    getURL(uriComponent: string): URL {
        const server = this.server ?? `${config.apiProtocol}://${config.apiHost}`;
        const accountShortName = this.accountShortName ?? config.accountShortName;
        const projectShortName = this.projectShortName ?? config.projectShortName;
        const version = this.version ?? config.apiVersion;

        const url = new URL(`${server}`);
        url.pathname = `api/v${version}/${accountShortName}/${projectShortName}${prefix('/', uriComponent)}`;
        url.search = (this.searchParams ?? new URLSearchParams()).toString();
        return url;
    }

    //Network Requests
    async get(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName, projectShortName, authorization, server, query,
            headers, includeAuthorization, inert, paginated,
        } = options;

        this.withAuthorization(authorization)
            .withServer(server)
            .withAccountShortName(accountShortName)
            .withProjectShortName(projectShortName)
            .withSearchParams(query);

        const url = this.getURL(uriComponent);

        /* Handle sufficiently large GET requests with POST calls instead */
        if (url.href.length > MAX_URL_LENGTH) {
            const searchParams = (this.searchParams ?? new URLSearchParams()) as URLSearchParams;
            const entries = Array.from(searchParams.entries()) as Array<[string, string]>;
            const searchObject = entries.reduce((searchObject, [key, value]) => {
                // Store values that only occur once as the value itself
                if (!searchObject[key]) {
                    searchObject[key] = value;
                    return searchObject;
                }
                // Store values that that appear more than once in an array
                if (!Array.isArray(searchObject[key])) {
                    // Make existing value an array
                    searchObject[key] = [searchObject[key] as string];
                }
                (searchObject[key] as string[]).push(value);

                return searchObject;
            }, {} as Record<string, string | string[]>);
            this.searchParams = '';
            return this.post(uriComponent, {
                ...options,
                body: searchObject,
            });
        }

        return request(url, {
            method: 'GET',
            headers,
            includeAuthorization: includeAuthorization ?? true,
            authorization: this.authorization,
            inert,
            paginated,
        });
    }

    async delete(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName, projectShortName, authorization, server, query,
            headers, includeAuthorization, inert, paginated,
        } = options;

        this.withAuthorization(authorization)
            .withServer(server)
            .withAccountShortName(accountShortName)
            .withProjectShortName(projectShortName)
            .withSearchParams(query);

        const url = this.getURL(uriComponent);
        return request(url, {
            method: 'DELETE',
            headers,
            includeAuthorization: includeAuthorization ?? true,
            authorization: this.authorization,
            inert,
            paginated,
        });
    }

    async patch(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName, projectShortName, authorization, server, query,
            headers, body, includeAuthorization, inert, paginated,
        } = options;

        this.withAuthorization(authorization)
            .withServer(server)
            .withAccountShortName(accountShortName)
            .withProjectShortName(projectShortName)
            .withSearchParams(query);

        const url = this.getURL(uriComponent);
        return request(url, {
            method: 'PATCH',
            headers,
            body,
            includeAuthorization: includeAuthorization ?? true,
            authorization: this.authorization,
            inert,
            paginated,
        });
    }

    async post(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName, projectShortName, authorization, server, query,
            headers, body, includeAuthorization, inert, paginated,
        } = options;

        this.withAuthorization(authorization)
            .withServer(server)
            .withAccountShortName(accountShortName)
            .withProjectShortName(projectShortName)
            .withSearchParams(query);

        const url = this.getURL(uriComponent);
        return request(url, {
            method: 'POST',
            headers,
            body,
            includeAuthorization: includeAuthorization ?? true,
            authorization: this.authorization,
            inert,
            paginated,
        });
    }

    async put(uriComponent: string, options: RoutingOptions = {}): Promise<Result> {
        const {
            accountShortName, projectShortName, authorization, server, query,
            headers, body, includeAuthorization, inert, paginated,
        } = options;

        this.withAuthorization(authorization)
            .withServer(server)
            .withAccountShortName(accountShortName)
            .withProjectShortName(projectShortName)
            .withSearchParams(query);

        const url = this.getURL(uriComponent);
        return request(url, {
            method: 'PUT',
            headers,
            body,
            includeAuthorization: includeAuthorization ?? true,
            authorization: this.authorization,
            inert,
            paginated,
        });
    }
}

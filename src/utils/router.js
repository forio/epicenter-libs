import fetch from 'cross-fetch';
import { EpicenterError, Fault, Result, identification, prefix, errorManager, config } from 'utils';


const DEFAULT_ACCOUNT_SHORT_NAME = 'epicenter';
const DEFAULT_PROJECT_SHORT_NAME = 'manager';
const MAX_URL_LENGTH = 2048;

function paginate(json, url, options) {
    const parsePage = options.parsePage ?? ((i) => i);
    const page = { ...json, values: parsePage(json.values) };

    const prev = async function() {
        const searchParams = new URLSearchParams(url.search);
        if (page.firstResult === 0) {
            console.warn('Pagination: cannot call "prev" on first page');
            return [];
        }

        const first = page.firstResult - page.maxResults;
        const max = page.maxResults + (first < 0 ? first : 0);

        searchParams.set('first', Math.max(first, 0));
        searchParams.set('max', max);
        url.search = searchParams;
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

        searchParams.set('first', first);
        url.search = searchParams;
        // eslint-disable-next-line no-use-before-define
        const nextPage = await request(url, { ...options, paginated: false }).then(({ body }) => body);
        nextPage.values = parsePage(nextPage.values);
        Object.assign(page, nextPage);
        return page.values;
    };

    const initialTotal = json.totalResults;
    const all = async function(first = 0, allValues = []) {
        if (first >= initialTotal) return allValues;

        const searchParams = new URLSearchParams(url.search);
        searchParams.set('first', first);
        searchParams.delete('max');
        url.search = searchParams;
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

const createHeaders = (includeAuthorization) => {
    const headers = { 'Content-type': 'application/json; charset=UTF-8' };
    const { session } = identification;
    if (includeAuthorization && session) {
        headers.Authorization = `Bearer ${session.token}`;
    }
    if (includeAuthorization && config.tokenOverride) {
        headers.Authorization = `Bearer ${config.tokenOverride}`;
    }
    return headers;
};
const NO_CONTENT = 204;
async function request(url, options) {
    const { method, body, includeAuthorization, inert, paginated } = options;
    const headers = createHeaders(includeAuthorization);
    const response = await fetch(url, {
        method: method,
        cache: 'no-cache',
        headers: headers,
        redirect: 'follow',
        body: body ? JSON.stringify(body) : null,
    });

    if (response.status === NO_CONTENT) {
        return new Result(undefined, response);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new EpicenterError(`Response content-type '${contentType}' does not include 'application/json'`);
    }

    const json = await response.json();
    if ((response.status >= 200) && (response.status < 400)) {
        const result = new Result(
            paginated ? paginate(json, url, options) : json,
            response
        );
        return result;
    }

    const fault = new Fault(json, response);
    if (inert) throw fault;

    const retry = () => request(url, { ...options, inert: true });
    return errorManager.handle(fault, retry);
}

/**
 * Used to make the network calls in all API adapters
 */
export default class Router {
    /**
     * The root path used for the call, essentially protocol + hostname
     * @type {string}
     */
    get server() {
        return this._server;
    }
    set server(value) {
        this._server = value;
    }

    /**
     * The version of the Epicenter APIs being invoked; expected to stay at `3`
     * @type {number}
     */
    get version() {
        return this._version;
    }
    set version(value) {
        this._version = value;
    }

    /**
     * Name of the account; for administrative use, this value should be set to 'epicenter'
     * @type {string}
     */
    get accountShortName() {
        return this._accountShortName;
    }
    set accountShortName(value) {
        this._accountShortName = value;
    }

    /**
     * Name of the project; for administrative use, this value should be set to 'manager'
     * @type {string}
     */
    get projectShortName() {
        return this._projectShortName;
    }
    set projectShortName(value) {
        this._projectShortName = value;
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
    get searchParams() {
        return this._searchParams;
    }
    set searchParams(query) {
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
                arr.push([key, value]);
                return arr;
            }, []);
        }
        this._searchParams = new URLSearchParams(query);
    }

    /**
     * Sets the root path. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [server] Root path to use
     * @returns {Router}        The Router instance
     */
    withServer(server) {
        if (typeof server !== 'undefined') this.server = server;
        return this;
    }

    /**
     * Sets the version. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [version]    Version to use
     * @returns {Router}            The Router instance
     */
    withVersion(version) {
        if (typeof version !== 'undefined') this.version = version;
        return this;
    }

    /**
     * Sets the account. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [accountShortName]   Account name to use
     * @returns {Router}                    The Router instance
     */
    withAccountShortName(accountShortName) {
        if (typeof accountShortName !== 'undefined') this.accountShortName = accountShortName;
        return this;
    }

    /**
     * Sets the project. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string} [projectShortName]   Project name to use
     * @returns {Router}                    The Router instance
     */
    withProjectShortName(projectShortName) {
        if (typeof projectShortName !== 'undefined') this.projectShortName = projectShortName;
        return this;
    }

    /**
     * Sets the search parameters. Does nothing if invoked with no input. This is a part of a series of convenience functions for chaining sets on values.
     * @param {string|array|object|URLSearchParams} [searchParams]  Search parameters to use, utilizes the same setter as [searchParams](#Router-searchParams)
     * @returns {Router}                                            The Router instance
     */
    withSearchParams(searchParams) {
        if (typeof searchParams !== 'undefined') this.searchParams = searchParams;
        return this;
    }

    getURL(uriComponent) {
        if (!this.server) this.withServer(`${config.apiProtocol}://${config.apiHost}`);
        if (!this.accountShortName) this.withAccountShortName(config.accountShortName);
        if (!this.projectShortName) this.withProjectShortName(config.projectShortName);
        if (!this.version) this.withVersion(config.apiVersion);

        const url = new URL(`${this.server}`);
        url.pathname = `api/v${this.version}/${this.accountShortName}/${this.projectShortName}${prefix('/', uriComponent)}`;
        url.search = this.searchParams ?? new URLSearchParams();
        return url;
    }

    //Network Requests
    async get(uriComponent, options) {
        const url = this.getURL(uriComponent);

        /* Handle sufficiently large GET requests with POST calls instead */
        if (url.href.length > MAX_URL_LENGTH) {
            const newURL = new URL(url.href.split('?')[0]);
            return this.post(newURL, {
                ...options,
                body: url.search,
            });
        }

        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'GET',
        });
    }

    async delete(uriComponent, options) {
        const url = this.getURL(uriComponent);
        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'DELETE',
        });
    }

    async patch(uriComponent, options) {
        const url = this.getURL(uriComponent);
        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'PATCH',
        });
    }

    async post(uriComponent, options) {
        const url = this.getURL(uriComponent);
        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'POST',
        });
    }

    async put(uriComponent, options) {
        const url = this.getURL(uriComponent);
        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'PUT',
        });
    }
}

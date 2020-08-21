import fetch from 'cross-fetch';
import { EpicenterError, Fault, Result, identification, prefix, errorManager, config } from 'utils';


const DEFAULT_ACCOUNT_SHORT_NAME = 'epicenter';
const DEFAULT_PROJECT_SHORT_NAME = 'manager';
const MAX_URL_LENGTH = 2048;

function paginate(json, url, options) {
    const page = { ...json, allValues: [...json.values] };

    const next = async function() {
        const searchParams = new URLSearchParams(url.search);
        const first = page.first_result + page.max_results;
        if (page.allValues.length >= json.total_results) {
            page.done = true;
            return page;
        }

        searchParams.set('first', first);
        url.search = searchParams;
        // eslint-disable-next-line no-use-before-define
        const nextPage = await request(url, { ...options, paginated: false });
        page.allValues = page.allValues.concat(nextPage.values);
        Object.assign(page, nextPage);
        return page;
    };

    const withAll = async function() {
        // eslint-disable-next-line callback-return
        const { done, allValues } = await next();
        if (done) return allValues;
        return await withAll();
    };

    page.next = next;
    page.withAll = withAll;
    return page;
}

async function request(url, options) {
    const { method, body, includeAuthorization, inert, paginated } = options;
    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };
    const { session } = identification;
    if (includeAuthorization && session) {
        headers.Authorization = `Bearer ${session.token}`;
    }

    const response = await fetch(url, {
        method: method,
        cache: 'no-cache',
        headers: headers,
        redirect: 'follow',
        body: body ? JSON.stringify(body) : null,
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new EpicenterError(`Response content-type '${contentType}' does not include 'application/json'`);
    }

    const json = await response.json();
    if ((response.status >= 200) && (response.status < 400)) {
        return new Result(
            paginated ? paginate(json, url, options) : json,
            response
        );
    }

    const error = new Fault(json, response);
    if (inert) throw error;

    const retry = () => request(url, { method, body, includeAuthorization, inert: true });
    return errorManager.handle(error, retry);
}

export default class Router {
    get server() {
        return this._server;
    }

    set server(value) {
        this._server = value;
    }

    get version() {
        return this._version;
    }

    set version(value) {
        this._version = value;
    }

    get accountShortName() {
        return this._accountShortName;
    }

    set accountShortName(value) {
        this._accountShortName = value;
    }

    get projectShortName() {
        return this._projectShortName;
    }

    set projectShortName(value) {
        this._projectShortName = value;
    }

    get searchParams() {
        return this._searchParams;
    }

    set searchParams(query) {
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
        this._searchParams = query;
    }

    withServer(server) {
        if (server) this.server = server;
        return this;
    }

    withVersion(version) {
        if (version) this.version = version;
        return this;
    }

    withAccountShortName(accountShortName) {
        if (accountShortName) this.accountShortName = accountShortName;
        return this;
    }

    withProjectShortName(projectShortName) {
        if (projectShortName) this.projectShortName = projectShortName;
        return this;
    }

    withSearchParams(searchParams) {
        if (!searchParams) return this;
        const isEmpty = typeof searchParams === 'object' && Object.entries(searchParams).length === 0;
        if (!isEmpty) this.searchParams = searchParams;
        return this;
    }

    configure() {
        if (!this.server) this.withServer(`${config.apiProtocol}://${config.apiHost}`);
        if (!this.accountShortName) this.withAccountShortName(config.accountShortName);
        if (!this.projectShortName) this.withProjectShortName(config.projectShortName);
        if (!this.version) this.withVersion(config.apiVersion);
    }

    getURL(uriComponent) {
        this.configure();
        const url = new URL(`${this.server}`);
        url.pathname = `api/v${this.version}/${this.accountShortName}/${this.projectShortName}${prefix('/', uriComponent)}`;
        url.search = new URLSearchParams(this.searchParams);
        return url;
    }

    //Network Requests
    async get(uriComponent, options) {
        const url = this.getURL(uriComponent);

        /* Handle sufficiently large GET requests with POST calls instead */
        if (url.href.length > MAX_URL_LENGTH) {
            const newURL = new URL(url.href.split('?')[0]);
            return this.post(newURL, {
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

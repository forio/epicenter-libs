import fetch from 'cross-fetch';
import config from './config.js';
import identification from './identification.js';
import errorManager from './error-manager.js';
import { Fault, EpicenterError, Result, toQueryString, prefix } from './utility.js';

const DEFAULT_ACCOUNT_SHORT_NAME = 'epicenter';
const DEFAULT_PROJECT_SHORT_NAME = 'manager';

async function request(url, { method, body, includeAuthorization, inert }) {
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
        throw new EpicenterError(`Response content-type(${contentType}) does not include 'application/json'`);
    }

    if ((response.status >= 200) && (response.status < 400)) {
        return new Result(response.status, response.headers, await response.json());
    }

    const error = new Fault(response.status, await response.json());
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
        return this._searchParams || '';
    }

    set searchParams(value) {
        this._searchParams = toQueryString(value);
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

    async configure() {
        await config.load();
        if (!this.server) this.withServer(`${config.apiScheme}://${config.apiHost}`);
        if (!this.accountShortName) this.withAccountShortName(config.accountShortName);
        if (!this.projectShortName) this.withProjectShortName(config.projectShortName);
        if (!this.version) this.withVersion(config.apiVersion);
    }

    async getURL(uriComponent) {
        await this.configure();
        const url = new URL(`${this.server}`);
        url.pathname = `v${this.version}/${this.accountShortName}/${this.projectShortName}${prefix('/', uriComponent)}`;
        url.search = this.searchParams;
        return url;
    }

    //Network Requests
    async get(uriComponent, options) {
        const url = await this.getURL(uriComponent);
        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'GET',
        });
    }

    async delete(uriComponent, options) {
        const url = await this.getURL(uriComponent);
        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'DELETE',
        });
    }

    async patch(uriComponent, options) {
        const url = await this.getURL(uriComponent);
        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'PATCH',
        });
    }

    async post(uriComponent, options) {
        const url = await this.getURL(uriComponent);
        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'POST',
        });
    }

    async put(uriComponent, options) {
        const url = await this.getURL(uriComponent);
        return request(url, {
            includeAuthorization: true,
            ...options,
            method: 'PUT',
        });
    }
}

import fetch from 'cross-fetch';
import config from './config.js';
import store from './store.js';
import * as utility from './utility.js';

const DEFAULT_ACCOUNT_SHORT_NAME = 'epicenter';
const DEFAULT_PROJECT_SHORT_NAME = 'manager';

async function request(url, { method, body, includeAuthorization }) {
    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };
    const authToken = store.getItem(utility.AUTH_TOKEN);

    if (includeAuthorization && authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
        method: method,
        cache: 'no-cache',
        headers: headers,
        redirect: 'follow',
        body: body ? JSON.stringify(body) : null,
    });

    const contentType = response.headers.get('content-type');
    if (!contentType && !contentType.includes('application/json')) {
        throw new utility.EpicenterError(`Response content-type(${contentType}) does not include 'application/json'`);
    }

    if ((response.status >= 200) && (response.status < 400)) {
        return new utility.Result(response.status, response.headers, await response.json());
    } else {
        throw new utility.Fault(response.status, await response.json());
    }
}

export default class Router {
    _accountShortName = DEFAULT_ACCOUNT_SHORT_NAME;
    _projectShortName = DEFAULT_PROJECT_SHORT_NAME;

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

    withServer(server) {
        this.server = server || this.server;
        return this;
    }

    withVersion(version) {
        this.version = version || this.version;
        return this;
    }

    withAccountShortName(accountShortName) {
        this.accountShortName = accountShortName || this.accountShortName;
        return this;
    }

    withProjectShortName(projectShortName) {
        this.projectShortName = projectShortName || this.projectShortName;
        return this;
    }

    getURL(uri) {
        return `${this.server}/v${this.version}/${this.accountShortName}/${this.projectShortName}${uri}`;
    }

    //Network Requests
    async get(uri, options) {
        await config.load();
        if (!this.server) this.withServer(`${config.apiScheme}://${config.apiHost}`);
        if (!this.version) this.withVersion(config.apiVersion);

        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'GET',
        });
    }

    async delete(uri, options) {
        await config.load();
        if (!this.server) this.withServer(`${config.apiScheme}://${config.apiHost}`);
        if (!this.version) this.withVersion(config.apiVersion);

        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'DELETE',
        });
    }

    async patch(uri, options) {
        await config.load();
        if (!this.server) this.withServer(`${config.apiScheme}://${config.apiHost}`);
        if (!this.version) this.withVersion(config.apiVersion);

        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'PATCH',
        });
    }

    async post(uri, options) {
        await config.load();
        if (!this.server) this.withServer(`${config.apiScheme}://${config.apiHost}`);
        if (!this.version) this.withVersion(config.apiVersion);

        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'POST',
        });
    }

    async put(uri, options) {
        await config.load();
        if (!this.server) this.withServer(`${config.apiScheme}://${config.apiHost}`);
        if (!this.version) this.withVersion(config.apiVersion);

        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'PUT',
        });
    }
}

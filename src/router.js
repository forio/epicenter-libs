import fetch from 'cross-fetch';
import config from './config.js';
import identification from './identification';
import errorManager from './error-manager.js';
import * as utility from './utility.js';

const DEFAULT_ACCOUNT_SHORT_NAME = 'epicenter';
const DEFAULT_PROJECT_SHORT_NAME = 'manager';

async function request(url, { method, body, includeAuthorization, inert }) {
    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };
    const identity = identification.get();
    if (includeAuthorization && identity) {
        headers.Authorization = `Bearer ${identity.session}`;
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
    }

    const error = new utility.Fault(response.status, await response.json());
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

    async configure() {
        await config.load();
        if (!this.server) this.withServer(`${config.apiScheme}://${config.apiHost}`);
        if (!this.accountShortName) this.withAccountShortName(config.accountShortName);
        if (!this.projectShortName) this.withProjectShortName(config.projectShortName);
        if (!this.version) this.withVersion(config.apiVersion);
    }

    //Network Requests
    async get(uri, options) {
        await this.configure();
        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'GET',
        });
    }

    async delete(uri, options) {
        await this.configure();
        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'DELETE',
        });
    }

    async patch(uri, options) {
        await this.configure();
        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'PATCH',
        });
    }

    async post(uri, options) {
        await this.configure();
        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'POST',
        });
    }

    async put(uri, options) {
        await this.configure();
        return request(this.getURL(uri), {
            includeAuthorization: true,
            ...options,
            method: 'PUT',
        });
    }
}

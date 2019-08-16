import 'isomorphic-fetch';
import * as config from './config.js';
import * as store from './store.js';
import * as utility from './utility.js';

const DEFAULT_CONFIGURATION = new config.Config();

const DEFAULT_ACCOUNT_SHORT_NAME = 'epicenter';
const DEFAULT_PROJECT_SHORT_NAME = 'manager';

class Route {

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
}

export function getApiHttpScheme() {

    return DEFAULT_CONFIGURATION.apiScheme;
}

export function getApiHttpHost() {

    return DEFAULT_CONFIGURATION.apiHost;
}

export function getAPIVersion() {

    return DEFAULT_CONFIGURATION.apiVersion;
}

export class RouteBuilder {

    _route;

    constructor() {

        this._route = new Route();
    }

    withServer(server) {
        this._route.server = server;

        return this;
    }

    withVersion(version) {
        this._route.version = version;

        return this;
    }

    withAccountShortName(accountShortName) {
        this._route.accountShortName = accountShortName;

        return this;
    }

    withProjectShortName(projectShortName) {
        this._route.projectShortName = projectShortName;

        return this;
    }

    build() {

        return this._route;
    }
}

export const route = new RouteBuilder().withServer(`${getApiHttpScheme() }://${ getApiHttpHost()}`).withVersion(getAPIVersion()).withAccountShortName(DEFAULT_ACCOUNT_SHORT_NAME).withProjectShortName(DEFAULT_PROJECT_SHORT_NAME).build();

export function GET(uri, partialRoute, includeAuthorization = true) {

    return request('GET', uri, null, partialRoute, includeAuthorization);
}

export function DELETE(uri, partialRoute, includeAuthorization = true) {

    return request('DELETE', uri, null, partialRoute, includeAuthorization);
}

export function PATCH(uri, body, partialRoute, includeAuthorization = true) {

    return request('PATCH', uri, body, partialRoute, includeAuthorization);
}

export function POST(uri, body, partialRoute, includeAuthorization = true) {
    return request('POST', uri, body, partialRoute, includeAuthorization);
}

export function PUT(uri, body, partialRoute, includeAuthorization = true) {

    return request('PUT', uri, body, partialRoute, includeAuthorization);
}

function request(method, uri, body, partialRoute, includeAuthorization) {
    const currentRoute = (!partialRoute) ? route : new RouteBuilder()
        .withServer(partialRoute.server ? partialRoute.server : route.server)
        .withVersion(partialRoute.version ? partialRoute.version : route.version)
        .withAccountShortName(partialRoute.accountShortName ? partialRoute.accountShortName : route.accountShortName)
        .withProjectShortName(partialRoute.projectShortName ? partialRoute.projectShortName : route.projectShortName)
        .build();
    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };
    const authToken = store.StorageManager.getItem(utility.AUTH_TOKEN);

    if (includeAuthorization && authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    return fetch(`${currentRoute.server}/v${currentRoute.version}/${currentRoute.accountShortName}/${currentRoute.projectShortName}${uri}`, {
        method: method,
        cache: 'no-cache',
        headers: headers,
        redirect: 'follow',
        body: body ? JSON.stringify(body) : null,
    }).then((response) => {

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {

            return new Promise((resolve, reject) => {
                if ((response.status >= 200) && (response.status < 400)) {
                    response.json().then((body) => resolve(new utility.Result(response.status, response.headers, body)));
                } else {
                    response.json().then((error) => reject(new utility.Fault(response.status, error)));
                }
            });
        } else {
            throw new utility.EpicenterError(`Response content-type(${contentType}) does not include 'application/json'`);
        }
    });
}

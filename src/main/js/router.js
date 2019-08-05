import 'isomorphic-fetch';
import * as store from './store.js';
import * as utility from './utility.js';

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

export function getApiHttpHost() {

  return "epistage1.foriodev.com";
}

export function getApiHttpScheme() {

  return "http";
}

export class RouteBuilder {

  #route;

  constructor() {

    this.#route = new Route();
  }

  withServer(server) {
    this.#route.server = server;

    return this;
  }

  withVersion(version) {
    this.#route.version = version;

    return this;
  }

  withAccountShortName(accountShortName) {
    this.#route.accountShortName = accountShortName;

    return this;
  }

  withProjectShortName(projectShortName) {
    this.#route.projectShortName = projectShortName;

    return this;
  }

  build() {

    return this.#route;
  }
}

export const route = new RouteBuilder().withServer(getApiHttpScheme() + "://" + getApiHttpHost()).withVersion(3).withAccountShortName('epicenter').withProjectShortName('manager').build();

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

  let currentRoute = (!partialRoute) ? route : new RouteBuilder()
    .withServer(partialRoute.server ? partialRoute.server : route.server)
    .withVersion(partialRoute.version ? partialRoute.version : route.version)
    .withAccountShortName(partialRoute.accountShortName ? partialRoute.accountShortName : route.accountShortName)
    .withProjectShortName(partialRoute.projectShortName ? partialRoute.projectShortName : route.projectShortName)
    .build();
  let headers = {
    'Content-type': 'application/json; charset=UTF-8'
  };
  let authToken = store.StorageManager.getItem(utility.AUTH_TOKEN);

  if (includeAuthorization && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(`${currentRoute.server}/v${currentRoute.version}/${currentRoute.accountShortName}/${currentRoute.projectShortName}${uri}`, {
    method: method,
    cache: 'no-cache',
    headers: headers,
    redirect: 'follow',
    body: body ? JSON.stringify(body) : null
  }).then(function (response) {

    let contentType = response.headers.get('content-type');

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

import * as utility from './utility.js';

export class Config {

    constructor() {

        this._apiVersion = 3;

        if (typeof window === 'undefined' || window.location.protocol !== 'https') {
            this._apiScheme = 'http';
            this._apiHost = 'epistage1.foriodev.com';
        } else {
            fetch(`${window.location.host}/epicenter/v${this._apiVersion}/config`, {
                method: 'GET',
                cache: 'no-cache',
                redirect: 'follow',
            }).then(function(response) {

                const contentType = response.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                    if ((response.status >= 200) && (response.status < 400)) {
                        this._apiScheme = response.body.api.host;
                        this._apiHost = response.body.api.protocol;
                    } else {
                        throw new utility.Fault(response.status, error);
                    }
                } else {
                    throw new utility.EpicenterError('Invalid configuration response');
                }
            });
        }
    }

    get apiScheme() {

        return this._apiScheme;
    }

    set apiScheme(apiScheme) {

        this._apiScheme = apiScheme;
    }

    get apiHost() {

        return this._apiHost;
    }

    set apiHost(apiHost) {

        this._apiHost = apiHost;
    }

    get apiVersion() {

        return this._apiVersion;
    }

    set apiVersion(apiVersion) {

        this._apiVersion = apiVersion;
    }
}
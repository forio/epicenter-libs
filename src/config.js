import fetch from 'cross-fetch';
import { isBrowser, isNode, EpicenterError, Fault } from './utility.js';

class Config {
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

    loadNode() {
        // TODO -- use process env variables instead here for Node server
        this._apiVersion = 3;
        this._apiScheme = 'http';
        this._apiHost = 'epistage1.foriodev.com';
    }

    async loadBrowser() {
        const response = await fetch(`${window.location.host}/epicenter/v${this._apiVersion}/config`, {
            method: 'GET',
            cache: 'no-cache',
            redirect: 'follow',
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new EpicenterError('Invalid configuration response');
        }

        if ((response.status >= 200) && (response.status < 400)) {
            this._apiScheme = response.body.api.host;
            this._apiHost = response.body.api.protocol;
        } else {
            throw new Fault(response.status, await response.json());
        }
    }

    async load() {
        if (this.apiScheme && this.apiHost && this.apiVersion) {
            return;
        }

        if (isNode()) {
            this.loadNode();
            return;
        }

        if (isBrowser() && window.location.protocol.includes('http')) {
            await this.loadBrowser();
            return;
        }

        if (window.location.protocol.includes('file')) {
            this._apiVersion = 3;
            this._apiScheme = 'http';
            this._apiHost = 'epistage1.foriodev.com';
            return;
        }
        throw new EpicenterError('Could not identify environment; no configuration was setup');
    }
}

export default new Config();
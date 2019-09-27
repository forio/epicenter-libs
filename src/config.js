import fetch from 'cross-fetch';
import { isBrowser, isNode, EpicenterError, Fault } from './utility.js';


class Config {
    _apiVersion = 3;
    _apiScheme = 'http';
    _apiHost = 'epistage1.foriodev.com';

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

    get accountShortName() {
        return this._accountShortName;
    }

    set accountShortName(accountShortName) {
        this._accountShortName = accountShortName;
    }

    get projectShortName() {
        return this._projectShortName;
    }

    set projectShortName(projectShortName) {
        this._projectShortName = projectShortName;
    }

    isLocal() {
        if (!isBrowser()) return false;
        const host = window.location.host;
        return host === '127.0.0.1' ||
            host.indexOf('local.') === 0 ||
            host.indexOf('ngrok') !== -1 ||
            host.indexOf('localhost') === 0;
    }

    getPathAccountProject(pathname) {
        const match = pathname.match(/\/app\/([\w-]+)\/([\w-]+)/);
        if (match) {
            const [account, project] = match.slice(1);
            this.accountShortName = account;
            this.projectShortName = project;
        }
    }

    loadNode() {
        // TODO -- use process env variables instead here for Node server
    }

    async loadBrowser() {
        const isLocal = this.isLocal();
        const protocol = window.location.protocol;
        const host = isLocal ? this._apiHost : window.location.host;
        if (!isLocal) this.getPathAccountProject(window.location.pathname);

        const response = await fetch(`${protocol}//${host}/epicenter/v${this._apiVersion}/config`, {
            method: 'GET',
            cache: 'no-cache',
            redirect: 'follow',
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new EpicenterError('Invalid configuration response');
        }

        if ((response.status >= 200) && (response.status < 400)) {
            const body = await response.json();
            this.apiScheme = body.api.protocol;
            this.apiHost = body.api.host;
        } else {
            throw new Fault(response.status, await response.json());
        }
    }

    async load() {
        if (this.loaded) {
            return;
        }
        this.loaded = true;

        if (isNode()) {
            this.loadNode();
            return;
        }

        if (isBrowser() && window.location.protocol.includes('http')) {
            await this.loadBrowser();
            return;
        }

        if (window.location.protocol.includes('file')) {
            this.apiVersion = 3;
            this.apiScheme = 'http';
            this.apiHost = 'epistage1.foriodev.com';
            return;
        }
        throw new EpicenterError('Could not identify environment; no configuration was setup');
    }
}

const configManager = new Config();
export default configManager;

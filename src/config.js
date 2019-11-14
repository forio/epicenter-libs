import fetch from 'cross-fetch';
import { isBrowser, isNode, EpicenterError, Fault, last, BROWSER_STORAGE_TYPES } from './utility.js';
import { NodeStore, SessionStore, CookieStore } from './store.js';
import Identification from './identification.js';
const { COOKIE, SESSION } = BROWSER_STORAGE_TYPES;

const getIdentificationStore = (browserStorageType) => {
    if (isNode()) return new NodeStore();
    switch (browserStorageType) {
        case SESSION: return new SessionStore();
        case COOKIE:
        default: return new CookieStore();
    }
};

class Config {
    _apiVersion = 3;
    _apiScheme = 'http';
    _apiHost = 'api.forio.com';
    _localConfigProtocol = 'https:'
    _localConfigHost = 'test.forio.com';
    _browserStorageType = COOKIE;
    _identification = new Identification(getIdentificationStore(this.browserStorageType));

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

    get identification() {
        return this._identification;
    }

    set identification(identification) {
        this._identification = identification;
    }

    set browserStorageType(browserStorageType) {
        if (browserStorageType !== COOKIE && browserStorageType !== SESSION) {
            throw new EpicenterError(`Invalid browserStorageType: "${browserStorageType}", please use "${COOKIE}" or "${SESSION}".`);
        }
        if (this._browserStorageType !== browserStorageType) {
            this._browserStorageType = browserStorageType;
            const store = getIdentificationStore(browserStorageType);
            this.identification.useStore(store);
        }
    }

    get browserStorageType() {
        return this._browserStorageType;
    }

    get localConfigProtocol() {
        return this._localConfigProtocol;
    }

    set localConfigProtocol(localConfigProtocol) {
        if (last(localConfigProtocol) !== ':') {
            localConfigProtocol = `${localConfigProtocol}:`;
        }
        this._localConfigProtocol = localConfigProtocol;
    }

    get localConfigHost() {
        return this._localConfigHost;
    }

    set localConfigHost(localConfigHost) {
        this._localConfigHost = localConfigHost;
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
        const protocol = isLocal ? this.localConfigProtocol : window.location.protocol;
        const host = isLocal ? this.localConfigHost : window.location.host;
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
        this.loaded = true;
        return response;
    }

    async load() {
        if (this.loaded) return;

        if (isNode()) {
            this.loadNode();
            return;
        }

        if (isBrowser() && window.location.protocol.includes('http')) {
            await this.loadBrowser();
            return;
        }

        throw new EpicenterError('Could not identify environment; no configuration was setup');
    }
}

const config = new Config();
export default config;

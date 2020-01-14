import { EpicenterError, isBrowser, isNode } from 'utils';

const API_VERSION = 3;
class Config {
    _apiVersion = API_VERSION;

    constructor() {
        if (isBrowser()) return this.loadBrowser();
        if (isNode()) return this.loadNode();
        throw new EpicenterError('Could not identify environment; no configuration was setup');
    }

    get apiProtocol() {
        return this._apiProtocol;
    }

    set apiProtocol(apiProtocol) {
        if (!apiProtocol.startsWith('http')) return;
        if (apiProtocol.endsWith(':')) {
            apiProtocol = apiProtocol.slice(0, -1);
        }
        this._apiProtocol = apiProtocol;
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
        this.apiProtocol = 'https';
        this.apiHost = 'test.forio.com';
        return;
    }

    loadBrowser() {
        const isLocal = this.isLocal();
        const { protocol, pathname, host } = window.location;
        this.apiProtocol = isLocal ? 'https' : protocol;
        this.apiHost = isLocal ? 'forio.com' : host;

        const match = pathname.match(/\/app\/([\w-]+)\/([\w-]+)/);
        if (match) {
            const [account, project] = match.slice(1);
            this.accountShortName = account;
            this.projectShortName = project;
        }
    }
}

const config = new Config();
export default config;

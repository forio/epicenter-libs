import EpicenterError from './error';
import { isBrowser, isNode } from './helpers';


const API_VERSION = 3;
class Config {
    _apiVersion = API_VERSION;
    _apiProtocol = '';
    _apiHost = '';
    _useProjectProxy = false;
    _accountShortName = '';
    _projectShortName = '';

    authOverride?: string;

    constructor() {
        if (isBrowser()) {
            this.loadBrowser();
            return;
        }
        if (isNode()) {
            this.loadNode();
            return;
        }
        throw new EpicenterError('Could not identify environment; no configuration was setup');
    }

    /**
     * Protocol used to make network requests (whether `http://` or `https://`). It is typically set on-load based on your browser's URL. For local development, this is defaulted to `https`, and can be overwritten if desired.
     * @memberof config
     * @type {string}
     *  */
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

    /**
     * Hostname used to make network requests. It is typically set on-load based on your browser's URL. For local development, this is defaulted to `forio.com`, and can be overwritten if desired.
     * @memberof config
     * @type {string}
     *  */
    get apiHost() {
        return this._apiHost;
    }

    set apiHost(apiHost) {
        this._apiHost = apiHost;
    }

    /**
     * If true, requests are routed to project proxy server.
     * The proxy server processes requests and forwards them to the Epicenter platform as appropriate,
     * usually with some modification. Can be used to grant heightened privileges to a request.
     * @memberof config
     * @type {boolean}
     */
    get useProjectProxy() {
        return this._useProjectProxy;
    }

    set useProjectProxy(useProjectProxy) {
        this._useProjectProxy = useProjectProxy;
    }

    /**
     * Version used to make network requests. This is read-only variable intended for internal use.
     * @memberof config
     * @type {number}
     */
    get apiVersion() {
        return this._apiVersion;
    }

    set apiVersion(_apiVersion) {
        return;
    }

    /**
     * Account name used for making network requests. This is the default value used by Epicenter API adapters when making network requests without explicitly defining an account to use. It is defined on-load based on your browser's URL, and can be overwritten for local development.
     * @example
     * // with browser URL: https://forio.com/app/acme-simulations/foobar-game
     *
     * console.log(epicenter.config.accountShortName);
     * // should log 'acme-simulations'
     *
     * epicenter.runAdapter.get(123);
     * // instantiates a GET call with the URL: https://forio.com/api/v3/acme-simulations/foobar-game/run/123
     *
     * epicenter.config.accountShortName = 'globex-simuations';
     * epicenter.runAdapter.get(123);
     * // now instantiates a GET with the URL: https://forio.com/api/v3/globex-simulations/foobar-game/run/123
     *
     * epicenter.runAdapter.get(123, { accountShortName: 'initech-simulations' });
     * // now instantiates a GET with the URL: https://forio.com/api/v3/initech-simulations/foobar-game/run/123
     *
     * @memberof config
     * @type {string}
     */
    get accountShortName() {
        return this._accountShortName;
    }

    set accountShortName(accountShortName) {
        this._accountShortName = accountShortName;
    }
    /**
     * Project name used for making network requests. This is the default value used by Epicenter API adapters when making network requests without explicitly defining an account to use. It is defined on-load based on your browser's URL, and can be overwritten for local development.
     * @example
     * // with browser URL: https://forio.com/app/acme-simulations/foobar-game
     *
     * console.log(epicenter.config.projectShortName);
     * // should log 'foobar-game'
     *
     * epicenter.runAdapter.get(123);
     * // instantiates a GET call with the URL: https://forio.com/api/v3/acme-simulations/foobar-game/run/123
     *
     * epicenter.config.projectShortName = 'barfoo-game';
     * epicenter.runAdapter.get(123);
     * // now instantiates a GET with the URL: https://forio.com/api/v3/acme-simulations/barfoo-game/run/123
     *
     * epicenter.runAdapter.get(123, { projectShortName: 'barbaz-game' });
     * // now instantiates a GET with the URL: https://forio.com/api/v3/acme-simulations/barbaz-game/run/123
     *
     * @memberof config
     * @type {string}
     */
    get projectShortName() {
        return this._projectShortName;
    }

    set projectShortName(projectShortName) {
        this._projectShortName = projectShortName;
    }

    /**
     * Use to determines whether or not the environment is local.
     * @memberof config
     * @return whether or not environment is local.
     */
    isLocal() {
        if (!isBrowser()) return false;
        const host = window.location.host;
        return host === '127.0.0.1' ||
            host.indexOf('local.') === 0 ||
            host.indexOf('ngrok') !== -1 ||
            host.indexOf('localhost') === 0;
    }

    loadNode() {
        this.apiProtocol = 'https';
        this.apiHost = 'forio.com';
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

    setContext(context: {
        apiProtocol?: string,
        apiHost?: string,
        useProjectProxy?: boolean,
        accountShortName?: string,
        projectShortName?: string,
    }) {
        if (context.apiProtocol) this.apiProtocol = context.apiProtocol;
        if (context.apiHost) this.apiHost = context.apiHost;
        if (typeof context.useProjectProxy === 'boolean') this.useProjectProxy = context.useProjectProxy;
        if (context.accountShortName) this.accountShortName = context.accountShortName;
        if (context.projectShortName) this.projectShortName = context.projectShortName;
    }
}

const config = new Config();
/**
 * Configuration -- used to set up and configure global settings for Epicenter JS libs.
 * @namespace config
 */
export default config;

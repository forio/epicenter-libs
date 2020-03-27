import { EpicenterError, isBrowser, isNode } from 'utils';

const API_VERSION = 3;
class Config {
    _apiVersion = API_VERSION;

    constructor() {
        if (isBrowser()) return this.constructor.loadBrowser();
        if (isNode()) return this.constructor.loadNode();
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
     * Version used to make network requests. This is read-only variable intended for internal use.
     * @memberof config
     * @type {number}
     */
    get apiVersion() {
        return this._apiVersion;
    }

    set apiVersion(apiVersion) {
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
     * @return {Boolean} whether or not environment is local.
     */
    isLocal() {
        if (!isBrowser()) return false;
        const host = window.location.host;
        return host === '127.0.0.1' ||
            host.indexOf('local.') === 0 ||
            host.indexOf('ngrok') !== -1 ||
            host.indexOf('localhost') === 0;
    }

    static loadNode() {
        // TODO -- use process env variables instead here for Node server
        this.apiProtocol = 'https';
        this.apiHost = 'test.forio.com';
        return;
    }

    static loadBrowser() {
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
/**
 * Configuration -- used to set up and configure global settings for Epicenter JS libs.
 * @namespace config
 */
export default config;

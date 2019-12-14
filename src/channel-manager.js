import AckExtension from 'cometd/AckExtension';
import ReloadExtension from 'cometd/ReloadExtension';
import config from './config.js';
import identification from './identification.js';
import * as utility from './utility.js';
import errorManager from './error-manager.js';

const AUTH_TOKEN_KEY = 'com.forio.epicenter.token';
const COMETD_URL_POSTSCRIPT = '/v3/epicenter/cometd';

const DISCONNECTED = 'disconnected';
const CONNECTED = 'connected';


class CometdError extends Error {
    constructor(reply) {

        super();
        const { error, successful } = reply;
        if (error && error.includes('403') && !successful) {
            this.status = 401;
        }
        this.information = reply;
    }
}


class ChannelManager {

    url;
    customCometd;
    defaultCometd;
    subscriptions = new Map();
    state = DISCONNECTED;
    requireAcknowledgement = true;
    initialized = false;

    get cometd() {
        return this.customCometd || this.defaultCometd;
    }

    async reinit(customCometd, options) {
        await this.disconnect();
        this.initialized = false;
        this.customCometd = customCometd;
        return this.init(options);
    }

    async init(options = {}) {
        if (this.initialized) {
            return;
        }

        if (!utility.isNode() && utility.isBrowser()) {
            const cometd = await import('cometd');
            this.defaultCometd = new cometd.CometD();
        }

        await config.load();
        this.url = `${config.apiScheme}://${config.apiHost}${COMETD_URL_POSTSCRIPT}`;
        this.cometd.registerExtension('ack', new AckExtension());
        this.cometd.registerExtension('reload', new ReloadExtension());
        this.cometd.configure({
            url: this.url,
            logLevel: options.logLevel,
        });

        if (!utility.isNode() && utility.isBrowser()) {
            window.onunload = () => {
                if (this.cometd.getStatus() === CONNECTED) {
                    this.cometd.reload();
                    this.cometd.getTransport().abort();
                }
            };
        }
        this.initialized = true;
    }

    // Connects to CometD server
    async handshake(options = {}) {
        await this.init({ logLevel: 'error' });

        if (this.cometd.getStatus() !== DISCONNECTED) {
            return Promise.resolve();
        }

        const handshakeProps = {};
        const { session } = identification;

        if (session) {
            handshakeProps.ext = {
                [AUTH_TOKEN_KEY]: session.token,
                ack: this.requireAcknowledgement,
            };
        }

        this.cometd.ackEnabled = this.requireAcknowledgement;
        this.cometd.websocketEnabled = true;
        return new Promise((resolve, reject) => this.cometd.handshake(handshakeProps, (handshakeReply) => {
            if (handshakeReply.successful) {
                resolve(handshakeReply);
                return;
            }

            const error = new CometdError(handshakeReply);

            if (options.inert) {
                reject(error);
                return;
            }

            const retry = () => this.handshake({ ...options, inert: true });
            try {
                const result = errorManager.handle(error, retry);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        }));
    }

    async disconnect() {
        await this.init({ logLevel: 'error' });
        await this.empty();
        if (this.cometd.getStatus() !== CONNECTED) return Promise.resolve();

        return new Promise((resolve, reject) => this.cometd.disconnect((disconnectReply) => {
            if (!disconnectReply.successful) {
                reject(new utility.EpicenterError('Unable to disconnect from CometD server'));
            } else {
                resolve();
            }
        }));
    }

    async add(channel, options = {}) {
        await this.init({ logLevel: 'error' });
        // TODO, after you sort out the publish function, circle back and make sure your publish
        // sends out correctly formatted (i.e., relatively uniform) data for the update functions.
        const subscriptionProps = {};
        const { session } = identification;
        const { path, update } = channel;
        if (session) {
            subscriptionProps.ext = { [AUTH_TOKEN_KEY]: session.token };
        }
        if (this.cometd.getStatus() !== CONNECTED) {
            await this.handshake();
        }
        const handleCometdUpdate = ({ channel, data }) => update(JSON.parse(data));
        return new Promise((resolve, reject) => this.cometd.batch(() => {
            const subscription = this.cometd.subscribe(path, handleCometdUpdate, subscriptionProps, (subscribeReply) => {
                if (subscribeReply.successful) {
                    this.subscriptions.set(subscription.channel, subscription);
                    resolve(subscribeReply);
                    return;
                }

                const error = new CometdError(subscribeReply);

                if (options.inert) {
                    reject(error);
                    return;
                }

                const retry = () => this.handshake({ inert: true });
                try {
                    const result = errorManager.handle(error, retry);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        }));
    }

    async remove(subscription) {
        this.subscriptions.delete(subscription.channel);
        this.cometd.unsubscribe(subscription);
    }

    async empty() {
        const promises = [];
        this.subscriptions.forEach((subscription) => {
            promises.push(this.remove(subscription));
        });
        return Promise.all(promises);
    }
}
const channelManager = new ChannelManager();
export default channelManager;


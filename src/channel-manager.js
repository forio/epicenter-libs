import AckExtension from 'cometd/AckExtension';
import ReloadExtension from 'cometd/ReloadExtension';
import store from './store.js';
import config from './config.js';
import * as utility from './utility.js';
import errorManager from './error-manager.js';

const AUTH_TOKEN_KEY = 'com.forio.epicenter.token';
const COMETD_URL_POSTSCRIPT = ':9015/epicenter/cometd';

const DISCONNECTING = 'DISCONNECTING';
const DISCONNECTED = 'DISCONNECTED';
const CONNECTING = 'CONNECTING';
const CONNECTED = 'connected';

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
                if (this.state === CONNECTED) {
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
        console.log('%c begining handshake', 'font-size: 20px; color: #FB15B9FF;', this.cometd.getStatus());
        if (this.state !== DISCONNECTED) {
            return Promise.reject(new utility.EpicenterError(`Connection state should be DISCONNECTED during handshake; State: ${this.state}`));
        }

        this.state = CONNECTING;
        const handshakeProps = {};
        const authToken = store.getItem(utility.AUTH_TOKEN);

        if (authToken) {
            handshakeProps.ext = {
                [AUTH_TOKEN_KEY]: authToken,
                ack: this.requireAcknowledgement,
            };
        }

        this.cometd.ackEnabled = this.requireAcknowledgement;
        this.cometd.websocketEnabled = true;
        const res = new Promise((resolve, reject) => this.cometd.handshake(handshakeProps, (handshakeReply) => {
            if (handshakeReply.successful) {
                this.state = CONNECTED;
                resolve(handshakeReply);
                return;
            }

            // TODO: ask David what can be done here to make this look more like our conventional error
            const error = new utility.Fault('cometd', { information: handshakeReply });
            const defaultErrorHandler = (e) => {
                this.state = DISCONNECTED;
                reject(e);
            };

            if (options.inert) {
                defaultErrorHandler(error);
                return;
            }

            const retry = () => this.handshake({ inert: true });
            try {
                const result = errorManager.handle(error, retry);
                resolve(result);
            } catch (e) {
                defaultErrorHandler(e);
            }
        }));
        console.log('%c COMETD STATUS HANDSHAKE', 'font-size: 20px; color: #FB15B9FF;', this.cometd.getStatus());
        return res;
    }

    async disconnect() {
        await this.init({ logLevel: 'error' });
        await this.empty();
        if (this.state !== CONNECTED) return Promise.resolve();

        const prevState = this.state;
        this.state = DISCONNECTING;
        const res = new Promise((resolve, reject) => this.cometd.disconnect((disconnectReply) => {
            if (!disconnectReply.successful) {
                this.state = prevState;
                reject(new utility.EpicenterError('Unable to disconnect from CometD server'));
            } else {
                this.state = DISCONNECTED;
                resolve();
            }
        }));
        console.log('%c COMETD STATUS DISCONNECT', 'font-size: 20px; color: #FB15B9FF;', this.cometd.getStatus());
        return res;
    }

    async add(channel, options = {}) {
        await this.init({ logLevel: 'error' });
        const { path, update } = channel;
        const subscriptionProps = {};
        const authToken = store.getItem(utility.AUTH_TOKEN);
        if (authToken) {
            subscriptionProps.ext = { [AUTH_TOKEN_KEY]: authToken };
        }
        if (this.state !== CONNECTED) {
            await this.handshake();
        }
        return new Promise((resolve, reject) => this.cometd.batch(() => {
            const subscription = this.cometd.subscribe(path, update, subscriptionProps, (subscribeReply) => {
                if (subscribeReply.successful) {
                    this.subscriptions.set(subscription.channel, subscription);
                    resolve(subscribeReply);
                    return;
                }

                const error = new utility.Fault('cometd', { information: subscribeReply });
                
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


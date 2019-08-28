import AckExtension from 'cometd/AckExtension';
import ReloadExtension from 'cometd/ReloadExtension';
import store from './store.js';
import config from './config.js';
import * as utility from './utility.js';

const AUTH_TOKEN_KEY = 'com.forio.epicenter.token';
const COMETD_URL_POSTSCRIPT = ':9015/epicenter/cometd';

const DISCONNECTING = 0;
const DISCONNECTED = 1;
const CONNECTING = 2;
const CONNECTED = 3;

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
                } else {
                    this.disconnect();
                }
            };
        }
        this.initialized = true;
    }

    async handshake() {
        await this.init({
            logLevel: 'error',
        });

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
        return new Promise((resolve, reject) => this.cometd.handshake(handshakeProps, (handshakeReply) => {
            if (!handshakeReply.successful) {
                this.state = DISCONNECTED;
                reject(new utility.EpicenterError(`Unable to connect to the CometD server at ${this.url}`));
            } else {
                this.state = CONNECTED;
                resolve();
            }
        }));
    }

    async disconnect() {
        await this.empty();
        if (this.state !== CONNECTED) return Promise.resolve();

        const prevState = this.state;
        this.state = DISCONNECTING;
        return new Promise((resolve, reject) => this.cometd.disconnect((res) => {
            if (!res.successful) {
                this.state = prevState;
                reject(new utility.EpicenterError('Unable to disconnect from CometD server'));
            } else {
                this.state = DISCONNECTED;
                resolve();
            }
        }));
    }

    async add(channel) {
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
            const subscription = this.cometd.subscribe(path, update, subscriptionProps, (res) => {
                if (!res.successful) {
                    reject(new utility.EpicenterError(`Unable to subscribe to the channel ${path}`));
                } else {
                    resolve(subscription);
                }
            });
            this.subscriptions.set(subscription.channel, subscription);
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


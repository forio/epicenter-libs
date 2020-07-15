import AckExtension from 'cometd/AckExtension';
import ReloadExtension from 'cometd/ReloadExtension';
import { EpicenterError, identification, isBrowser, errorManager, config } from 'utils';
import { channelsEnabled } from 'adapters/project';

const AUTH_TOKEN_KEY = 'com.forio.epicenter.token';

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
        this.message = error;
    }
}

class CometdAdapter {

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

    async init(options = { logLevel: 'error' }) {
        if (this.initialized) {
            return;
        }

        if (isBrowser()) {
            const cometd = await import('cometd');
            this.defaultCometd = new cometd.CometD();
        }

        const { apiProtocol, apiHost, apiVersion } = config;
        this.url = `${apiProtocol}://${apiHost}/push/v${apiVersion}/cometd`;
        this.cometd.registerExtension('ack', new AckExtension());
        this.cometd.registerExtension('reload', new ReloadExtension());
        this.cometd.configure({
            url: this.url,
            logLevel: options.logLevel,
        });

        if (isBrowser()) {
            window.onunload = () => {
                if (this.cometd.getStatus() === CONNECTED) {
                    this.cometd.reload();
                    this.cometd.getTransport().abort();
                }
            };
        }
        this.initialized = true;
    }

    async checkEnabled() {
        const enabled = await channelsEnabled();
        if (!enabled) throw new EpicenterError('Push Channels are not enabled on this project');
    }

    // Connects to CometD server
    async handshake(options = {}) {
        await this.checkEnabled();
        await this.init();

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

            const retry = () => this.handshake({ inert: true });
            try {
                const result = errorManager.handle(error, retry);
                resolve(result);
            } catch (e) {
                reject(e);
            }
        }));
    }

    async disconnect() {
        if (!this.cometd) return Promise.resolve();

        await this.init();
        await this.empty();
        if (this.cometd.getStatus() !== CONNECTED) return Promise.resolve();

        return new Promise((resolve, reject) => this.cometd.disconnect((disconnectReply) => {
            if (!disconnectReply.successful) {
                reject(new EpicenterError('Unable to disconnect from CometD server'));
            } else {
                resolve();
            }
        }));
    }

    async add(channel, update, options = {}) {
        await this.init();
        const channels = [].concat(channel);

        if (this.cometd.getStatus() !== CONNECTED) {
            await this.handshake();
        }
        const subscriptionProps = {};
        const { session } = identification;
        if (session) {
            subscriptionProps.ext = { [AUTH_TOKEN_KEY]: session.token };
        }

        const handleCometdUpdate = ({ channel, data }) => {
            data = typeof data === 'string' ? JSON.parse(data) : data;
            return update(data);
        };
        const promises = [];
        this.cometd.batch(() => channels.forEach(({ path }) => promises.push(new Promise((resolve, reject) => {
            const subscription = this.cometd.subscribe(path, handleCometdUpdate, subscriptionProps, (subscribeReply) => {
                if (subscribeReply.successful) {
                    this.subscriptions.set(subscription.channel, subscription);
                    resolve(subscription);
                    return;
                }

                const error = new CometdError(subscribeReply);

                if (options.inert) {
                    reject(error);
                    return;
                }

                const retry = () => this.add(channel, update, { inert: true });
                try {
                    const result = errorManager.handle(error, retry);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        }))));
        return promises.length === 1 ?
            Promise.all(promises).then(([res]) => res) :
            Promise.all(promises);
    }

    async publish(channel, content, options = {}) {
        await this.init();
        const channels = [].concat(channel);

        if (this.cometd.getStatus() !== CONNECTED) {
            await this.handshake();
        }
        const publishProps = {};
        const { session } = identification;
        if (session) {
            publishProps.ext = { [AUTH_TOKEN_KEY]: session.token };
        }
        const promises = [];
        this.cometd.batch(() => channels.forEach(({ path }) => promises.push(new Promise((resolve, reject) => {
            this.cometd.publish(path, content, publishProps, (publishReply) => {
                if (publishReply.successful) {
                    resolve(publishReply);
                    return;
                }

                const error = new CometdError(publishReply);

                if (options.inert) {
                    reject(error);
                    return;
                }

                const retry = () => this.publish(channel, content, { inert: true });
                try {
                    const result = errorManager.handle(error, retry);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        }))));
        return promises.length === 1 ?
            Promise.all(promises).then(([res]) => res) :
            Promise.all(promises);
    }

    async remove(subscription) {
        await this.init();
        this.subscriptions.delete(subscription.channel);
        return new Promise((resolve, reject) => this.cometd.unsubscribe(subscription, (unsubscribeReply) => {
            if (unsubscribeReply.successful) {
                resolve(unsubscribeReply);
            }
            const error = new CometdError(unsubscribeReply);
            reject(error);
            /* Not using error handling here yet -- should we? */
        }));
    }

    async empty() {
        await this.init();
        const promises = [];
        this.cometd.batch(() => this.subscriptions.forEach((subscription) => {
            promises.push(this.remove(subscription));
        }));
        return Promise.all(promises);
    }
}
const cometdAdapter = new CometdAdapter();
export default cometdAdapter;


import { CometD, Message } from 'cometd';
import AckExtension from 'cometd/AckExtension';
import ReloadExtension from 'cometd/ReloadExtension';
import { EpicenterError, identification, isBrowser, errorManager, config } from 'utils/index';
import { channelsEnabled } from 'adapters/project';

const AUTH_TOKEN_KEY = 'com.forio.epicenter.token';

const DISCONNECTED = 'disconnected';
const CONNECTED = 'connected';


class CometdError extends Error {
    status?: number
    information: Message
    message: string

    constructor(reply: Message) {
        super();
        const { error = '', successful } = reply;
        if (error && error.includes('403') && !successful) {
            this.status = 401;
        }
        this.information = reply;
        this.message = error;
    }
}

interface CometdReply {
    successful: boolean,
}
interface Subscription {
    channel: string,
};
interface Channel {
    path: string,
}


// TODO -- split this code so that people who don't use channels do not import this by default
// https://levelup.gitconnected.com/code-splitting-for-libraries-bundling-for-npm-with-rollup-1-0-2522c7437697
class CometdAdapter {

    url: string = '';
    customCometd: any;
    defaultCometd: any;
    initialization: Boolean = false;
    subscriptions = new Map();
    state = DISCONNECTED;
    requireAcknowledgement = true;

    get cometd() {
        return this.customCometd || this.defaultCometd;
    }

    async startup(options = { logLevel: 'error' }) {
        const enabled = await channelsEnabled();
        if (!enabled) throw new EpicenterError('Push Channels are not enabled on this project');
        this.defaultCometd = new CometD();

        const { apiProtocol, apiHost, apiVersion } = config;
        this.url = `${apiProtocol}://${apiHost}/push/v${apiVersion}/cometd`;
        this.cometd.registerExtension('ack', new AckExtension());

        if (isBrowser()) {
            this.cometd.registerExtension('reload', new ReloadExtension());

            window.onunload = () => {
                if (this.cometd.getStatus() === CONNECTED) {
                    this.cometd.reload();
                    this.cometd.getTransport().abort();
                }
            };
        }

        // if (isNode()) {
        //     const { adapt } = await import('cometd-nodejs-client');
        //     adapt();
        // }

        this.cometd.configure({
            url: this.url,
            logLevel: options.logLevel,
        });
        return true;
    }

    async reinit(customCometd, options) {
        await this.disconnect();
        this.initialization = false;
        this.customCometd = customCometd;
        return this.init(options);
    }

    async init(options) {
        if (!this.initialization) {
            this.initialization = await this.startup(options);
        }
        return this.initialization;
    }

    // Connects to CometD server
    async handshake(options = {}) {
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

        return new Promise((resolve, reject) => this.cometd.disconnect((disconnectReply: CometdReply) => {
            if (!disconnectReply.successful) {
                reject(new EpicenterError('Unable to disconnect from CometD server'));
            } else {
                resolve();
            }
        }));
    }

    async add(channel: Channel | Channel[], update, options = {}) {
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

        const handleCometdUpdate = ({ data }) => {
            // TODO -- figure out why there's ambiguity here and try to remove it
            data = typeof data === 'string' ? JSON.parse(data) : data;
            return update(data);
        };

        const promises:Promise<Subscription>[] = [];
        this.cometd.batch(() => channels.forEach(({ path }) => promises.push(new Promise((resolve, reject) => {
            const subscription = this.cometd.subscribe(path, handleCometdUpdate, subscriptionProps, (subscribeReply: CometdReply) => {
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
        const { session } = identification;
        const publishProps = {
            ext: session ? { [AUTH_TOKEN_KEY]: session.token } : undefined,
        };
        const promises = [];
        this.cometd.batch(() => channels.forEach(({ path }) => promises.push(new Promise((resolve, reject) => {
            this.cometd.publish(path, content, publishProps, (publishReply: CometdReply) => {
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
        return new Promise((resolve, reject) => this.cometd.unsubscribe(subscription, (unsubscribeReply: CometdReply) => {
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


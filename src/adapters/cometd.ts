import type { CometD, Message, SubscribeMessage, SubscriptionHandle } from 'cometd';
import type Channel from './channel';

import { EpicenterError, Fault, identification, isBrowser, errorManager, config } from '../utils';
import { get as getProject } from './project';

const AUTH_TOKEN_KEY = 'com.forio.epicenter.token';

const DISCONNECTED = 'disconnected';
const CONNECTED = 'connected';
const FORBIDDEN = 403;
const CONNECT_META_CHANNEL = '/meta/connect';
const DISCONNECT_META_CHANNEL = '/meta/disconnect';
const COMETD_RECONNECTED = 'COMETD_RECONNECTED';
const DEFAULT_CHANNEL_PROTOCOL = 'cometd';

interface ChannelUpdate {
    data: string | Record<string, unknown>,
}

let cometdInstance: CometD | undefined;
class CometdAdapter {

    url = '';
    initialization: Promise<boolean> | undefined = undefined;
    subscriptions = new Map();
    isConnected = false;

    get cometd() {
        if (!cometdInstance) {
            throw new EpicenterError('Tried to get non-existent cometd');
        }
        return cometdInstance;
    }
    set cometd(instance) {
        cometdInstance = instance;
    }

    async startup(options: { logLevel: 'info' | 'debug' | 'warn' } = { logLevel: 'warn' }) {
        const project = await getProject();
        if (!project.channelEnabled) throw new EpicenterError('Push Channels are not enabled on this project');
        const channelProtocol = project.channelProtocol?.toLowerCase() || DEFAULT_CHANNEL_PROTOCOL;

        const { CometD } = await import('cometd');
        const AckExtension = (await import('cometd/AckExtension')).default;
        const ReloadExtension = (await import('cometd/ReloadExtension')).default;

        this.cometd = new CometD();
        const { apiProtocol, apiHost, apiVersion, accountShortName, projectShortName } = config;
        const accountProject = (accountShortName && projectShortName) ?
            `/${accountShortName}/${projectShortName}` :
            '/epicenter/manager';
        this.url = `${apiProtocol}://${apiHost}/push/v${apiVersion}${accountProject}/${channelProtocol}`;

        this.cometd.registerExtension('ack', new AckExtension());
        if (isBrowser()) {
            this.cometd.registerExtension('reload', new ReloadExtension());

            window.onunload = () => {
                if (this.cometd.getStatus() === CONNECTED) {
                    if (this.cometd.reload) this.cometd.reload();
                    const transport = this.cometd.getTransport();
                    if (transport) transport.abort();
                }
            };
        }

        // Current don't want to support CometD on node servers
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

    listenToMetaChannels() {
        const connectListener = new Promise((resolve, reject) => {
            this.cometd.addListener(CONNECT_META_CHANNEL, (message: Message) => {
                if (this.cometd.isDisconnected()) {
                    return;
                }
                const wasConnected = this.isConnected;
                this.isConnected = message.successful;
                if (!wasConnected && this.isConnected) {
                    const error = new Fault({
                        status: undefined,
                        message: 'Reconnected to CometD',
                        information: {
                            code: COMETD_RECONNECTED,
                        },
                    });
                    const retry = () => Promise.resolve();

                    try {
                        const result = errorManager.handle(error, retry);
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                }
            });
        });

        const disconnectListener = new Promise((resolve) => {
            this.cometd.addListener(DISCONNECT_META_CHANNEL, (message: Message) => {
                if (message.successful) {
                    this.isConnected = false;
                }
                resolve(message);
            });
        });

        return Promise.all([connectListener, disconnectListener]);
    }

    async init(options?: { logLevel: 'info' | 'debug' | 'warn' }) {
        if (!this.initialization) {
            this.initialization = this.startup(options);
        }
        return this.initialization;
    }

    // Connects to CometD server
    async handshake(options: { inert?: boolean } = {}) {
        await this.init();

        if (this.cometd.getStatus() !== DISCONNECTED) {
            return Promise.resolve();
        }

        let handshakeProps = {};
        const { session } = identification;

        if (session) {
            handshakeProps = {
                ext: {
                    [AUTH_TOKEN_KEY]: session.token,
                    ack: true,
                },
            };
        }

        // TODO -- this was line in the old libs, don't know why; probably not needed so commenting out for now.
        // this.cometd.ackEnabled = true;
        this.cometd.websocketEnabled = true;
        return new Promise((resolve, reject) => this.cometd.handshake(handshakeProps, (handshakeReply) => {
            if (handshakeReply.successful) {
                this.listenToMetaChannels();
                resolve(handshakeReply);
                return;
            }

            const errorMessage = handshakeReply.error ?? '';
            const error = new Fault({
                status: errorMessage.includes('403') ? FORBIDDEN : undefined,
                message: errorMessage,
                information: {
                    code: 'COMETD_ERROR',
                    ...handshakeReply,
                },
            });

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
        if (!this.initialization) return Promise.resolve();

        await this.init();
        await this.empty();
        if (this.cometd.getStatus() !== CONNECTED) return Promise.resolve();

        return new Promise((resolve, reject) => this.cometd.disconnect((disconnectReply: Message) => {
            if (!disconnectReply.successful) {
                reject(new EpicenterError('Unable to disconnect from CometD server'));
            } else {
                resolve(undefined);
            }
        }));
    }

    async add(
        channel: Channel | Channel[],
        update: (data: unknown) => unknown,
        options: { inert?: boolean } = {}
    ): Promise<SubscriptionHandle | SubscriptionHandle[]> {
        await this.init();
        const channels = ([] as Channel[]).concat(channel);

        if (this.cometd?.getStatus() !== CONNECTED) {
            await this.handshake();
        }
        const { session } = identification;
        const subscriptionProps = !session ? {} :
            { ext: { [AUTH_TOKEN_KEY]: session.token } };

        const handleCometdUpdate = ({ data }: ChannelUpdate) => {
            // TODO -- figure out why there's ambiguity here and try to remove it
            data = typeof data === 'string' ? JSON.parse(data) : data;
            return update(data);
        };

        const promises: Promise<SubscriptionHandle>[] = [];
        this.cometd.batch(() => channels.forEach(({ path }) => promises.push(new Promise((resolve, reject) => {
            const subscription = this.cometd.subscribe(path, handleCometdUpdate, subscriptionProps, (subscribeReply: SubscribeMessage) => {
                if (subscribeReply.successful) {
                    this.subscriptions.set(subscription.channel, subscription);
                    resolve(subscription);
                    return;
                }

                const errorMessage = subscribeReply.error ?? '';
                const error = new Fault({
                    status: errorMessage.includes('403') ? FORBIDDEN : undefined,
                    message: errorMessage,
                    information: {
                        code: 'COMETD_ERROR',
                        ...subscribeReply,
                    },
                });

                if (options.inert) {
                    reject(error);
                    return;
                }

                const retry = () => this.add(channel, update, { inert: true });
                try {
                    const result = errorManager.handle<SubscriptionHandle | SubscriptionHandle[]>(error, retry);
                    const sub = Array.isArray(result) ? result[0] : result;
                    resolve(sub);
                } catch (e) {
                    reject(e);
                }
            });
        }))));
        return promises.length === 1 ?
            Promise.all(promises).then(([res]) => res) :
            Promise.all(promises);
    }

    async publish(
        channel: Channel | Channel[],
        content: Record<string, unknown>,
        options: { inert?: boolean } = {}
    ) {
        await this.init();
        const channels = ([] as Channel[]).concat(channel);

        if (this.cometd.getStatus() !== CONNECTED) {
            await this.handshake();
        }
        const { session } = identification;
        const publishProps = {
            ext: session ? { [AUTH_TOKEN_KEY]: session.token } : undefined,
        };
        const promises: Promise<Message>[] = [];
        this.cometd.batch(() => channels.forEach(({ path }) => promises.push(new Promise((resolve, reject) => {
            this.cometd.publish(path, content, publishProps, (publishReply: Message) => {
                if (publishReply.successful) {
                    resolve(publishReply);
                    return;
                }

                const errorMessage = publishReply.error ?? '';
                const error = new Fault({
                    status: errorMessage.includes('403') ? FORBIDDEN : undefined,
                    message: errorMessage,
                    information: {
                        code: 'COMETD_ERROR',
                        ...publishReply,
                    },
                });

                if (options.inert) {
                    reject(error);
                    return;
                }

                const retry = () => this.publish(channel, content, { inert: true });
                try {
                    const result = errorManager.handle<Message | Message[]>(error, retry);
                    const message = Array.isArray(result) ? result[0] : result;
                    resolve(message);
                } catch (e) {
                    reject(e);
                }
            });
        }))));
        return promises.length === 1 ?
            Promise.all(promises).then(([res]) => res) :
            Promise.all(promises);
    }

    async remove(subscription: SubscriptionHandle) {
        await this.init();
        this.subscriptions.delete(subscription.channel);
        return new Promise((resolve, reject) => this.cometd.unsubscribe(subscription, (unsubscribeReply: Message) => {
            if (unsubscribeReply.successful) {
                resolve(unsubscribeReply);
            }
            const errorMessage = unsubscribeReply.error ?? '';
            // No default error handling for this
            const error = new Fault({
                status: undefined,
                message: errorMessage,
                information: {
                    code: 'COMETD_ERROR',
                    ...unsubscribeReply,
                },
            });
            reject(error);
        }));
    }

    async empty() {
        await this.init();
        this.cometd.clearSubscriptions();
        this.subscriptions.clear();
    }
}
const cometdAdapter = new CometdAdapter();
export default cometdAdapter;

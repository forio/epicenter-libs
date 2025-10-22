import type { CometD, Message, SubscriptionHandle } from 'cometd';
import type Channel from './channel';

import { EpicenterError, Fault, identification, isBrowser, errorManager, config } from '../utils';
import { get as getProject } from './project';

const AUTH_TOKEN_KEY = 'com.forio.epicenter.token';

const IDLE = 'idle';
const FAILED = 'failed';
const CONNECTED = 'connected';
const SUCCEEDED = 'succeeded';
const CONNECTING = 'connecting';
const HANDSHAKING = 'handshaking';
const DISCONNECTED = 'disconnected';
const FORBIDDEN = 403;
const CONNECT_META_CHANNEL = '/meta/connect';
const DISCONNECT_META_CHANNEL = '/meta/disconnect';
const HANDSHAKE_META_CHANNEL = '/meta/handshake';
const COMETD_RECONNECTED = 'COMETD_RECONNECTED';
const DEFAULT_CHANNEL_PROTOCOL = 'cometd';

type HandshakeState = 'idle' | 'handshaking' | 'succeeded' | 'failed';

// error messages that indicate session invalidation as
// described in cometd documentation and oumuamua source code:
// https://docs.cometd.org/current/reference/#_javascript_disconnect
// https://github.com/zenbones/SmallMind/blob/main/bayeux/oumuamua/server/spi/src/main/java/org/smallmind/bayeux/oumuamua/server/spi/MetaProcessingException.java

const SESSION_INVALIDATION_ERRORS = [
    '402',
    'session_unknown',
    'invalid client id',
    'missing client id',
    'session has been disconnected',
    'invalid session type',
    'handshake_denied',
    'handshake_failed',
];

function isSessionInvalidationError(errorMessage: string): boolean {
    const lowerError = errorMessage.toLowerCase();
    return SESSION_INVALIDATION_ERRORS.some((pattern) => {
        return lowerError.includes(pattern.toLowerCase());
    });
}

function isIllegalStateError(error: unknown): boolean {
    return error instanceof Error && error.message.toLowerCase().includes('illegal state');
}

function shouldRehandshake(reply: Message): boolean {
    const advice = reply.advice?.reconnect;
    if (advice === 'handshake') {
        return true;
    }

    const errorMessage = reply.error ?? '';
    return isSessionInvalidationError(errorMessage);
}

let cometdInstance: CometD | undefined;
class CometdAdapter {
    url = '';
    initialization: Promise<boolean> | undefined = undefined;
    handshakePromise: Promise<void> | undefined = undefined;
    subscriptions = new Map<string, SubscriptionHandle>();
    isConnected = false;
    handshakeState: HandshakeState = IDLE;
    pendingOperations: Array<() => Promise<unknown>> = [];
    processingQueue = false;

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
        const { AckExtension } = await import('cometd');
        const { ReloadExtension } = await import('cometd');

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
        this.cometd.addListener(HANDSHAKE_META_CHANNEL, (message: Message) => {
            if (message.successful) {
                this.handshakeState = SUCCEEDED;
                this.processPendingOperations();
            } else {
                this.handshakeState = FAILED;
                this.handleHandshakeFailure(message);
            }
        });

        const connectListener = new Promise((resolve, reject) => {
            this.cometd.addListener(CONNECT_META_CHANNEL, (message: Message) => {
                if (this.cometd.isDisconnected()) {
                    return;
                }
                const wasConnected = this.isConnected;
                this.isConnected = message.successful || false;

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
                    this.processPendingOperations();
                } else if (wasConnected && !this.isConnected) {
                    this.handshakeState = IDLE;
                }
            });
        });

        const disconnectListener = new Promise((resolve) => {
            this.cometd.addListener(DISCONNECT_META_CHANNEL, (message: Message) => {
                if (message.successful) {
                    this.isConnected = false;
                    this.handshakeState = IDLE;
                }
                resolve(message);
            });
        });

        return Promise.all([connectListener, disconnectListener]);
    }

    private handleHandshakeFailure(message: Message) {
        if (shouldRehandshake(message)) {
            this.handshakeState = IDLE;
            this.handshakePromise = undefined;
        }
    }

    private async processPendingOperations() {
        if (this.processingQueue || this.pendingOperations.length === 0) return;

        this.processingQueue = true;
        const operations = [...this.pendingOperations];
        this.pendingOperations = [];

        try {
            await Promise.all(operations.map((op) => op().catch(console.error)));
        } finally {
            this.processingQueue = false;
        }
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

        // Prevent concurrent handshake attempts
        if (this.handshakePromise && this.handshakeState === HANDSHAKING) {
            return this.handshakePromise;
        }

        const currentStatus = this.cometd.getStatus();

        // If already connected and handshake succeeded, return immediately
        if (currentStatus === CONNECTED && this.handshakeState === SUCCEEDED) {
            return Promise.resolve();
        }

        // If CometD is connecting or handshaking, don't call handshake again - just wait
        if (currentStatus === CONNECTING || currentStatus === HANDSHAKING) {
            if (this.handshakePromise) {
                return this.handshakePromise;
            }
            // Return a rejected promise to indicate we can't handshake right now
            return Promise.reject(new Error('CometD is already connecting, please wait'));
        }

        // Only proceed if disconnected
        if (currentStatus !== DISCONNECTED) {
            return Promise.resolve();
        }

        this.handshakeState = HANDSHAKING;
        const { session } = identification;
        let handshakeProps = {};

        if (session) {
            handshakeProps = {
                ext: {
                    [AUTH_TOKEN_KEY]: session.token,
                    ack: true,
                },
            };
        }

        this.cometd.websocketEnabled = true;
        this.handshakePromise = new Promise((resolve, reject) => {
            this.cometd.handshake(handshakeProps, (handshakeReply) => {
                if (handshakeReply.successful) {
                    this.handshakeState = SUCCEEDED;
                    this.listenToMetaChannels();
                    resolve(undefined);
                    return;
                }

                this.handshakeState = FAILED;

                if (shouldRehandshake(handshakeReply)) {
                    this.handshakeState = IDLE;
                    this.handshakePromise = undefined;
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
            });
        });

        return this.handshakePromise;
    }

    async disconnect() {
        if (!this.initialization) return Promise.resolve();

        await this.init();
        await this.empty();
        if (this.cometd.getStatus() !== CONNECTED) return Promise.resolve();

        return new Promise((resolve, reject) => this.cometd.disconnect((disconnectReply: Message) => {
            if (disconnectReply.successful) {
                resolve(undefined);
                return;
            }

            const errorMessage = disconnectReply.error ?? '';
            if (isSessionInvalidationError(errorMessage)) {
                resolve(undefined);
                return;
            }

            reject(new EpicenterError('Unable to disconnect from CometD server'));
        }));
    }

    async add(
        channel: Channel,
        update: (data: unknown) => unknown,
        options: { inert?: boolean } = {},
    ): Promise<SubscriptionHandle> {
        await this.init();

        const currentStatus = this.cometd?.getStatus();
        if (currentStatus !== CONNECTED) {
            try {
                await this.handshake();
            } catch (error: unknown) {
                const errorObj = error as { message?: string };
                if (errorObj?.message?.includes('already connecting')) {
                    // Wait a moment and try again
                    const retryDelay = 500;
                    await new Promise((resolve) => setTimeout(resolve, retryDelay));
                    if (this.cometd?.getStatus() === CONNECTED) {
                        // Connection succeeded while we waited, continue to subscription
                        // Don't return here since we need to continue with the subscription logic
                    }
                }
                throw error;
            }
        }
        const { session } = identification;
        const subscriptionProps = !session ?
            {} :
            { ext: { [AUTH_TOKEN_KEY]: session.token } };

        const handleCometdUpdate = (message: Message) => {
            // TODO -- figure out why there's ambiguity here and try to remove it
            let data = message.data;
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (_error: unknown) {
                    // If parsing fails, use raw string
                }
            }
            return update(data);
        };

        return new Promise((resolve, reject) => {
            let subscription: SubscriptionHandle;
            try {
                subscription = this.cometd.subscribe(
                    channel.path,
                    handleCometdUpdate,
                    subscriptionProps,
                    (subscribeReply: Message) => {
                        if (subscribeReply.successful) {
                            this.subscriptions.set(channel.path, subscription);
                            resolve(subscription);
                            return;
                        }

                        if (shouldRehandshake(subscribeReply)) {
                            this.handshakeState = IDLE;
                            this.handshakePromise = undefined;
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

                        const retry = async () => {
                            if (shouldRehandshake(subscribeReply)) {
                                await this.handshake({ inert: true });
                            }
                            return this.add(channel, update, { inert: true });
                        };
                        try {
                            const result = errorManager.handle<SubscriptionHandle>(error, retry);
                            resolve(result);
                        } catch (e) {
                            reject(e);
                        }
                    },
                );
            } catch (error: unknown) {
                if (isIllegalStateError(error)) {
                    this.handshakeState = IDLE;
                    this.handshakePromise = undefined;
                    this.handshake()
                        .then(() => this.add(channel, update, options))
                        .then(resolve)
                        .catch(reject);
                    return;
                }
                reject(error);
            }
        });
    }

    async publish(
        channel: Channel,
        content: Record<string, unknown>,
        options: { inert?: boolean } = {},
    ): Promise<Message> {
        await this.init();
        if (this.cometd.getStatus() !== CONNECTED) {
            await this.handshake();
        }
        const { session } = identification;
        const publishProps = {
            ext: session ? { [AUTH_TOKEN_KEY]: session.token } : undefined,
        };

        return new Promise((resolve, reject) => {
            try {
                this.cometd.publish(
                    channel.path,
                    content,
                    publishProps,
                    (publishReply: Message) => {
                        if (publishReply.successful) {
                            resolve(publishReply);
                            return;
                        }

                        if (shouldRehandshake(publishReply)) {
                            this.handshakeState = IDLE;
                            this.handshakePromise = undefined;
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

                        const retry = async () => {
                            if (shouldRehandshake(publishReply)) {
                                await this.handshake({ inert: true });
                            }
                            return this.publish(channel, content, { inert: true });
                        };
                        try {
                            const result = errorManager.handle<Message>(error, retry);
                            resolve(result);
                        } catch (e) {
                            reject(e);
                        }
                    },
                );
            } catch (error: unknown) {
                if (isIllegalStateError(error)) {
                    this.handshakeState = IDLE;
                    this.handshakePromise = undefined;
                    this.handshake()
                        .then(() => this.publish(channel, content, options))
                        .then(resolve)
                        .catch(reject);
                    return;
                }
                reject(error);
            }
        });
    }

    async remove(subscription: SubscriptionHandle) {
        await this.init();

        // Find the subscription by iterating through the map
        let channelPath: string | undefined;
        for (const [path, sub] of this.subscriptions.entries()) {
            if (sub === subscription) {
                channelPath = path;
                break;
            }
        }

        if (channelPath) {
            this.subscriptions.delete(channelPath);
            if (this.cometd.getStatus() === DISCONNECTED) return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                this.cometd.unsubscribe(subscription, (unsubscribeReply: Message) => {
                    if (unsubscribeReply.successful) {
                        resolve(unsubscribeReply);
                        return;
                    }

                    const errorMessage = unsubscribeReply.error ?? '';

                    if (isSessionInvalidationError(errorMessage)) {
                        resolve(unsubscribeReply);
                        return;
                    }

                    const error = new Fault({
                        status: undefined,
                        message: errorMessage,
                        information: {
                            code: 'COMETD_ERROR',
                            ...unsubscribeReply,
                        },
                    });
                    reject(error);
                });
            } catch (error: unknown) {
                if (isIllegalStateError(error)) {
                    resolve(undefined);
                    return;
                }
                reject(error);
            }
        });
    }

    async empty() {
        await this.init();
        this.cometd.clearSubscriptions();
        this.subscriptions.clear();
    }
}

const cometdAdapter = new CometdAdapter();
export default cometdAdapter;

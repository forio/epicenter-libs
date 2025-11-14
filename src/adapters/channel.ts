import type { SubscriptionHandle, Message } from 'cometd';
import type { GenericScope } from '../utils/constants';

import { EpicenterError, SCOPE_BOUNDARY, PUSH_CATEGORY } from '../utils';
import cometdAdapter from './cometd';

// Generic type for push channel message custom data
export type ChannelMessageData = unknown;

// Base structure for channel push messages (this is what comes in message.data from cometd)
export interface ChannelMessage<D = ChannelMessageData> {
    date: string;
    address: {
        boundary: string;
        category: string;
        key: string;
    };
    data?: D;
}

export interface ChannelScope extends GenericScope {
    pushCategory: keyof typeof PUSH_CATEGORY;
}

const validateScope = (scope: ChannelScope) => {
    if (!scope) throw new EpicenterError('No scope found where one was required');
    const { scopeBoundary, scopeKey, pushCategory } = scope;
    if (!scopeBoundary) throw new EpicenterError('Missing scope component: scopeBoundary');
    if (!scopeKey) throw new EpicenterError('Missing scope component: scopeKey');
    if (!pushCategory) throw new EpicenterError('Missing scope component: pushCategory');
    if (!Object.prototype.hasOwnProperty.call(SCOPE_BOUNDARY, scopeBoundary)) throw new EpicenterError(`Invalid scope boundary: ${scopeBoundary}`);
    if (!Object.prototype.hasOwnProperty.call(PUSH_CATEGORY, pushCategory)) throw new EpicenterError(`Invalid push category: ${pushCategory}`);
};

/**
 * Used to subscribe to CometD channels. Pass in a channel scope to instantiate, if a subscription to that scope already exists it will use it.
 * */
export default class Channel<D = ChannelMessageData> {
    path: string;
    update: ((data: ChannelMessage<D>) => unknown) | undefined;
    subscription: SubscriptionHandle | null = null;

    /**
     * Channel constructor
     * @param scope object with the scope boundary, scope key, and push category. Defines the namespace for the channel
     */
    constructor(scope: ChannelScope) {
        const { scopeBoundary, scopeKey, pushCategory } = scope;
        validateScope(scope);
        this.path = `/${scopeBoundary.toLowerCase()}/${scopeKey}/${pushCategory.toLowerCase()}`;
        if (cometdAdapter.subscriptions.has(this.path)) {
            this.subscription = cometdAdapter.subscriptions.get(this.path) || null;
        }
    }

    publish(content: D): Promise<Message> {
        return cometdAdapter.publish(this, content);
    }

    /**
     * Subscribes to the CometD channel, attaching a handler for any channel updates. If a subscription already exists it will first unsubscribe, ensuring that only one subscription is ever attached to the channel.
     * @example
     * import { Channel, authAdapter, SCOPE_BOUNDARY, PUSH_CATEGORY } from 'epicenter-libs';
     * const session = authAdapter.getLocalSession();
     * const channel = new Channel({
     *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
     *     scopeKey: session.groupKey,
     *     pushCategory: PUSH_CATEGORY.CHAT,
     * });
     * await channel.subscribe((data) => {
     *      console.log(data.content);
     * });
     * @param update function that is called whenever a channel update occurs.
     * @returns the subscription object returned by CometD after a sucessful subscribe.
     */
    // eslint-disable-next-line complexity
    async subscribe(
        update: (data: ChannelMessage<D>) => unknown,
        options: { inert?: boolean } = {},
    ): Promise<SubscriptionHandle> {
        if (this.subscription) {
            try {
                await cometdAdapter.remove(this.subscription);
            } catch (error: unknown) {
                const errorObj = error as { message?: string; information?: { error?: string } };
                const errorMessage = errorObj?.message || errorObj?.information?.error || '';

                if (errorMessage.includes('session_unknown') || errorMessage.includes('402')) {
                    // Previous subscription already invalid due to session expiration
                } else {
                    // Re-throw other errors
                    throw error;
                }
            }
        }
        this.update = update;

        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                this.subscription = await cometdAdapter.add(this, update, options) as SubscriptionHandle;
                return this.subscription;
            } catch (error: unknown) {
                const errorObj = error as { message?: string; information?: { error?: string } };
                const errorMessage = errorObj?.message || errorObj?.information?.error || '';

                if ((errorMessage.includes('session_unknown') || errorMessage.includes('402')) && retryCount < maxRetries - 1) {
                    retryCount++;
                    // Force fresh handshake
                    cometdAdapter.handshakeState = 'idle';
                    cometdAdapter.handshakePromise = undefined;

                    // Wait a moment before retrying
                    const retryDelay = 1000;
                    const currentRetry = retryCount;
                    await new Promise((resolve) => setTimeout(resolve, retryDelay * currentRetry));
                    continue;
                }

                // Re-throw if not session_unknown or max retries exceeded
                throw error;
            }
        }

        throw new Error(`Failed to subscribe to ${this.path} after ${maxRetries} attempts`);
    }

    async unsubscribe(): Promise<void> {
        if (this.subscription) {
            await cometdAdapter.remove(this.subscription);
            this.subscription = null;
        }
    }

    async unsubscribeAll(): Promise<void> {
        await cometdAdapter.empty();
    }
}


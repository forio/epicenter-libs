import type { SubscriptionHandle, Message } from 'cometd';
import type { GenericScope } from '../utils/constants';

import { EpicenterError, SCOPE_BOUNDARY, PUSH_CATEGORY } from '../utils';
import cometdAdapter from './cometd';

// Generic type for push channel message custom data
export type ChannelMessageData = unknown;

// Base structure for channel push messages
export interface ChannelMessage<D = ChannelMessageData> {
    /** The destination address for the message. */
    address: {
        /** The scope boundary of the address (e.g. 'WORLD'). */
        boundary: string;
        /** The push category of the address (e.g. 'RUN'). */
        category: string;
        /** The scope key of the address (e.g. your worldKey if boundary is 'WORLD'). */
        key: string;
    };
    /** The sender of the message. */
    sender: {
        /** The type of the sender (e.g., 'USER', 'SYSTEM'). */
        type: string;
        /** The key of the sender. */
        key: string;
    };
    /** The message content/payload. */
    content: D;
    /** The ISO 8601 date string when the message was sent. */
    date: string;
    /** The type/category of the message. */
    type: string;
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
 *
 * @example
 * import { Channel, authAdapter, SCOPE_BOUNDARY, PUSH_CATEGORY } from 'epicenter-libs';
 * const session = authAdapter.getLocalSession();
 * const channel = new Channel({
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: session.groupKey,
 *     pushCategory: PUSH_CATEGORY.CHAT,
 * });
 * await channel.subscribe((data) => {
 *     console.log('Received message:', data);
 * });
 */
export default class Channel<D = ChannelMessageData> {
    path: string;
    update: ((data: ChannelMessage<D>) => unknown) | undefined;
    subscription: SubscriptionHandle | null = null;

    /**
     * Channel constructor
     *
     * @param scope                     Object with the scope boundary, scope key, and push category; defines the namespace for the channel
     * @param scope.scopeBoundary       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
     * @param scope.scopeKey            Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
     * @param scope.pushCategory        Push category, defines the type of channel; See [push category](#PUSH_CATEGORY) for all types
     */
    constructor(scope: ChannelScope) {
        const { scopeBoundary, scopeKey, pushCategory } = scope;
        validateScope(scope);
        this.path = `/${scopeBoundary.toLowerCase()}/${scopeKey}/${pushCategory.toLowerCase()}`;
        if (cometdAdapter.subscriptions.has(this.path)) {
            this.subscription = cometdAdapter.subscriptions.get(this.path) || null;
        }
    }

    /**
     * Publishes content to the CometD channel
     *
     * @example
     * import { Channel, authAdapter, SCOPE_BOUNDARY, PUSH_CATEGORY } from 'epicenter-libs';
     * const session = authAdapter.getLocalSession();
     * const channel = new Channel({
     *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
     *     scopeKey: session.groupKey,
     *     pushCategory: PUSH_CATEGORY.CHAT,
     * });
     * await channel.publish({ message: 'Hello!' });
     *
     * @param content   Content to publish to the channel
     * @returns promise that resolves to the CometD message response
     */
    publish(content: D): Promise<Message> {
        return cometdAdapter.publish(this, content);
    }

    /**
     * Subscribes to the CometD channel, attaching a handler for any channel updates. If a subscription already exists it will first unsubscribe, ensuring that only one subscription is ever attached to the channel.
     *
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
     *
     * @param update                Function that is called whenever a channel update occurs
     * @param [options]             Optional arguments
     * @param [options.inert]       If true, creates an inert subscription that doesn't trigger reconnection
     * @returns promise that resolves to the subscription object returned by CometD after a successful subscribe
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

    /**
     * Unsubscribes from the CometD channel
     *
     * @example
     * import { Channel, authAdapter, SCOPE_BOUNDARY, PUSH_CATEGORY } from 'epicenter-libs';
     * const session = authAdapter.getLocalSession();
     * const channel = new Channel({
     *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
     *     scopeKey: session.groupKey,
     *     pushCategory: PUSH_CATEGORY.CHAT,
     * });
     * await channel.subscribe((data) => console.log(data));
     * // Later...
     * await channel.unsubscribe();
     *
     * @returns promise that resolves when unsubscribed
     */
    async unsubscribe(): Promise<void> {
        if (this.subscription) {
            await cometdAdapter.remove(this.subscription);
            this.subscription = null;
        }
    }

    /**
     * Unsubscribes from all CometD channels
     *
     * @example
     * import { Channel, authAdapter, SCOPE_BOUNDARY, PUSH_CATEGORY } from 'epicenter-libs';
     * const session = authAdapter.getLocalSession();
     * const channel = new Channel({
     *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
     *     scopeKey: session.groupKey,
     *     pushCategory: PUSH_CATEGORY.CHAT,
     * });
     * await channel.subscribe((data) => console.log(data));
     * // Later, unsubscribe from all channels...
     * await channel.unsubscribeAll();
     *
     * @returns promise that resolves when all channels are unsubscribed
     */
    async unsubscribeAll(): Promise<void> {
        await cometdAdapter.empty();
    }
}


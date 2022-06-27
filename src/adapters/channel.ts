import type { Callback, SubscriptionHandle, Message } from 'cometd';
import type { GenericScope } from '../utils/constants';

import { EpicenterError, SCOPE_BOUNDARY, PUSH_CATEGORY } from '../utils';
import cometdAdapter from './cometd';

interface ChannelScope extends GenericScope {
    pushCategory: string,
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
export default class Channel {

    path: string;
    update: Callback | undefined;
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
            this.subscription = cometdAdapter.subscriptions.get(this.path);
        }
    }

    publish(content: FIXME): Promise<Message | Message[]> {
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
     * }).subscribe((data) => {
     *      console.log(data.content);
     * })
     * @param update function that is called whenever a channel update occurs.
     * @returns the subscription object returned by CometD after a sucessful subscribe.
     */
    async subscribe(
        update: (data: unknown) => unknown,
        options: { inert?: boolean } = {},
    ): Promise<SubscriptionHandle> {
        if (this.subscription) await cometdAdapter.remove(this.subscription);
        this.update = update;
        this.subscription = await cometdAdapter.add(this, update, options) as SubscriptionHandle;
        return this.subscription;
    }

    async unsubscribe(): Promise<void> {
        if (this.subscription) {
            await cometdAdapter.remove(this.subscription);
            this.subscription = null;
        }
    }
}



import type { Callback, SubscriptionHandle, Message } from 'cometd';
import { EpicenterError } from 'utils/index';
import { SCOPE_BOUNDARY, PUSH_CATEGORY } from 'utils/constants';
import cometdAdapter from './cometd';


const validateScope = (scope: ChannelScope) => {
    if (!scope) throw new EpicenterError('No scope found where one was required');
    const { scopeBoundary, scopeKey, pushCategory } = scope;
    if (!scopeBoundary) throw new EpicenterError('Missing scope component: scopeBoundary');
    if (!scopeKey) throw new EpicenterError('Missing scope component: scopeKey');
    if (!pushCategory) throw new EpicenterError('Missing scope component: pushCategory');
    if (!Object.prototype.hasOwnProperty.call(SCOPE_BOUNDARY, scopeBoundary)) throw new EpicenterError(`Invalid scope boundary: ${scopeBoundary}`);
    if (!Object.prototype.hasOwnProperty.call(PUSH_CATEGORY, pushCategory)) throw new EpicenterError(`Invalid push category: ${pushCategory}`);
};

/** Channel thingy */
export default class Channel {

    path: string;
    update: Callback | undefined;
    subscription: SubscriptionHandle | null = null;

    /**
     * Make a new channel
     * @param {*} scope wordsd here
     */
    constructor(scope: ChannelScope) {
        const { scopeBoundary, scopeKey, pushCategory } = scope;
        validateScope(scope);
        this.path = `/${scopeBoundary.toLowerCase()}/${scopeKey}/${pushCategory.toLowerCase()}`;
        if (cometdAdapter.subscriptions.has(this.path)) {
            this.subscription = cometdAdapter.subscriptions.get(this.path);
        }
    }

    /** This is the publis cahh
     * @param content someom
     * @returns {Promise} something here
     */
    publish(content: FIXME): Promise<Message | Message[]> {
        return cometdAdapter.publish(this, content);
    }

    async subscribe(
        update: (data: unknown) => unknown,
        options: { inert?: boolean } = {},
    ): Promise<SubscriptionHandle> {
        if (this.subscription) await this.unsubscribe();
        this.update = update;
        return cometdAdapter.add(this, update, options).then((subscription) => {
            if (Array.isArray(subscription)) subscription = subscription[0];
            this.subscription = subscription;
            return subscription;
        });
    }

    async unsubscribe(): Promise<void> {
        if (this.subscription) {
            await cometdAdapter.remove(this.subscription);
            this.subscription = null;
        }
    }
}



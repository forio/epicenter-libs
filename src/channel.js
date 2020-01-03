import channelManager from './channel-manager.js';

export default class Channel {

    path;
    update;
    subscription;

    constructor(scope) {
        if (typeof scope === 'string') {
            this.path = scope;
        } else if (typeof scope === 'object') {
            const { scopeBoundary, scopeKey, pushCategory } = scope;
            this.path = `/${scopeBoundary}/${scopeKey}/${pushCategory}`;
        }
        if (channelManager.subscriptions.has(this.path)) {
            this.subscription = channelManager.subscriptions.get(this.path);
        }
    }

    publish(content) {
        return channelManager.publish(this, content);
    }

    async subscribe(update, options) {
        if (this.subscription) this.unsubscribe();
        this.update = update;
        return channelManager.add(this, update, options).then((subscription) => {
            this.subscription = subscription;
            return subscription;
        });
    }

    unsubscribe() {
        this.subscription = null;
        channelManager.remove(this.subscription);
    }
}

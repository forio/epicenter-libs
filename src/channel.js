import channelManager from './channel-manager.js';

export default class Channel {

    #scopeBoundary;
    #scopeKey;
    #pushCategory;
    update;
    subscription;

    constructor({ scopeBoundary, scopeKey, pushCategory, update }) {
        this.#scopeBoundary = scopeBoundary;
        this.#scopeKey = scopeKey;
        this.#pushCategory = pushCategory;
        this.update = update;
    }

    get path() {
        return `/${this.#scopeBoundary}/${this.#scopeKey}/${this.#pushCategory}`;
    }

    async subscribe() {
        return channelManager.add(this).then((subscription) => {
            this.subscription = subscription;
            return subscription;
        });
    }

    unsubscribe() {
        this.subscription = null;
        channelManager.remove(this.subscription);
    }
}

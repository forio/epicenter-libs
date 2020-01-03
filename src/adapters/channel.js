import { EpicenterError } from 'utils';
import { cometdAdapter } from 'adapters';
import { SCOPE_BOUNDARY, PUSH_CATEGORY } from '~/constants';

const validateScope = (scope) => {
    if (!scope) throw new EpicenterError('No scope found where one was required');
    const { scopeBoundary, scopeKey, pushCategory } = scope;
    if (!scopeBoundary) throw new EpicenterError('Missing scope component: scopeBoundary');
    if (!scopeKey) throw new EpicenterError('Missing scope component: scopeKey');
    if (!pushCategory) throw new EpicenterError('Missing scope component: pushCategory');
    if (!SCOPE_BOUNDARY.hasOwnProperty(scopeBoundary)) throw new EpicenterError(`Invalid scope boundary: ${scopeBoundary}`);
    if (!PUSH_CATEGORY.hasOwnProperty(pushCategory)) throw new EpicenterError(`Invalid push category: ${pushCategory}`);
};

export default class Channel {

    path;
    update;
    subscription;

    constructor(scope) {
        const { scopeBoundary, scopeKey, pushCategory } = scope;
        validateScope(scope);
        this.path = `/${scopeBoundary}/${scopeKey}/${pushCategory}`;
        if (cometdAdapter.subscriptions.has(this.path)) {
            this.subscription = cometdAdapter.subscriptions.get(this.path);
        }
    }

    publish(content) {
        return cometdAdapter.publish(this, content);
    }

    async subscribe(update, options) {
        if (this.subscription) this.unsubscribe();
        this.update = update;
        return cometdAdapter.add(this, update, options).then((subscription) => {
            this.subscription = subscription;
            return subscription;
        });
    }

    unsubscribe() {
        this.subscription = null;
        cometdAdapter.remove(this.subscription);
    }
}



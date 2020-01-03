
const version = VERSION;
export { default as config } from '~/config';
export { version };
export {
    BROWSER_STORAGE_TYPE,
    SCOPE_BOUNDARY,
    RITUAL,
    PUSH_CATEGORY,
    LOCK_TYPE,
} from '~/constants';
export {
    errorManager,
    identification,
    Router,
} from 'utils';
export {
    Channel,
    accountAdapter,
    authAdapter,
    cometdAdapter,
    presenceAdapter,
    projectAdapter,
    runAdapter,
} from 'adapters';


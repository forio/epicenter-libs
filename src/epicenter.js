const version = VERSION;
export { default as config } from '~/config';
export { version };
export {
    BROWSER_STORAGE_TYPE,
    SCOPE_BOUNDARY,
    RITUAL,
    PUSH_CATEGORY,
    LOCK_TYPE,
} from 'utils/constants';
export {
    Router,
    errorManager,
} from 'utils';
export {
    Channel,
    accountAdapter,
    authAdapter,
    presenceAdapter,
    projectAdapter,
    runAdapter,
} from 'adapters';


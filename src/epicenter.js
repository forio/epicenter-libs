/* Main file; defines public interface & load order */
const version = VERSION;
export { version };
export {
    SCOPE_BOUNDARY,
    RITUAL,
    PUSH_CATEGORY,
    LOCK_TYPE,
} from 'utils/constants';
export {
    config,
    errorManager,
    Router,
} from 'utils';
export {
    Channel,
    accountAdapter,
    authAdapter,
    presenceAdapter,
    projectAdapter,
    runAdapter,
} from 'adapters';

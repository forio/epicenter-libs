const version = VERSION;
export { default as config } from '~/config';
export { version };
export {
    SCOPE_BOUNDARY,
    RITUAL,
    PUSH_CATEGORY,
    LOCK_TYPE,
} from 'utils/constants';
export {
    errorManager,
} from 'utils';
export {
    Channel,
    accountAdapter,
    authAdapter,
    presenceAdapter,
    projectAdapter,
    /**
     * Has all the run adapters see this other {@link https://github.com/forio Forio} more comment here
     * @namespace runAdapter
     */
    runAdapter,
} from 'adapters';

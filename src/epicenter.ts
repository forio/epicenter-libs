import 'regenerator-runtime/runtime';

/* Main file; defines public APIs & load order */
const version = '__VERSION__';
export { version };
export {
    SCOPE_BOUNDARY,
    RITUAL,
    PUSH_CATEGORY,
    ROLE,
} from 'utils/constants';
export {
    config,
    errorManager,
    Router,
} from 'utils/index';
export {
    Channel,
    accountAdapter,
    authAdapter,
    episodeAdapter,
    groupAdapter,
    leaderboardAdapter,
    presenceAdapter,
    projectAdapter,
    runAdapter,
    timeAdapter,
    vaultAdapter,
    worldAdapter,
} from 'adapters/index';

import 'regenerator-runtime/runtime';

/* yes, this string template literal is weird;
 * it's cause rollup's replace does not recogize __VERSION__ as a token otherwise */
const version = `Epicenter (v${'__VERSION__'}) for __BUILD__ | Build Date: __DATE__`;
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

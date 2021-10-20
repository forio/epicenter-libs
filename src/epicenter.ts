import 'regenerator-runtime/runtime';

/* yes, this string template literal is weird;
 * it's cause rollup's replace does not recogize __VERSION__ as an individual token otherwise */
const version = `Epicenter (v${'__VERSION__'}) for __BUILD__ | Build Date: __DATE__`;


import type { RetryFunction } from './utils/router';
import { authAdapter } from './adapters';
import { errorManager, identification, isBrowser, Fault } from './utils';

const UNAUTHORIZED = 401;
errorManager.registerHandler(
    (error: Fault) => error.status === UNAUTHORIZED && error.code === 'AUTHENTICATION_GROUP_EXPIRED',
    async<T>(error: Fault, retry: RetryFunction<T>) => {
        if (isBrowser() && retry.requestArguments) {
            const { url, method } = retry.requestArguments;
            if (url.toString().includes('/authentication') && method === 'POST') {
                // eslint-disable-next-line no-alert
                alert('This group has expired. Try logging into a different group');
            }
        }
        throw error;
    },
);
errorManager.registerHandler(
    (error) => error.status === UNAUTHORIZED && error.code === 'AUTHENTICATION_INVALIDATED',
    async<T>(error: Fault, retry: RetryFunction<T>) => {
        try {
            const groupKey = identification.session?.groupKey ?? '';
            await authAdapter.regenerate(groupKey, { objectType: 'user', inert: true });
            return await retry();
        } catch (e) {
            await authAdapter.logout();
            throw error;
        }
    }
);


export { version };
export {
    SCOPE_BOUNDARY,
    RITUAL,
    PUSH_CATEGORY,
    ROLE,
} from './utils/constants';

export {
    config,
    errorManager,
    Router,
} from './utils';

export {
    accountAdapter,
    adminAdapter,
    assetAdapter,
    authAdapter,
    chatAdapter,
    episodeAdapter,
    groupAdapter,
    leaderboardAdapter,
    presenceAdapter,
    projectAdapter,
    recaptchaAdapter,
    runAdapter,
    timeAdapter,
    userAdapter,
    vaultAdapter,
    worldAdapter,
    Channel,
} from './adapters';

import 'regenerator-runtime/runtime';

/* yes, this string template literal is weird;
 * it's cause rollup does not recogize __VERSION__ as an individual token otherwise */
const version = `Epicenter (v${'__VERSION__'}) for __BUILD__ | Build Date: __DATE__`;

import type { RetryFunction } from './utils/router';
import { authAdapter, cometdAdapter } from './adapters';
import { errorManager, identification, isBrowser, Fault, EpicenterError } from './utils';
import { Handler } from './utils/error-manager';

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
export const DEFAULT_ERROR_HANDLERS: Record<string, Handler> = {};

DEFAULT_ERROR_HANDLERS.cometdReconnected = errorManager.registerHandler(
    (error) => error.code === 'COMETD_RECONNECTED',
    async(error: Fault) => {
        if (isBrowser()) {
            console.warn('Cometd Reconnected. If you wish to react to this reconnection, register an error handler with identifier: error.code === "COMETD_RECONNECTED".', error);
        }
    }
);

DEFAULT_ERROR_HANDLERS.cometdError = errorManager.registerHandler(
    (error) => error.status === FORBIDDEN && error.code === 'COMETD_ERROR',
    async<T>(error: Fault, retry: RetryFunction<T>) => {
        console.warn('Cometd error. Attempting to reconnect.', error);
        await cometdAdapter.disconnect();
        return await retry();
    }
);

DEFAULT_ERROR_HANDLERS.authExpired = errorManager.registerHandler(
    (error: Fault) => error.status === UNAUTHORIZED && error.code === 'AUTHENTICATION_EXPIRED',
    async(error: Fault) => {
        await authAdapter.removeLocalSession();
        if (isBrowser()) {
            // eslint-disable-next-line no-alert
            alert('Session token has expired, try logging in again.');
        }
        throw error;
    },
);

DEFAULT_ERROR_HANDLERS.authGroupExpired = errorManager.registerHandler(
    (error: Fault) => error.status === UNAUTHORIZED && error.code === 'AUTHENTICATION_GROUP_EXPIRED',
    async(error: Fault) => {
        if (isBrowser()) {
            // eslint-disable-next-line no-alert
            alert('This group has expired. Try logging into a different group');
        }
        throw error;
    },
);

DEFAULT_ERROR_HANDLERS.authInvalidated = errorManager.registerHandler(
    (error) => error.status === UNAUTHORIZED && error.code === 'AUTHENTICATION_INVALIDATED',
    async<T>(error: Fault, retry: RetryFunction<T>) => {
        try {
            const session = identification.session;
            if (session?.objectType === 'admin') {
                throw new EpicenterError('Unhandled error: admin session was somehow invalidated');
            }
            const groupKey = session?.groupKey ?? '';
            await authAdapter.regenerate(groupKey, { objectType: 'user', inert: true });
            return await retry();
        } catch (e) {
            await authAdapter.removeLocalSession();
            throw error;
        }
    }
);

Object.freeze(DEFAULT_ERROR_HANDLERS);

/* Interfaces & Types */
export type { Session, UserSession, AdminSession } from './utils/identification';
export type { Group, Member } from './adapters/group';
export type { Vault } from './adapters/vault';
export type { GenericScope } from './utils/constants';

/* Version */
export { version };

/* Constants */
export {
    SCOPE_BOUNDARY,
    RITUAL,
    PUSH_CATEGORY,
    ROLE,
} from './utils/constants';

/* Auxilary Singletons/Classes */
export {
    config,
    errorManager,
    Router,
    Fault,
} from './utils';

/* Adapters */
export {
    accountAdapter,
    adminAdapter,
    assetAdapter,
    consensusAdapter,
    emailAdapter,
    authAdapter,
    chatAdapter,
    episodeAdapter,
    groupAdapter,
    leaderboardAdapter,
    presenceAdapter,
    projectAdapter,
    recaptchaAdapter,
    runAdapter,
    taskAdapter,
    timeAdapter,
    userAdapter,
    vaultAdapter,
    videoAdapter,
    vonageAdapter,
    worldAdapter,
    somebodyAdapter,
    dailyAdapter,
    matchmakerAdapter,
    walletAdapter,
    Channel,
} from './adapters';

/* APIs */
export {
    videoAPI,
    vonageAPI,
} from './apis';

/* Utility Functions */
export * as utils from './utilities';

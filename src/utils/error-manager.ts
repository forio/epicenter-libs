import { authAdapter } from 'adapters/index';
import identification from './identification';
import { isNode } from './helpers';


const handleByRelog = (error) => {
    let query = '';
    if (error.code) {
        query = query.concat(`?error=${error.code}`);
    }
    return authAdapter.logout().then(() => window.location.href = `/login.html${query}`);
};

const handleSSO = () => {
    return authAdapter.logout();
};

const handleUnknown = () => {
    return authAdapter.logout().then(() => window.location.href = '/unknown.html');
};

const handleByLoginMethod = (error) => {
    const { session } = identification;
    const loginType = session?.loginMethod?.objectType;
    switch (loginType) {
        case 'sso': return handleSSO(error);
        case 'none':return handleUnknown(error);
        case 'native':
        default: return handleByRelog(error);
    }
};

const UNAUTHORIZED = 401;
class ErrorManager {
    _handlers = [
        {/* Default Unauthorized (401) Error Handler */
            identifier: (error) => error.status === UNAUTHORIZED,
            handle: (error, retry) => {
                if (error.code === 'AUTHENTICATION_INVALIDATED') {
                    const groupKey = identification.session.groupKey;
                    return authAdapter.upgrade(groupKey, { objectType: 'user', inert: true })
                        .then(() => retry())
                        .catch(() => handleByLoginMethod(error));
                }
                if (isNode()) return Promise.reject(error);
                return handleByLoginMethod(error);
            },
        },
    ];

    get handlers() {
        return this._handlers;
    }

    registerHandler(identifier, handleFn) {
        this.handlers.unshift({
            identifier,
            handle: handleFn,
        });
    }

    async handle(error, retryFn, handlers/* which is undefined unless recursing */) {
        handlers = handlers || this.handlers;
        const index = handlers.findIndex(({ identifier }) => identifier(error));
        const handler = handlers[index];
        const remainingHandlers = index > 0 ? handlers.slice(index + 1) : [];
        if (!handler) throw error;
        let promise;
        try {
            promise = await handler.handle(error, retryFn).catch((err) => {
                /* This catch call ensures that handle always returns a promise,
                otherwise it'd be caught in the catch block below */
                throw err;
            });
        } catch (e) {
            promise = await this.handle(error, retryFn, remainingHandlers);
        }
        return promise;
    }
}

const errorManager = new ErrorManager();
/**
 * Configuration -- used to set up and configure global settings for Epicenter JS libs.
 * @namespace errorManager
 */
export default errorManager;

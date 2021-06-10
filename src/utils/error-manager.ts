import { authAdapter } from 'adapters/index';
import identification from './identification';
import { isNode } from './helpers';
import Fault from './fault';
import Result from './result';


const handleByRelog = (error: Fault) => {
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

const handleByLoginMethod = (error: Fault) => {
    if (isNode()) throw error;
    const { session } = identification;
    const loginType = session?.loginMethod?.objectType;
    switch (loginType) {
        case 'sso': return handleSSO();
        case 'none':return handleUnknown();
        case 'native':
        default: return handleByRelog(error);
    }
};

type Identifier = (error: Fault) => boolean
type RetryFunction = () => Promise<Result>
type HandleFunction = (error: Fault, retry: RetryFunction) => Promise<Result>

interface Handler {
    identifier: Identifier,
    handle: HandleFunction,
}

const UNAUTHORIZED = 401;
class ErrorManager {
    _handlers: Handler[] = [
        {/* Default Unauthorized (401) Error Handler */
            identifier: (error) => error.status === UNAUTHORIZED,
            handle: async(error: Fault, retry: RetryFunction) => {
                if (error.code === 'AUTHENTICATION_INVALIDATED') {
                    const groupKey = identification.session.groupKey;
                    await authAdapter.regenerate(groupKey, { objectType: 'user', inert: true });
                    try {
                        return await retry();
                    } catch (e) {
                        await handleByLoginMethod(error);
                        throw error;
                    }
                }
                await handleByLoginMethod(error);
                throw error;
            },
        },
    ];

    get handlers() {
        return this._handlers;
    }

    clearHandlers() {
        this._handlers = [];
    }

    registerHandler(
        identifier: Identifier,
        handleFn: HandleFunction
    ) {
        this.handlers.unshift({
            identifier,
            handle: handleFn,
        });
    }

    async handle(
        error: Fault,
        retryFn: RetryFunction,
        handlers?: Handler[]
    ): Promise<Result> {
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
            console.error('Handler failed due to error', e);
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

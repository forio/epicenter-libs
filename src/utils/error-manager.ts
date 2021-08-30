import Fault from './fault';
import Result from './result';


type Identifier = (error: Fault) => boolean
interface RetryFunction {
    (): Promise<Result>;
    requestArguments: {
        url: URL,
        method: string,
        body?: Record<string, unknown>,
        includeAuthorization?: boolean,
        inert?: boolean,
        paginated?: boolean,
        parsePage?: <T, V>(values: Array<T>) => Array<T|V>,
    };
}
type HandleFunction = (error: Fault, retry: RetryFunction) => Promise<unknown>

interface Handler {
    identifier: Identifier,
    handle: HandleFunction,
}

class ErrorManager {
    _handlers: Handler[] = [
        // {
        //     identifier: (error) => error.status === UNAUTHORIZED && error.code === 'AUTHENTICATION_INVALIDATED',
        //     handle: async(error: Fault, retry: RetryFunction) => {
        //         try {
        //             const groupKey = identification.session?.groupKey ?? '';
        //             await authAdapter.regenerate(groupKey, { objectType: 'user', inert: true });
        //             return await retry();
        //         } catch (e) {
        //             await authAdapter.logout();
        //             throw error;
        //         }
        //     },
        // }, {
        //     identifier: (error) => error.status === UNAUTHORIZED && error.code === 'AUTHENTICATION_GROUP_EXPIRED',
        //     handle: async(error: Fault, retry: RetryFunction) => {
        //         const { url, method } = retry.requestArguments;
        //         if (url.toString().includes('/authentication') && method === 'POST') {
        //             // eslint-disable-next-line no-alert
        //             if (isBrowser()) alert('This group has expired. Try logging into a different group');
        //         }
        //         throw error;
        //     },
        // },
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

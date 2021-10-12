import Fault from './fault';


type Identifier = (error: Fault) => boolean

type HandleFunction = <T>(error: Fault, retry: RetryFunction<T>) => Promise<T>

interface Handler {
    identifier: Identifier,
    handle: HandleFunction,
}

class ErrorManager {
    _handlers: Handler[] = [];

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

    async handle<Output>(
        error: Fault,
        retryFn: RetryFunction<Output>,
        handlers?: Handler[]
    ): Promise<Output> {
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

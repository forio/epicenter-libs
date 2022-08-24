import type { RetryFunction } from './router';
import Fault from './fault';


type Identifier = (error: Fault) => boolean
/* eslint-disable  @typescript-eslint/no-explicit-any */
type HandleFunction = <T>(error: Fault, retry: RetryFunction<T>) => Promise<any>
/* eslint-enable  @typescript-eslint/no-explicit-any */

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
            const remainingHandlers = index > -1 ? [...handlers.slice(0, index), ...handlers.slice(index + 1)] : [];
            // Try to handle the new error with the remaining handlers, otherwise keep trying to handle the original error
            const handleableError = e instanceof Fault ? e : error;
            promise = await this.handle(handleableError, retryFn, remainingHandlers);
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

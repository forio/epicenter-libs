
class ErrorManager {
    _handlers = [];

    get handlers() {
        return this._handlers;
    }

    registerHandler(identifier, handleFn) {
        this.handlers.push({
            identifier,
            handle: handleFn,
        });
    }

    async handle(error, retryFn) {
        const handler = this.handlers.find(({ identifier }) => identifier(error));
        if (!handler) throw error;
        return handler.handle(error, retryFn);
    }
}

const errorManager = new ErrorManager();
export default errorManager;

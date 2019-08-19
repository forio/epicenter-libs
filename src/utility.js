export const AUTH_TOKEN = Symbol('com.forio.epicenter.token');

export const ScopeBoundary = {
    PROJECT: 'project',
    GROUP: 'group',
    EPISODE: 'episode',
    WORLD: 'world',
    RUN: 'run',
};

export const PushCategory = {
    CONSENSUS: 'consensus',
    GENERAL: 'general',
    PRESENCE: 'presence',
    RUN: 'run',
    SYSTEM: 'system',
};

export class EpicenterError extends Error {

    constructor(message) {

        super();

        this.message = message;
    }
}

export class Fault extends Error {

    constructor(status, error) {

        super();

        this.status = status;
        this.message = error.message;

        if (error.information) {
            if (error.information.code) {
                this.code = error.information.code;

                if (Object.keys(error.information).length > 1) {
                    this.information = error.information;
                    delete this.information.code;
                }
            } else if (Object.keys(error.information).length > 0) {
                this.information = error.information;
            }
        }

        if (error.cause) {
            this.cause = new Fault(error.cause);
        }
    }
}

export class Result {

    constructor(status, headers, body) {

        this.status = status;
        this.headers = headers;
        this.body = body;
    }
}

export function isNode() {
    try {
        return this === global;
    } catch (e) {
        return false;
    }
}

export function isBrowser() {
    try {
        return this === window;
    } catch (e) {
        return false;
    }
}

export function EpicenterPromise(promise) {

    return new Promise((resolve, reject) => {
        promise
            .then((result) => {
                resolve(result);
            })
            .catch((fault) => {
                reject(fault);
            });
    });
}
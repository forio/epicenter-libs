export const AUTH_TOKEN = Symbol('com.forio.epicenter.token');

export const SCOPE_BOUNDARY = {
    PROJECT: 'project',
    GROUP: 'group',
    EPISODE: 'episode',
    WORLD: 'world',
    RUN: 'run',
};

export const PUSH_CATEGORY = {
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

        const { information, message, cause } = error;
        this.status = status;
        this.message = message;

        if (information) {
            const { code, ...rest } = information;
            this.code = code;
            this.information = rest;
        }
        if (cause) {
            this.cause = new Fault(cause);
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
    return (typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined');
}

export function isBrowser() {
    return (typeof window !== 'undefined');
}

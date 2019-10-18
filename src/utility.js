export const AUTH_TOKEN = Symbol('com.forio.epicenter.token');

export const SCOPE_BOUNDARY = {
    PROJECT: 'PROJECT',
    GROUP: 'GROUP',
    EPISODE: 'EPISODE',
    WORLD: 'WORLD',
    RUN: 'RUN',
};

export const PUSH_CATEGORY = {
    CONSENSUS: 'CONSENSUS',
    GENERAL: 'GENERAL',
    PRESENCE: 'PRESENCE',
    RUN: 'RUN',
    SYSTEM: 'SYSTEM',
};

export const LOCK_TYPE = {
    SYSTEM: 'SYSTEM',
    MONITER: 'MONITER',
    AUTHOR: 'AUTHOR',
    SUPPORT: 'SUPPORT',
    FACILITATOR: 'FACILITATOR',
    REVIEWER: 'REVIEWER',
    USER: 'USER',
    LEADER: 'LEADER',
    PARTICIPANT: 'PARTICIPANT',
    ANONYMOUS: 'ANONYMOUS',
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

export function toQueryString(qOptions, keys) {
    keys = keys || Object.keys(qOptions);
    const qString = keys.flatMap((key) => {
        const value = qOptions[key];
        if (value === undefined) return [];
        if (Array.isArray(value)) return value.map((v) => `${key}=${v}`);
        return `${key}=${value}`;
    }).join('&');

    return qString ? `?${qString}` : '';
}

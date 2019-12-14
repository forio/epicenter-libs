
export const BROWSER_STORAGE_TYPES = {
    COOKIE: 'COOKIE',
    SESSION: 'SESSION',
};

export const SCOPE_BOUNDARY = {
    PROJECT: 'PROJECT',
    GROUP: 'GROUP',
    EPISODE: 'EPISODE',
    WORLD: 'WORLD',
    RUN: 'RUN',
};

export const RITUALS = {

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
// Generic error from Epicenter Libs
export class EpicenterError extends Error {

    constructor(message) {

        super();

        this.message = message;
    }
}
// For API calls to the backend
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

export const isNode = () => (typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined');
export const isBrowser = () => (typeof window !== 'undefined');

export const toQueryString = (queryObject, ordering) => {
    ordering = ordering || Object.keys(queryObject);
    const qString = ordering.flatMap((key) => {
        const value = queryObject[key];
        if (value === undefined) return [];
        if (Array.isArray(value)) return value.map((v) => `${key}=${v}`);
        return `${key}=${value}`;
    }).join('&');

    return qString ? `?${qString}` : '';
};

export const last = (strOrArr) => strOrArr[strOrArr.length - 1];
export const prefix = (pre, str) => str.startsWith(pre) ? str : `${pre}${str}`;

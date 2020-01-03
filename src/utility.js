
export const BROWSER_STORAGE_TYPE = {
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

export const RITUAL = {
    NONE: 'NONE',
    INTER: 'INTER',
    REANIMATE: 'REANIMATE',
    EXORCISE: 'EXORCISE',
};

export const PUSH_CATEGORY = {
    CHAT: 'CHAT',
    CONSENSUS: 'CONSENSUS',
    CONTROL: 'CONTROL',
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


export const toQueryString = (query) => {
    if (typeof query === 'string') return query;
    if (typeof query !== 'object') return '';
    const queryArray = Array.isArray(query) ? query : Object.entries(query);
    return queryArray.flatMap(([key, value]) => {
        if (key === undefined || key === '') return [];
        if (value === undefined || value === '') return [];
        if (Array.isArray(value)) return value.map((v) => `${key}=${v}`);
        return `${key}=${value}`;
    }).join('&');
};

export const last = (strOrArr) => strOrArr[strOrArr.length - 1];
export const prefix = (pre, str) => str.startsWith(pre) ? str : `${pre}${str}`;

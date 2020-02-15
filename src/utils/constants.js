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

/**
 * Used in {@link https://forio.com mmm}
 * @enum
 */
export const RITUAL = {
    NONE: 'NONE',
    /**
     * Means Epicenter will bring your run back into memory
     * @constant
     */
    INTER: 'INTER',
    /**
     * ???
     * @constant
     */
    REANIMATE: 'REANIMATE',
    /**
     *
     * @constant
     */
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
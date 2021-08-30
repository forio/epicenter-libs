
declare enum ROLE {
    SYSTEM = 'SYSTEM',
    MONITOR = 'MONITOR',
    AUTHOR = 'AUTHOR',
    SUPPORT = 'SUPPORT',
    FACILITATOR = 'FACILITATOR',
    REVIEWER = 'REVIEWER',
    USER = 'USER',
    LEADER = 'LEADER',
    PARTICIPANT = 'PARTICIPANT',
    ANONYMOUS = 'ANONYMOUS',
}

declare enum BROWSER_STORAGE_TYPE {
    COOKIE = 'COOKIE',
    SESSION = 'SESSION',
}

declare enum SCOPE_BOUNDARY {
    PROJECT = 'PROJECT',
    GROUP = 'GROUP',
    EPISODE = 'EPISODE',
    WORLD = 'WORLD',
}

declare enum RITUAL {
    NONE = 'NONE',
    REANIMATE = 'REANIMATE',
    EXORCISE = 'EXORCISE',
}

declare enum PUSH_CATEGORY {
    CHAT = 'CHAT',
    CONSENSUS = 'CONSENSUS',
    CONTROL = 'CONTROL',
    PRESENCE = 'PRESENCE',
    LOBBY = 'LOBBY',
    RUN = 'RUN',
    VAULT = 'VAULT',
    WORLD = 'WORLD',
    GROUP = 'GROUP',
    SYSTEM = 'SYSTEM',
}

interface GenericScope {
    scopeBoundary: keyof typeof SCOPE_BOUNDARY,
    scopeKey: string,
}

interface GenericAdapterOptions {
    server?: string,
    accountShortName?: string,
    projectShortName?: string,
}

interface GenericAdapterQueryOptions extends GenericAdapterOptions {
    filter?: string[],
    sort?: string[],
    first?: number,
    max?: number,
}

interface Permit {
    readLock: keyof typeof ROLE,
    writeLock: keyof typeof ROLE,
}

interface RetryFunction {
    (): Promise<unknown>;
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

interface FIXME {

}

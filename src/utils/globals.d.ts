/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

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

interface GenericQueryOptions {
    filter?: string[],
    sort?: string[],
    first?: number,
    max?: number,
}

interface Page<Item> {
    firstResult: number,
    maxResults: number,
    totalResults: number,
    values: Item[],
    prev: () => Promise<Item[]>,
    next: () => Promise<Item[]>,
    all: (first?: number, allValues?: Item[]) => Promise<Item[]>,
}

interface Permit {
    readLock: keyof typeof ROLE,
    writeLock: keyof typeof ROLE,
}


interface RequestOptions {
    method: string,
    headers?: Record<string, string>,
    body?: Record<string, unknown>,
    includeAuthorization?: boolean,
    authorization?: string,
    inert?: boolean,
    paginated?: boolean,
    parsePage?: <Values, ParsedValues>(values: Array<Values>) => Array<Values | ParsedValues>,
}

interface RetryFunction<Output> {
    (): Promise<Output>,
    requestArguments?: { url: URL } & RequestOptions,
}

type UserDetails = Record<string, unknown>;


interface User {
    lastUpdated: string,
    displayName: string,
    created: string,
    detail: UserDetails,
    userId: number,
    userKey: string,
}

interface Admin {
    lastUpdated: string,
    lastLogin: string,
    created: string,
    familyName: string,
    givenName: string,
    verified: boolean,
    handle: string,
    active: boolean,
    adminKey: string,
    email: string,
    objectType: 'external' | 'native',
}

interface ChannelScope extends GenericScope {
    pushCategory: string,
}

declare class Channel {
    constructor(scope: ChannelScope);

    path: string;
}

interface Session {
    token: string,
    groupName?: string,
    userKey: string,
    groupKey: string,
    accountShortName: string,
    projectShortName: string,
    objectType: string,
    loginMethod: {
        objectType: string,
    },
}

interface SubscriptionHandle {
    channel: string,
}

type FIXME = any;

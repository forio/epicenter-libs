import EpicenterError from './error';
import cookies from './cookies';
import { NodeStore, SessionStore, CookieStore } from './store';
import { BROWSER_STORAGE_TYPE, ROLE, GROUP_ROLE } from './constants';
import { isNode } from './helpers';
import config from './config';
const { COOKIE, SESSION } = BROWSER_STORAGE_TYPE;

/**
 * User session information returned from authentication endpoints.
 *
 * @remarks
 * Field dependencies:
 * - If `multipleGroups` is true, the user has access to multiple groups and
 *   `projectShortName`, `projectKey`, `groupKey`, `groupName`, and `groupRole` will be undefined
 * - If `multipleGroups` is false or undefined, the user is scoped to a single group and
 *   `projectShortName`, `projectKey`, `groupKey`, `groupName`, and `groupRole` should be present
 * - `groupKey` and `groupName` are present together (both or neither)
 * - `projectShortName` and `projectKey` are present together (both or neither)
 */
export interface UserSession {
    token: string;
    /** User identifier (actually the pseudonym key) */
    userKey: string;
    /**
     * Group identifier for the user's current group.
     * Present when user is scoped to a single group (multipleGroups is false/undefined).
     */
    groupKey?: string;
    /**
     * Name of the user's current group.
     * Present when user is scoped to a single group (multipleGroups is false/undefined).
     */
    groupName?: string;
    /**
     * User's role within their group (FACILITATOR, REVIEWER, LEADER, or PARTICIPANT).
     * Present when user is scoped to a single group (multipleGroups is false/undefined).
     */
    groupRole?: keyof typeof GROUP_ROLE;
    /**
     * Whether the user has access to multiple groups.
     * When true, group/project-specific fields will be undefined.
     */
    multipleGroups?: boolean;
    /**
     * Short name of the project.
     * Present when user is scoped to a single group (multipleGroups is false/undefined).
     */
    projectShortName?: string;
    /**
     * Unique identifier for the project.
     * Present when user is scoped to a single group (multipleGroups is false/undefined).
     */
    projectKey?: string;
    accountShortName: string;
    displayName: string;
    objectType: 'user';
    loginMethod: {
        objectType: string;
    };
}

/**
 * Admin session information returned from authentication endpoints.
 *
 * Admin sessions can have either:
 * - A global role (SYSTEM or MONITOR) for system-wide access
 * - Team-specific roles (teamAccountRole and/or teamProjectRole) for account/project access
 *
 * @remarks
 * Field dependencies:
 * - If `globalRole` is present, the admin has system-wide access
 * - If `teamAccountRole` is present, `teamAccountShortName` should also be present
 * - If `teamProjectRole` is present, `projectShortName` and `projectKey` should also be present
 * - Personal accounts: admins always have OWNER role for their personal account
 */
export interface AdminSession {
    adminHandle: string;
    adminKey: string;
    expires: boolean;
    multipleAccounts: boolean;
    objectType: 'admin';
    /**
     * Global system role (SYSTEM or MONITOR).
     * Present when admin has system-wide access.
     */
    globalRole?: ROLE.SYSTEM | ROLE.MONITOR;
    /**
     * Role within the team account (OWNER, AUTHOR, SUPPORT, or ASSOCIATE).
     * When present, teamAccountShortName should also be present.
     */
    teamAccountRole?: ROLE.OWNER | ROLE.AUTHOR | ROLE.SUPPORT | ROLE.ASSOCIATE;
    /**
     * Short name of the team account.
     * Present when teamAccountRole is set.
     */
    teamAccountShortName?: string;
    /**
     * Role within the specific project (AUTHOR or SUPPORT).
     * When present, projectShortName and projectKey should also be present.
     */
    teamProjectRole?: ROLE.AUTHOR | ROLE.SUPPORT;
    /**
     * Short name of the project.
     * Present when admin is scoped to a specific project.
     */
    projectShortName?: string;
    /**
     * Unique identifier for the project.
     * Present when admin is scoped to a specific project.
     */
    projectKey?: string;
    /**
     * Unique identifier for the group.
     * Present when admin is scoped to a specific group.
     */
    groupKey?: string;
    timeoutMinutes: number;
    token: string;
}

export type Session = UserSession | AdminSession;


const SESSION_KEY = 'com.forio.epicenter.session';
const EPI_SSO_KEY = 'epicenter.v3.sso';
class Identification {
    type;

    constructor(storeType: keyof typeof BROWSER_STORAGE_TYPE) {
        if (storeType !== COOKIE && storeType !== SESSION) {
            throw new EpicenterError(`Invalid Storage Type: "${String(storeType)}", please use "${String(COOKIE)}" or "${String(SESSION)}".`);
        }
        this.type = storeType;
        this.consumeSSO();
    }

    get session() {
        const Store = this.getStore();
        return new Store().getItem(SESSION_KEY) as Session;
    }

    set session(session: Session | undefined) {
        const Store = this.getStore();
        const options = this.getStoreOptions(session);

        if (session) {
            new Store(options).setItem(SESSION_KEY, session as Session);
        } else if (this.session) {
            new Store(options).removeItem(SESSION_KEY);
        }
    }

    setSessionWithOptions(session: Session | undefined, forcePathInclusion?: boolean) {
        const Store = this.getStore();
        const options = this.getStoreOptions(session, forcePathInclusion);

        if (session) {
            new Store(options).setItem(SESSION_KEY, session as Session);
        } else if (this.session) {
            new Store(options).removeItem(SESSION_KEY);
        }
    }

    getStore() {
        if (isNode()) return NodeStore;
        switch (this.type) {
            case SESSION: return SessionStore;
            case COOKIE:
            default: return CookieStore;
        }
    }

    /* Generates the appropriate path for storing your session (applicable only to cookies) */
    getStoreOptions(session?: Session, forcePathInclusion?: boolean) {
        const mySession = session || this.session;
        if (!mySession || isNode()) return '';

        const { objectType } = mySession;
        const isLocal = config.isLocal();
        const base = { samesite: isLocal ? 'lax' : 'none', secure: !isLocal };
        const isCustomDomain = !isLocal && window.location.pathname.split('/')[1] !== 'app';
        const isEpicenterDomain = !isLocal && !isCustomDomain;

        /* forcePathInclusion can explicitly override behavior:
         * - true: force scoped path (even on custom domains)
         * - false: force root path (even for users/admins on Epicenter domain)
         * - undefined: use defaults (scoped for users and admins on Epicenter domain, root for custom domains) */
        if (forcePathInclusion === false) {
            return { ...base, path: '/' };
        }

        if (
            forcePathInclusion === true ||
            (isEpicenterDomain && (objectType === 'user' || objectType === 'admin'))
        ) {
            const { accountShortName, projectShortName } = config;
            const account = accountShortName ? `/${accountShortName}` : '';
            const project = account && projectShortName ? `/${projectShortName}` : '';
            return { ...base, path: `/app${account}${project}` };
        }

        /* Custom domains (when forcePathInclusion is not true) get the root path */
        return { ...base, path: '/' };
    }

    consumeSSO() {
        if (isNode()) return;

        // Occasionally, the backend might already wrap the cookie in quotes, have to handle
        // both cases, where we get string serialized content w/ quotes and without
        let cookieContent = cookies.getItem(EPI_SSO_KEY);
        if (
            typeof cookieContent === 'string' &&
            cookieContent.charAt(0) !== '"' &&
            cookieContent.charAt(cookieContent.length - 1) !== '"'
        ) {
            cookieContent = `"${cookieContent}"`;
        }

        /* Double parse here b/c the backend serializes it as a string; the first parse
         * converts it into a json string, the second parse converts the json string into
         * json. Yes, it's weird, no, we can't change it (unless we want to rewrite
         * Interface Builder code to accommodate) */
        const session = JSON.parse(JSON.parse(cookieContent ?? '"null"'));

        if (session) {
            const { accountShortName, projectShortName } = session;
            const account = accountShortName ? `/${accountShortName}` : '';
            const project = account && projectShortName ? `/${projectShortName}` : '';
            this.session = session;
            cookies.removeItem(EPI_SSO_KEY, { path: `/app${account}${project}` });
            cookies.removeItem(EPI_SSO_KEY, {
                domain: `.${window.location.hostname}`,
                path: `/app${account}${project}`,
            });
        }
    }
}

const identification = new Identification(COOKIE);
export default identification;


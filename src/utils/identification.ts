import EpicenterError from './error';
import cookies from './cookies';
import { NodeStore, SessionStore, CookieStore } from './store';
import { BROWSER_STORAGE_TYPE, ROLE, GROUP_ROLE } from './constants';
import { isNode } from './helpers';
import config from './config';
const { COOKIE, SESSION } = BROWSER_STORAGE_TYPE;

export interface UserSession {
    token: string,
    userKey: string,
    groupKey?: string,
    groupName?: string,
    groupRole?: keyof typeof GROUP_ROLE,
    multipleGroups?: boolean,
    accountShortName: string,
    projectShortName?: string, // undefined when multipleGroups: true
    projectKey?: string,
    displayName: string,
    objectType: 'user',
    loginMethod: {
        objectType: string,
    },
}

export interface AdminSession {
    adminHandle: string,
    adminKey: string,
    expires: boolean,
    multipleAccounts: boolean,
    objectType: 'admin'
    teamAccountRole: ROLE.AUTHOR | ROLE.SUPPORT,
    teamAccountShortName: string,
    projectShortName?: string,
    projectKey?: string,
    groupKey?: string,
    timeoutMinutes: number,
    token: string,
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
    setSessionWithOptions(session: Session | undefined, forcePathInclusion: boolean) {
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
        if ((objectType === 'user' || forcePathInclusion) && isEpicenterDomain) {
            const { accountShortName, projectShortName } = config;
            const account = accountShortName ? `/${accountShortName}` : '';
            const project = account && projectShortName ? `/${projectShortName}` : '';
            return { ...base, path: `/app${account}${project}` };
        }
        /* Admins and any custom domains (ones that don't use 'app/account/project') get the root path */
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
            cookies.removeItem(EPI_SSO_KEY, { domain: `.${window.location.hostname}`, path: `/app${account}${project}` });
        }
    }
}

const identification = new Identification(COOKIE);
export default identification;


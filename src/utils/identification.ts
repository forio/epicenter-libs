import EpicenterError from './error';
import cookies from './cookies';
import { NodeStore, SessionStore, CookieStore } from './store';
import { BROWSER_STORAGE_TYPE } from './constants';
import { isNode } from './helpers';
import config from './config';
const { COOKIE, SESSION } = BROWSER_STORAGE_TYPE;

export interface Session {
    token: string,
    userKey: string,
    groupKey: string,
    groupName?: string,
    multipleGroups?: boolean,
    accountShortName: string,
    projectShortName: string,
    objectType: string,
    loginMethod: {
        objectType: string,
    },
}

const SESSION_KEY = 'com.forio.epicenter.session';
const EPI_SSO_KEY = 'epicenter.v3.sso';
class Identification {
    type

    constructor(storeType: keyof typeof BROWSER_STORAGE_TYPE) {
        if (storeType !== COOKIE && storeType !== SESSION) {
            throw new EpicenterError(`Invalid Storage Type: "${storeType}", please use "${COOKIE}" or "${SESSION}".`);
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
    getStore() {
        if (isNode()) return NodeStore;
        switch (this.type) {
            case SESSION: return SessionStore;
            case COOKIE:
            default: return CookieStore;
        }
    }
    /* Generates the appropriate path for storing your session (applicable only to cookies) */
    getStoreOptions(session?: Session) {
        const mySession = session || this.session;
        if (!mySession || isNode()) return '';

        const { accountShortName, projectShortName, objectType } = mySession;
        const isLocal = config.isLocal();
        const base = { samesite: isLocal ? 'lax' : 'none', secure: !isLocal };
        const isCustomDomain = !isLocal && window.location.pathname.split('/')[1] !== 'app';
        const isEpicenterDomain = !isLocal && !isCustomDomain;
        if (objectType === 'user' && accountShortName && projectShortName && isEpicenterDomain) {
            return { ...base, path: `/app/${accountShortName}/${projectShortName}` };
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
            this.session = session;
            cookies.removeItem(EPI_SSO_KEY, { domain: `.${window.location.hostname}`, path: `/app/${accountShortName}/${projectShortName}` });
        }
    }
}

const identification = new Identification(COOKIE);
export default identification;


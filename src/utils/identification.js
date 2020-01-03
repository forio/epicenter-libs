import config from '~/config';
import { BROWSER_STORAGE_TYPE } from '~/constants';
const { COOKIE, SESSION } = BROWSER_STORAGE_TYPE;
import { EpicenterError, NodeStore, SessionStore, CookieStore, cookies, isNode } from 'utils';


const SESSION_KEY = Symbol('com.forio.epicenter.session');
const EPI_SSO_KEY = 'epicenter.v3.sso';
class Identification {
    type

    constructor(storeType) {
        if (storeType !== COOKIE && storeType !== SESSION) {
            throw new EpicenterError(`Invalid Storage Type: "${storeType}", please use "${COOKIE}" or "${SESSION}".`);
        }
        this.type = storeType;
        this.consumeSSO();
    }
    get session() {
        const Store = this.getStore();
        return new Store().getItem(SESSION_KEY.description);
    }
    set session(session) {
        const Store = this.getStore();
        const path = this.getSessionPath(session);

        if (session) {
            new Store({ path }).setItem(SESSION_KEY.description, session);
        } else if (this.session) {
            new Store({ path }).removeItem(SESSION_KEY.description);
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
    getSessionPath(session) {
        const mySession = session || this.session;
        if (!mySession || isNode()) return '';

        const { accountShortName, projectShortName, objectType } = mySession;
        const isLocal = config.isLocal();
        const isCustomDomain = !isLocal && window.location.pathname.split('/')[1] !== 'app';
        const isEpicenterDomain = !isLocal && !isCustomDomain;
        if (objectType === 'user' && accountShortName && projectShortName && isEpicenterDomain) {
            return `/app/${accountShortName}/${projectShortName}`;
        }
        /* Admins and any custom domains (ones that don't use 'app/account/project') get the root path */
        return '/';
    }
    consumeSSO() {
        if (isNode()) return;
        /* Double parse here b/c the backend serializes it as a string; the first parse
         * converts it into a json string, the second parse converts the json string into
         * json. Yes, it's weird, no, we can't change it (unless we want to rewrite
         * Interface Builder code to accommodate) */
        const session = JSON.parse(JSON.parse(`"${cookies.getItem(EPI_SSO_KEY)}"`));
        if (session) {
            const { accountShortName, projectShortName } = session;
            this.session = session;
            cookies.removeItem(EPI_SSO_KEY, { domain: `.${window.location.hostname}`, path: `/app/${accountShortName}/${projectShortName}` });
        }
    }
}

const identification = new Identification(COOKIE);
export default identification;


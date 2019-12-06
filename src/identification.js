
import { NodeStore, SessionStore, CookieStore } from './store.js';
import { isNode, EpicenterError, BROWSER_STORAGE_TYPES } from './utility.js';
import cookies from './cookies';
const { COOKIE, SESSION } = BROWSER_STORAGE_TYPES;

const getIdentificationStore = (browserStorageType) => {
    if (isNode()) return new NodeStore();
    switch (browserStorageType) {
        case SESSION: return new SessionStore();
        case COOKIE:
        default: return new CookieStore();
    }
};

const SESSION_KEY = Symbol('com.forio.epicenter.session');
const EPI_SSO_KEY = 'epicenter.v3.sso';
class Identification {
    type
    #store

    constructor(type) {
        this.useStore(type);
    }
    useStore(storeType) {
        if (storeType !== COOKIE && storeType !== SESSION) {
            throw new EpicenterError(`Invalid Storage Type: "${storeType}", please use "${COOKIE}" or "${SESSION}".`);
        }
        if (this.type !== storeType) {
            this.type = storeType;
            this.#store = getIdentificationStore(storeType);
        }
    }
    getIdentity() {
        const session = this.#store.getItem(SESSION_KEY.description);
        return session;
    }
    setIdentity(identity) {
        this.#store.setItem(SESSION_KEY.description, identity);
    }
    consumeSSO() {
        if (isNode()) return;
        const session = JSON.parse(JSON.parse(`"${cookies.getItem(EPI_SSO_KEY)}"`));
        if (session) {
            this.#store.setItem(SESSION_KEY.description, session);
            new CookieStore().removeItem(EPI_SSO_KEY);
        }
    }
    remove() {
        this.#store.removeItem(SESSION_KEY.description);
    }
}

const identification = new Identification(COOKIE);
export default identification;


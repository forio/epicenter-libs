import { isNode, BROWSER_STORAGE_TYPES } from './utility.js';
import config from './config.js';
import cookies from './cookies.js';
const { COOKIE, SESSION } = BROWSER_STORAGE_TYPES;

class Store {
    #store;
    constructor(store) {
        this.#store = store;
    }
    clear() {
        this.#store.clear();
    }
    get store() {
        return this.#store;
    }
    set store(store) {
        this.#store = store;
    }
}

const nodeMap = new Map();
class NodeStore extends Store {
    constructor() {
        super(nodeMap);
    }
    getItem(key) {
        return super.store.get(key);
    }
    setItem(key, value) {
        return super.store.set(key, value);
    }
    removeItem(key) {
        return super.store.delete(key);
    }
}

class SessionStore extends Store {
    constructor() {
        super(window.sessionStorage);
    }
    getItem(key) {
        return JSON.parse(super.store.getItem(key.toString()));
    }
    setItem(key, value) {
        return super.store.setItem(key.toString(), JSON.stringify(value));
    }
    removeItem(key) {
        return super.store.removeItem(key.toString());
    }
}

class CookieStore {
    constructor(options) {
        const defaults = { domain: `.${window.location.hostname}`, path: '/' };
        this.options = { ...defaults, ...options };
    }
    getItem(key) {
        return JSON.parse(cookies.getItem(key));
    }
    setItem(key, value) {
        return cookies.setItem(key, JSON.stringify(value), this.options);
    }
    removeItem(key) {
        return cookies.removeItem(key, this.options);
    }
    clear() {
        return cookies.clear();
    }
}

/* Store Factory */
export const getIdentificationStore = () => {
    if (isNode()) return new NodeStore();
    switch (config.browserStorageType) {
        case SESSION: return new SessionStore();
        case COOKIE:
        default: return new CookieStore();
    }
};


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
export class NodeStore extends Store {
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

export class SessionStore extends Store {
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

export class CookieStore {
    constructor(options) {
        const defaults = { domain: `.${window.location.hostname}`, path: '/' };
        this.options = { ...defaults, ...options };
    }
    getItem(key) {
        return JSON.parse(cookies.getItem(key.toString()));
    }
    setItem(key, value) {
        return cookies.setItem(key.toString(), JSON.stringify(value), this.options);
    }
    removeItem(key) {
        return cookies.removeItem(key.toString(), this.options);
    }
    clear() {
        return cookies.clear();
    }
}

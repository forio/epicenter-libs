import cookies from 'utils/cookies';

class Store {
    _store;
    constructor(store: any) {
        this._store = store;
    }
    clear() {
        this._store.clear();
    }
    get store() {
        return this._store;
    }
    set store(store) {
        this._store = store;
    }
}

const nodeMap = new Map();
export class NodeStore extends Store {
    constructor() {
        super(nodeMap);
    }
    getItem(key: string) {
        return super.store.get(key);
    }
    setItem(key: string, value: any) {
        return super.store.set(key, value);
    }
    removeItem(key: string) {
        return super.store.delete(key);
    }
}

export class SessionStore extends Store {
    constructor() {
        super(window.sessionStorage);
    }
    getItem(key: string) {
        return JSON.parse(super.store.getItem(key));
    }
    setItem(key: string, value: any) {
        return super.store.setItem(key, JSON.stringify(value));
    }
    removeItem(key: string) {
        return super.store.removeItem(key);
    }
}

export class CookieStore {
    options = {};
    constructor(options = {}) {
        const hostname = window.location.hostname;
        const defaults = hostname !== 'localhost' ?
            { path: '/', domain: `.${hostname}` } :
            { path: '/' };
        this.options = { ...defaults, ...options };
    }
    getItem(key: string) {
        const item = cookies.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    setItem(key: string, value: any) {
        return cookies.setItem(key, JSON.stringify(value), this.options);
    }
    removeItem(key: string) {
        return cookies.removeItem(key, this.options);
    }
    clear() {
        return cookies.clear();
    }
}

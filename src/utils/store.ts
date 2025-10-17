import cookies from './cookies';

/* eslint-disable @typescript-eslint/no-explicit-any */
type NodeMap = Record<any, any>;
type JavaScriptObject = Record<string, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

type EpicenterStore = NodeMap | Storage;


class Store {
    _store: EpicenterStore;
    constructor(store: EpicenterStore) {
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

    getItem(key: string): NodeMap {
        return super.store.get(key);
    }

    setItem(key: string, value: JavaScriptObject): NodeMap {
        return super.store.set(key, value);
    }

    removeItem(key: string): boolean {
        return super.store.delete(key);
    }
}

export class SessionStore extends Store {
    constructor() {
        super(window.sessionStorage);
    }

    getItem(key: string): JavaScriptObject | null {
        const item = super.store.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    setItem(key: string, value: JavaScriptObject): void {
        return super.store.setItem(key, JSON.stringify(value));
    }

    removeItem(key: string): void {
        return super.store.removeItem(key);
    }
}

export class CookieStore {
    options = {};
    constructor(options = {}) {
        const defaults = { path: '/' };
        this.options = { ...defaults, ...options };
    }

    getItem(key: string): JavaScriptObject | null {
        const item = cookies.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    setItem(key: string, value: JavaScriptObject): boolean {
        return cookies.setItem(key, JSON.stringify(value), this.options);
    }

    removeItem(key: string): boolean {
        return cookies.removeItem(key, this.options);
    }

    clear(): string[] {
        return cookies.clear();
    }
}

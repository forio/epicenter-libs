import { isNode } from './utility.js';

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

class NodeStore extends Store {
    constructor() {
        super(new Map());
    }
    getItem(key) {
        return super.store.get(key);
    }
    setItem(key, value) {
        super.store.set(key, value);
    }
    removeItem(key) {
        super.store.delete(key);
    }
}

class BrowserStore extends Store {
    constructor() {
        super(window.sessionStorage);
    }
    getItem(key) {
        return super.store.getItem(key.toString());
    }
    setItem(key, value) {
        super.store.setItem(key.toString(), value);
    }
    removeItem(key) {
        super.store.removeItem(key.toString());
    }
}

const store = isNode() ? new NodeStore() : new BrowserStore();
export default store;


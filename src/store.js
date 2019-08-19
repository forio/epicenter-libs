import { isNode } from './utility.js';

class NodeStore {
    #store = new Map();
    getItem(key) {
        return this.#store.get(key);
    }
    setItem(key, value) {
        this.#store.set(key, value);
    }
    removeItem(key) {
        this.#store.delete(key);
    }
    clear() {
        this.#store.clear();
    }
}

class BrowserStore {
    #store = window.sessionStorage;
    getItem(key) {
        return this.#store.getItem(key.toString());
    }
    setItem(key, value) {
        this.#store.setItem(key.toString(), value);
    }
    removeItem(key) {
        this.#store.removeItem(key.toString());
    }
    clear() {
        this.#store.clear();
    }
}

export const StorageManager = isNode() ? new NodeStore() : new BrowserStore();


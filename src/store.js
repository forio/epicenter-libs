class SessionStore {

    #store;

    constructor() {

        if ((typeof window !== 'undefined') && (typeof window.sessionStorage !== 'undefined') && window.sessionStorage) {
            this.#store = window.sessionStorage;
        } else {
            this.#store = new Map();
        }
    }

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

export const StorageManager = new SessionStore();
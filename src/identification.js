
const SESSION_KEY = Symbol('com.forio.epicenter.session');
class Identification {
    #store
    constructor(store) {
        this.#store = store;
    }
    useStore(store) {
        this.#store = store;
    }
    get() {
        const session = this.#store.getItem(SESSION_KEY.description);
        return session;
    }
    set(identity) {
        this.#store.setItem(SESSION_KEY.description, identity);
    }
    remove() {
        this.#store.removeItem(SESSION_KEY.description);
    }
}

export default Identification;


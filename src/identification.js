
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
    set(session) {
        this.#store.setItem(SESSION_KEY.description, session);
    }
    remove() {
        this.#store.removeItem(SESSION_KEY.description);
    }
}

export default Identification;


import { getIdentificationStore } from './store.js';


const SESSION_KEY = Symbol('com.forio.epicenter.session');
class Identification {
    #store = getIdentificationStore();
    reinitStore() {
        this.#store = getIdentificationStore();
    }
    get() {
        const session = this.#store.getIem(SESSION_KEY);
        return session;
    }
    set(session) {
        this.#store.setItem(SESSION_KEY, session);
    }
    remove() {
        this.#store.removeItem(SESSION_KEY);
    }
}

const identification = new Identification();
export default identification;


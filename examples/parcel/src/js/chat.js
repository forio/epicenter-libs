import './config';
import {
    authAdapter,
} from 'epicenter';
const session = authAdapter.getLocalSession();

/* Define DOM elements */
const unauthedEl = document.getElementById('unauthed');


const initialize = () => {

};

if (!session) {
    unauthedEl.classList.remove('hidden');
} else {
    initialize();
}
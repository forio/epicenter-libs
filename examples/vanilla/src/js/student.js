require('./common');
import {
    authAdapter, presenceAdapter, timeAdapter,
    Channel, SCOPE_BOUNDARY, PUSH_CATEGORY,
} from 'epicenter';

const session = authAdapter.getLocalSession();

/* Define DOM elements */
const unauthedEl = document.getElementById('unauthed');
const formEl = document.getElementById('form');
const chatInputEl = document.getElementById('text-box');
const submitEl = document.getElementById('submit');
const timeEl = document.getElementById('time');

const initialize = () => {
    presenceAdapter.connect();
    let waiting = false;
    formEl.onsubmit = (e) => {
        e.preventDefault();
        if (waiting) return;
        const value = chatInputEl.value;
        new Channel({
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: session.groupKey,
            pushCategory: PUSH_CATEGORY.CHAT,
        }).publish({
            user: session.displayName,
            text: value,
        });
        waiting = true;
        chatInputEl.value = '';
        submitEl.disabled = true;
        submitEl.innerText = 'Sent';
        setTimeout(() => {
            submitEl.disabled = false;
            submitEl.innerText = 'Send';
            waiting = false;
        }, 10);
    };
    timeEl.onclick = (e) => {
        e.preventDefault();
        timeAdapter.get().then((time) => console.log(time));
    };
};

if (!session) {
    unauthedEl.classList.remove('hidden');
} else {
    initialize();
}
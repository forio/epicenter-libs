import { config, authAdapter, presenceAdapter, Channel, SCOPE_BOUNDARY, PUSH_CATEGORY } from 'epicenter';
import '../css/common.css';


/* Define DOM elements */
const displayNameEl = document.getElementById('display-name');
const presenceEl = document.getElementById('presence');
const logoutEl = document.getElementById('logout');
const usersEl = document.getElementById('users');
const mainEl = document.getElementById('main');
const formEl = document.getElementById('form');
const inputEl = document.getElementById('text-box');
const submitEl = document.getElementById('submit');
const chatBoxEl = document.getElementById('chat-box');

const session = authAdapter.getLocalSession();

/* Configuration */
if (config.isLocal()) {
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'epi-v3';
    config.host = 'test.forio.com';
}

const initFacilitator = () => {
    mainEl.classList.add('is-facilitator');
    new Channel({
        scopeBoundary: SCOPE_BOUNDARY.GROUP,
        scopeKey: session.groupKey,
        pushCategory: PUSH_CATEGORY.CHAT,
    }).subscribe((data) => {
        const messageEl = document.createElement('div');
        const { user, text } = data;
        messageEl.innerText = `${user}: ${text}`;
        chatBoxEl.append(messageEl);
    });
    new Channel({
        scopeBoundary: SCOPE_BOUNDARY.GROUP,
        scopeKey: session.groupKey,
        pushCategory: PUSH_CATEGORY.PRESENCE,
    }).subscribe((data) => {
        const { content, type } = data;
        const messageEl = document.createElement('div');
        let text = 'done something entirely novel and unknown';
        if (type === 'login') text = 'joined the room';
        if (type === 'logout') text = 'left the room';
        const user = content.user.displayName;
        messageEl.innerText = `-- ${user} has ${text} --`;
        messageEl.classList.add('system');
        chatBoxEl.append(messageEl);
    });
};

const initStudent = () => {
    mainEl.classList.add('is-student');
    presenceAdapter.connect();
    let waiting = false;
    formEl.onsubmit = (e) => {
        e.preventDefault();
        if (waiting) return;
        const value = inputEl.value;
        new Channel({
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: session.groupKey,
            pushCategory: PUSH_CATEGORY.CHAT,
        }).publish({
            user: session.displayName,
            text: value,
        });
        waiting = true;
        inputEl.value = '';
        submitEl.disabled = true;
        submitEl.innerText = 'Sent';
        setTimeout(() => {
            submitEl.disabled = false;
            submitEl.innerText = 'Send';
            waiting = false;
        }, 10);
    };
};

const load = () => {
    const isFac = session.groupRole === 'FACILITATOR';

    if (isFac) {
        initFacilitator();
    } else {
        initStudent();
    }
    displayNameEl.innerText = session.displayName;

    /* Handle onclicks */
    logoutEl.onclick = (e) => {
        authAdapter.logout().then(() => {
            window.location.href = '/login.html';
        });
    };
    presenceEl.onclick = (e) => {
        if (presenceEl.innerText !== 'Presence') return;

        presenceEl.innerText = 'Fetching';
        presenceAdapter.forGroup(session.groupKey).then((res) => {
            const membersOnline = res.body;
            usersEl.innerHTML = '';
            membersOnline.forEach((member) => {
                const item = document.createElement('li');
                item.innerText = member.user.displayName;
                usersEl.append(item);
            });
            presenceEl.innerText = 'Fetched';
            setTimeout(() => presenceEl.innerText = 'Presence', 2000);
        });
    };
};

/* Simple rerouting logic */
if (!session) {
    window.location.href = '/login.html';
} else {
    load();
}

import {
    config,
    authAdapter, episodeAdapter, presenceAdapter, runAdapter,
    Channel, SCOPE_BOUNDARY, PUSH_CATEGORY,
} from 'epicenter';
import '../css/common.css';


/* Define DOM elements */
const displayNameEl = document.getElementById('display-name');
const presenceEl = document.getElementById('presence');
const logoutEl = document.getElementById('logout');
const usersEl = document.getElementById('users');
const mainEl = document.getElementById('main');
const formEl = document.getElementById('form');
const chatInputEl = document.getElementById('text-box');
const submitEl = document.getElementById('submit');
const chatBoxEl = document.getElementById('chat-box');
const episodeNameEl = document.getElementById('episode-name');
const episodeListEl = document.getElementById('episode-list');
const episodeSaveEl = document.getElementById('episode-save');
const episodeLoadEl = document.getElementById('episode-load');
const runQueryEl = document.getElementById('run-query');

const session = authAdapter.getLocalSession();

/* Configuration */
if (config.isLocal()) {
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'epi-v3';
}

const initFacilitator = () => {
    mainEl.classList.add('is-facilitator');
    /* Subscribe to Chat */
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
    /* Subscribe to Presence */
    new Channel({
        scopeBoundary: SCOPE_BOUNDARY.GROUP,
        scopeKey: session.groupKey,
        pushCategory: PUSH_CATEGORY.PRESENCE,
    }).subscribe((data) => {
        const { content, type } = data;
        const messageEl = document.createElement('div');
        let text = `done something entirely novel and unknown (${type})`;
        if (type === 'login') text = 'joined the room';
        if (type === 'logout') text = 'left the room';
        const user = content.user.displayName;
        messageEl.innerText = `-- ${user} has ${text} --`;
        messageEl.classList.add('system');
        chatBoxEl.append(messageEl);
    });
    /* Facilitator Episode Management */
    episodeSaveEl.onclick = (e) => {
        const name = episodeNameEl.value;
        episodeAdapter.create(name, session.groupName);
    };
    episodeLoadEl.onclick = (e) => {
        episodeAdapter.get().then((episodes) => {
            episodeListEl.innerHTML = '';
            episodes.forEach((episode) => {
                const item = document.createElement('li');
                item.innerText = `${episode.name}${episode.draft ? ' (Draft)' : ''}`;
                episodeListEl.append(item);
            });
        });
    };
    runQueryEl.onclick = (e) => {
        runAdapter.query('model.xlsx', {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: session.groupKey,
        }, {
            filter: { attributes: ['hidden!=true'] },
            sort: ['-run.created'],
            projections: { variables: ['Step', 'unit_sales', 'prices', 'profits', 'include_price_protection'] },
        }).then((page) => {
            console.log('%c some page', 'font-size: 20px; color: #FB15B9FF;', page);
        });
    };
};

const initStudent = () => {
    mainEl.classList.add('is-student');
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
};

const load = () => {
    const isFac = session.groupRole === 'FACILITATOR';

    if (isFac) {
        initFacilitator();
    } else {
        initStudent();
    }
    displayNameEl.innerText = session.displayName;

    /* Handle generic onclicks */
    logoutEl.onclick = (e) => {
        authAdapter.logout().then(() => {
            window.location.href = '/login.html';
        });
    };
    presenceEl.onclick = (e) => {
        if (presenceEl.innerText !== 'Presence') return;

        presenceEl.innerText = 'Fetching';
        presenceAdapter.forGroup(session.groupKey).then((membersOnline) => {
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

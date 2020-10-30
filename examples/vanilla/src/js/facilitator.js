require('./common');
import {
    authAdapter, presenceAdapter, episodeAdapter, runAdapter,
    Channel, SCOPE_BOUNDARY, PUSH_CATEGORY,
} from 'epicenter';

const session = authAdapter.getLocalSession();

/* Define DOM elements */
const unauthedEl = document.getElementById('unauthed');
const presenceEl = document.getElementById('presence');
const usersEl = document.getElementById('users');
const chatBoxEl = document.getElementById('chat-box');
const episodeNameEl = document.getElementById('episode-name');
const episodeListEl = document.getElementById('episode-list');
const episodeSaveEl = document.getElementById('episode-save');
const episodeLoadEl = document.getElementById('episode-load');
const runQueryEl = document.getElementById('run-query');

const initialize = () => {
    /* Subscriptions */
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
        let text = `done something entirely novel and unknown (${type})`;
        if (type === 'login') text = 'joined the room';
        if (type === 'logout') text = 'left the room';
        const user = content.user.displayName;
        messageEl.innerText = `-- ${user} has ${text} --`;
        messageEl.classList.add('system');
        chatBoxEl.append(messageEl);
    });

    /* Episode Management */
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

    /* Run Queries */
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

    /* Presence Checking */
    presenceEl.onclick = (e) => {
        if (presenceEl.innerText !== 'Presence') return;
        const THROTTLE_DELAY = 2000;
        presenceEl.innerText = 'Fetching';
        presenceAdapter.forGroup(session.groupKey).then((membersOnline) => {
            usersEl.innerHTML = '';
            if (membersOnline.length === 0) usersEl.innerHTML = '<li>Oh no! Looks like no one else is online</li>';
            membersOnline.forEach((member) => {
                const item = document.createElement('li');
                item.innerText = member.user.displayName;
                usersEl.append(item);
            });
            presenceEl.innerText = 'Fetched';
            setTimeout(() => presenceEl.innerText = 'Presence', THROTTLE_DELAY);
        });
    };
};

if (!session) {
    unauthedEl.classList.remove('hidden');
} else {
    initialize();
}
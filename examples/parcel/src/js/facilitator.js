import './config';
import {
    authAdapter, presenceAdapter, episodeAdapter, runAdapter, videoAdapter,
    Channel, SCOPE_BOUNDARY, PUSH_CATEGORY, emailAdapter, userAdapter,
} from 'epicenter-libs';
const session = authAdapter.getLocalSession();

/* Define DOM elements */
const unauthedEl = document.getElementById('unauthed');
const isntFacEl = document.getElementById('isnt-fac');
const presenceEl = document.getElementById('presence');
const usersEl = document.getElementById('users');
const chatBoxEl = document.getElementById('chat-box');
const episodeNameEl = document.getElementById('episode-name');
const episodeListEl = document.getElementById('episode-list');
const episodeSaveEl = document.getElementById('episode-save');
const episodeLoadEl = document.getElementById('episode-load');
const runQueryEl = document.getElementById('run-query');
const handleEl = document.getElementById('handle');
const familyNameEl = document.getElementById('family-name');
const displayNameEl = document.getElementById('display-name');
const givenNameEl = document.getElementById('given-name');
const passwordEl = document.getElementById('password');
const createUserEl = document.getElementById('create-user');

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

    document.getElementById('sendEmail').addEventListener('click', () => {
        const pngBase64 = {
            encoding: 'BASE_64',
            name: 'testPic',
            contentType: 'image/png',
            data: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAIxJREFUWEdjZBhgwDjA9jMQ5YAvzmb/efaewquWGDXYPDvqgNEQGA2B0RAYGiFAy+KaqBAYdcDICgFQtQryMaHql1qhgjURklu3IzuKWDNwOoCSUCAlFHFmQ2J9gB4VpFgO0kvVZhaplhPlAJgPCSVKciwn6ACY5TDD8aV8Qg7EpXe0KB4NgdEQGA0BAF7VgCFTeobfAAAAAElFTkSuQmCC',
        };
        const pngCopy = {...pngBase64, name: 'test 2'};
        const optionals = {
            familyNameFirst: true,
            html: true,
            from: 'jpremo+sender@forio.com',
            replyTo: 'jpremo+receiver@forio.com',
            fromUserKey: '0000017c95575aedc3526d2e7bdc52e974e4',
            attachments: [pngBase64, pngCopy],
        };
        emailAdapter.sendEmail(session.groupKey, session.userKey, 'This is a test email from with replyTo!', 'this is the <a href="https://forio.com"> test </a> body!', optionals);
    });

    document.getElementById('sendEmailAdmin').addEventListener('click', () => {
        const pngBase64 = {
            encoding: 'BASE_64',
            name: 'testPic',
            contentType: 'image/png',
            data: 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAIxJREFUWEdjZBhgwDjA9jMQ5YAvzmb/efaewquWGDXYPDvqgNEQGA2B0RAYGiFAy+KaqBAYdcDICgFQtQryMaHql1qhgjURklu3IzuKWDNwOoCSUCAlFHFmQ2J9gB4VpFgO0kvVZhaplhPlAJgPCSVKciwn6ACY5TDD8aV8Qg7EpXe0KB4NgdEQGA0BAF7VgCFTeobfAAAAAElFTkSuQmCC',
        };
        const pngCopy = {...pngBase64, name: 'test 2'};
        const optionals = {
            familyNameFirst: true,
            html: true,
            attachments: [pngBase64, pngCopy],
        };
        emailAdapter.sendEmailToAdmin('1234', 'This is a test admin email!', 'this is the <a href="https://forio.com"> test </a> body!', optionals);
    });

    /* Create a user */
    createUserEl.onclick = (e) => {
        const handle = handleEl.value;
        const familyName = familyNameEl.value;
        const givenName = givenNameEl.value;
        const displayName = displayNameEl.value;
        const password = passwordEl.value;
        userAdapter.createUser({ handle, familyName, givenName, displayName, secret: { password }, objectType: 'native' })
            .then((user) => console.log('%c Created a user', 'font-size: 20px; color: #FB15B9FF;', user));
    };

    document.getElementById('transcribeVideo').addEventListener('click', () => {
        const videoKey = document.getElementById('transcribeVideoInput').value;
        const processors = [
            {
                mediaFormat: 'mp4',
                languageCode: 'en-US',
                objectType: 'transcription',
                mediaFile: 'archive.mp4',
                jobName: 'test-transcription',
            },
        ];
        const optionals = {
            // log: 'test log',
        };
        videoAdapter.processVideo(videoKey, processors, optionals);
    });
};

if (!session) {
    unauthedEl.classList.remove('hidden');
} else if (session.groupRole !== 'FACILITATOR') {
    isntFacEl.classList.remove('hidden');
} else {
    initialize();
}
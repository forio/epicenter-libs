import { config, authentication, presence, channelManager, errorManager, utility, Channel } from 'epicenter';
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

const session = authentication.getLocalSession();

/* Configuration */
if (config.isLocal()) {
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'epi-v3';
    config.browserStorageType = utility.BROWSER_STORAGE_TYPE.SESSION;
}
const channel = new Channel({
    scopeBoundary: utility.SCOPE_BOUNDARY.GROUP,
    scopeKey: session.groupKey,
    pushCategory: utility.PUSH_CATEGORY.CHAT,
});
const initFacilitator = () => {
    mainEl.classList.add('is-facilitator');
    channel.subscribe((data) => {
        console.log('%c some guy', 'font-size: 20px; color: #FB15B9FF;', data);
        const messageEl = document.createElement('div');
        const { user, text } = data;
        messageEl.innerText = `${user}: ${text}`;
        chatBoxEl.append(messageEl);
    });
};

const initStudent = () => {
    mainEl.classList.add('is-student');
    channelManager.handshake();
    let waiting = false;
    formEl.onsubmit = (e) => {
        e.preventDefault();
        if (waiting) return;
        const value = inputEl.value;
        console.log('%c pubthis', 'font-size: 20px; color: #FB15B9FF;', value);
        channel.publish({
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
        }, 1000);
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

    /* Handle error handlers */
    const handleByRelog = (error) => {
        let query = '';
        if (error.code) {
            query = query.concat(`?error=${error.code}`);
        }
        console.log('%c badbad', 'font-size: 20px; color: #FB15B9FF;', error);
        // window.location.href = `/login.html${query}`;
        // authentication.logout();
    };

    const handleSSO = () => {

    };

    const handleUnknown = () => {
        window.location.href = '/unknown.html';
        // authentication.logout();
    };

    const handleByLoginMethod = (error) => {
        switch (session.loginMethod.objectType) {
            case 'native': return handleByRelog(error);
            case 'sso': return handleSSO(error);
            case 'none':
            default: return handleUnknown(error);
        }
    };

    const handleByReAuth = (error, retry) => {
        if (error.code === 'AUTHENTICATION_INVALIDATED') {
            return authentication.upgrade({ objectType: 'user', inert: true })
                .then(() => retry())
                .catch(() => handleByLoginMethod(error));
        }
        return handleByLoginMethod(error);
    };

    errorManager.registerHandler((error) => error.status === 401, handleByReAuth);

    /* Handle onclicks */
    logoutEl.onclick = (e) => {
        authentication.logout();
        window.location.href = '/login.html';
    };
    presenceEl.onclick = (e) => {
        if (presenceEl.innerText !== 'Presence') return;

        presenceEl.innerText = 'Fetching';
        presence.forGroup(session.groupKey).then((res) => {
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

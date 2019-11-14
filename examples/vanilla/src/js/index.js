import { config, authentication, presence, channelManager, errorManager, utility } from 'epicenter';
import '../css/common.css';

/* Define DOM elements */
const displayNameEl = document.getElementById('display-name');
const presenceEl = document.getElementById('presence');
const logoutEl = document.getElementById('logout');
const usersEl = document.getElementById('users');

/* Configuration */
if (config.isLocal()) {
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'epi-v3';
    config.browserStorageType = utility.BROWSER_STORAGE_TYPES.SESSION;
}

/* Simple rerouting logic */
const session = authentication.getLocalSession();
if (!session) {
    window.location.href = '/login.html';
}

channelManager.handshake();

displayNameEl.innerText = session.displayName;

/* Handle error handlers */
const handleByRelog = (error) => {
    let query = '';
    if (error.code) {
        query = query.concat(`?error=${error.code}`);
    }
    window.location.href = `/login.html${query}`;
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
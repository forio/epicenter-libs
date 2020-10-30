require('./common');
import { authAdapter, groupAdapter } from 'epicenter';

const identifyError = (code) => {
    switch (code) {
        case 'AUTHORIZATION_EVAPORATED': return 'Whoops, looks like your session was forgotten, try logging in again';
        case 'AUTHORIZATION_EXPIRED': return 'Whoops, it looks like your session timed out, try logging in again.';
        case 'AUTHORIZATION_FAILURE': return 'Something\'s horribly wrong with your token.';
        case 'AUTHORIZATION_BLOCKED': return 'Uh oh! Looks like there was an issue with your account, please contact us.';
        default: return 'Mmm, looks like an unknown error has occured...';
    }
};

const query = {};
if (window.location.search) {
    window.location.search.slice(1).split('&').map((pair) => {
        const [key, value] = pair.split('=');
        query[key] = value;
    });
}

const errorEl = document.getElementById('login-error');
if (query.error) {
    errorEl.innerText = identifyError(query.error);
    errorEl.classList.add('visible');
}

document.getElementById('submit').onclick = (e) => {
    e.preventDefault();

    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const groupEl = document.getElementById('group');
    const groupLabelEl = document.getElementById('group-label');

    authAdapter.login({
        handle: usernameEl.value,
        password: passwordEl.value,
    }).then((session) => {
        console.log('%c asdwasd', 'font-size: 20px; color: #FB15B9FF;', session);
        if (!session.groupKey) {
            // groupAdapter.forUser(session.userKey)

            groupEl.classList.add('visible');
            groupLabelEl.classList.add('visible');
        } else {
            window.location.href = '/index.html';
        }
    });
};
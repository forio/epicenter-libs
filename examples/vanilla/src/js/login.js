import { authentication, config, utility } from 'epicenter';
import '../css/common.css';

if (config.isLocal()) {
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'epi-v3';
    config.browserStorageType = utility.BROWSER_STORAGE_TYPES.SESSION;
}

const identifyError = (code) => {
    switch (code) {
        case 'AUTHENTICATION_EVAPORATED': return 'Whoops, looks like your session was forgotten, try logging in again';
        case 'AUTHENTICATION_EXPIRED': return 'Whoops, it looks like your session timed out, try logging in again.';
        case 'AUTHENTICATION_FAILURE': return 'Something\'s horribly wrong with your token.';
        case 'AUTHENTICATION_BLOCKED': return 'Uh oh! Looks like there was an issue with your account, please contact us.';
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

    authentication.login({
        handle: usernameEl.value,
        password: passwordEl.value,
    }).then((res) => {
        const session = res.body;
        console.log('%c Logged in with this session', 'font-size: 20px; color: #FB15B9FF;', session);
        window.location.href = '/index.html';
    });
};
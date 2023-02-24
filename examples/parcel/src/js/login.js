import './config';
import { authAdapter, groupAdapter } from 'epicenter-libs';
// import { authAdapter, groupAdapter } from 'epicenter';

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

document.getElementById('submit').onclick = async(e) => {
    e.preventDefault();
    if (e.target.innerText !== 'Submit') return;

    e.target.innerHTML = 'Logging in';
    const usernameEl = document.getElementById('username');
    const passwordEl = document.getElementById('password');
    const groupEl = document.getElementById('group');
    const groupLabelEl = document.getElementById('group-label');
    const adminCheckboxEl = document.getElementById('admin');

    const session = await authAdapter.login({
        handle: usernameEl.value,
        password: passwordEl.value,
        groupKey: groupEl.value,
    }, {objectType: adminCheckboxEl.checked ? 'admin' : 'user' });

    if (!session.groupKey) {
        groupAdapter.getSessionGroups().then((groups) => {
            groups.forEach(({ name, groupKey }) => {
                const optionEl = document.createElement('option');
                optionEl.value = groupKey;
                optionEl.innerHTML = name;
                groupEl.append(optionEl);
            });
            groupEl.classList.add('visible');
            groupLabelEl.classList.add('visible');
            e.target.innerHTML = 'Submit';
        });
    } else {
        window.location.href = '/index.html';
        // console.log('%c i have logged in?', 'font-size: 20px; color: #FB15B9FF;', session);
    }
};

document.getElementById('reset-password').addEventListener('submit', async(event) => {
    event.preventDefault();
    const { handle } = event.target.elements;
    await authAdapter.resetPassword(handle.value, 'https://forio.com/app/harvard-test/crafting-your-life', 'Please reset your password for test!');
});
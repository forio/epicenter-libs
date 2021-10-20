

epicenter.config.accountShortName = 'forio-dev';
epicenter.config.projectShortName = 'epi-v3';

document.querySelector('#login').addEventListener('click', () => {
    const handle = document.querySelector('input[name="handle"]').value;
    const password = document.querySelector('input[name="password"]').value;

    epicenter.authAdapter.login({ handle, password });
});
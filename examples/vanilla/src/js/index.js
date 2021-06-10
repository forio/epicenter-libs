import './config';
import { authAdapter } from 'epicenter';

const session = authAdapter.getLocalSession();

/* Define DOM elements */
const displayNameEl = document.getElementById('display-name');
const groupRoleEl = document.getElementById('group-role');
const logoutEl = document.getElementById('logout');

logoutEl.onclick = (e) => {
    e.target.disabled = true;
    authAdapter.logout().then(() => {
        displayNameEl.textContent = 'stranger';
        groupRoleEl.textContent = 'not currently signed in on Epicenter';
        e.target.disabled = false;
    });
};

if (session) {
    displayNameEl.textContent = session.displayName;
    if (!session.groupKey) {
        groupRoleEl.textContent = 'authenticated but not associated with a group';
    } else {
        groupRoleEl.textContent = `signed in as a ${session.groupRole}`;
    }
}

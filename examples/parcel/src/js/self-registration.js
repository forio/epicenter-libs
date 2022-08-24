import './config';
import { groupAdapter } from 'epicenter-libs';

document.getElementById('self-register').addEventListener('submit', async(event) => {
    event.preventDefault();
    const linkURL = '/register';
    const redirectURL = '/login';
    const subject = 'Please finish your registration for test!';
    const { email, groupKey } = event.target.elements;
    await groupAdapter.sendRegistrationEmail(groupKey.value, email.value, { linkURL, redirectURL, subject });
});

document.getElementById('finish-self-register').addEventListener('submit', async(event) => {
    event.preventDefault();
    const { url, password, displayName, givenName, familyName } = event.target.elements;
    const token = url.value.split('/').pop();
    const optionals = { displayName: displayName.value || undefined, givenName: givenName.value || undefined, familyName: familyName.value || undefined };
    const { whoAmI } = await groupAdapter.selfRegister(token, password.value, optionals);
    console.log('%c Registered user', 'font-size: 20px; color: #FB15B9FF;', whoAmI);
});
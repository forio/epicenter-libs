import Router from './router.js';
import store from './store.js';
import channelManager from './channel-manager.js';
import * as utility from './utility.js';

export async function logout() {
    try {
        await channelManager.disconnect();
        store.removeItem(utility.AUTH_TOKEN);
    } catch (err) {
        throw new utility.EpicenterError('Encountered error while logging out');
    }
}

export async function authenticate(options) {
    const { handle, password, group, objectType = 'user', ...others } = options;
    const { accountShortName, projectShortName } = others;

    const response = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post('/authentication', {
            body: { handle, password, group, objectType },
            includeAuthorization: false,
        });
    await logout();

    store.setItem(utility.AUTH_TOKEN, response.body.session);
    return response;
}

export async function upgrade(options) {
    const { objectType = 'admin', ...others } = options;
    const { accountShortName } = others;
    
    const response = await new Router()
        .withAccountShortName(accountShortName)
        .patch('/authentication', {
            body: { objectType },
        });
    await logout();

    store.setItem(utility.AUTH_TOKEN, response.body.session);
    return response;
}

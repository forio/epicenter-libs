import Router from './router.js';
import identification from './identification.js';
import channelManager from './channel-manager.js';
import * as utility from './utility.js';

export async function logout() {
    try {
        identification.session = undefined;
        await channelManager.disconnect();
    } catch (err) {
        throw new utility.EpicenterError('Encountered error while logging out');
    }
}

export async function login(options) {
    const { handle, password, groupKey, objectType = 'user', ...others } = options;
    const { accountShortName, projectShortName } = others;

    const response = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post('/authentication', {
            body: { handle, password, groupKey, objectType },
            includeAuthorization: false,
        });
    await logout();

    identification.session = response.body;
    return response;
}

export async function upgrade(options) {
    const { objectType = 'admin', inert, ...others } = options;
    const { accountShortName, projectShortName } = others;

    const response = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch('/authentication', {
            body: { objectType },
            inert,
        });
    await logout();

    identification.session = response.body;
    return response;
}

export async function sso(options) {
    const { accountShortName, projectShortName } = options;

    const response = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get('/registration/sso');

    identification.session = response.body;
    return response;
}

export async function getSession() {
    const response = await new Router().get('/authentication');

    identification.session = response.body;
    return response;
}

export function getLocalSession() {
    return identification.session;
}
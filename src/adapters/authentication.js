import { Router, identification } from 'utils';
import { cometdAdapter } from 'adapters';

export async function logout() {
    identification.session = undefined;
    await cometdAdapter.disconnect();
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
            inert: true,
        });
    await logout();

    identification.session = response.body;
    return response;
}

export async function upgrade(options) {
    const { objectType = 'admin', inert, groupKey, ...others } = options;
    const { accountShortName, projectShortName } = others;

    const response = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch('/authentication', {
            body: { objectType, groupKey: identification.session.groupKey || groupKey },
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

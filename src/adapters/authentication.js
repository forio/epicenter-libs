import { Router, identification } from 'utils';
import { cometdAdapter } from 'adapters';


/**
 * Authentication API adapters -- for authentication
 * @namespace authAdapter
 */


/**
 * Logs out of current Epicenter session.
 *
 * @memberof authAdapter
 * @example
 *
 * epicenter.authAdapter.logout()
 *
 * @returns {Promise}   Promise resolving to successful logout
 */
export async function logout() {
    identification.session = undefined;
    await cometdAdapter.disconnect();
}

export async function login(options) {
    const { handle, password, groupKey, objectType = 'user', ...others } = options;
    const { accountShortName, projectShortName } = others;
    const session = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post('/authentication', {
            body: { objectType, handle, password, groupKey: groupKey || undefined },
            includeAuthorization: false,
            inert: true,
        }).then(({ body }) => body);
    await logout();

    identification.session = session;
    return session;
}

export async function upgrade(groupKey, options) {
    const { objectType = 'user', inert, ...others } = options;
    const { accountShortName, projectShortName } = others;

    const session = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch('/authentication', {
            body: { objectType, groupKey },
            inert,
        }).then(({ body }) => body);
    await logout();

    identification.session = session;
    return session;
}

export async function sso(options) {
    const { accountShortName, projectShortName } = options;

    const session = await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get('/registration/sso')
        .then(({ body }) => body);

    identification.session = session;
    return session;
}

export async function getSession() {
    const { body } = await new Router().get('/authentication');

    identification.session = body;
    return body;
}

export function getLocalSession() {
    return identification.session;
}

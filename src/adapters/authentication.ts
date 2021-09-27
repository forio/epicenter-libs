import { Router, identification } from 'utils/index';
import { cometdAdapter } from 'adapters/index';


interface Credentials {
    handle: string,
    password: string,
    groupKey?: string,
}
interface LoginOptions extends GenericAdapterOptions {
    objectType?: string,
}
interface UpgradeOptions extends GenericAdapterOptions {
    objectType?: string,
    inert?: boolean,
}
interface Session {

}


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

export async function login(
    credentials: Credentials,
    optionals: LoginOptions = {}
) {
    const { handle, password, groupKey } = credentials;
    const {
        objectType = 'user',
        accountShortName, projectShortName, server,
    } = optionals;
    const session = await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post('/authentication', {
            inert: true,
            includeAuthorization: false,
            body: { objectType, handle, password, groupKey: groupKey || undefined },
        }).then(({ body }) => body);
    await logout();
    identification.session = session;
    return session;
}

/**
 * Regenerates your epicenter session with the appropriate context. Allows users to update their session to the correct group, and admins to update their session with the correct account name. Will fail if the user/admin does not already belong to the group/account.
 *
 * @memberof authAdapter
 * @param {string} groupOrAccount   Group key or account name
 * @param {object} [optionals={}]   Optional parameters
 * @returns {Promise}   Promise resolving to successful logout
 */
export async function regenerate(
    groupOrAccount: string,
    optionals: UpgradeOptions = {}
) {
    const {
        objectType = 'user', inert,
        accountShortName, projectShortName, server,
    } = optionals;

    const session = await new Router()
        .withServer(server)
        .withAccountShortName(objectType === 'admin' ? groupOrAccount : accountShortName)
        .withProjectShortName(projectShortName)
        .patch('/authentication', {
            inert,
            body: {
                objectType,
                groupKey: objectType === 'user' ? groupOrAccount : undefined,
            },
        }).then(({ body }) => body);

    await logout();
    identification.session = session;
    return session;
}

export async function sso(optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;

    const session = await new Router()
        .withServer(server)
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

export function setLocalSession(session: Session) {
    return identification.session = session;
}

/**
 * Sends a link to reset a user's password to their email
 * Base URL: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/authentication/password/user/{handle}`
 *
 * @memberof authAdapter
 * @example
 * const subject = 'Please reset your project for Crafting your Life';
 * const url = 'https://forio.com/app/harvard-test/crafting-your-life';
 * const handle = 'testUser@test.com'
 * epicenter.authAdapter.resetPassword(handle { redirectURL, subject });
 *
 * @param {string}  handle                          Handle that user would use to login
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.redirectURL]         Url to redirect to after password reset is completed. Must be in the forio domain otherwise an error will be thrown
 * @param {string}  [optionals.subject]             The subject of the email that will be sent
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */
export async function resetPassword(
    handle: string,
    optionals: {
        redirectURL?: string,
        subject?: string,
    } & GenericAdapterOptions = {}
): Promise<void> {
    const {
        redirectURL, subject,
        accountShortName, projectShortName, server,
    } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/authentication/password/user/${handle}`, {
            body: {
                redirectUrl: redirectURL,
                subject,
            },
        })
        .then(({ body }) => body);
}
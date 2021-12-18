import type { RoutingOptions } from '../utils/router';
import type { Session } from '../utils/identification';


import { Router, identification } from '../utils';
import cometdAdapter from './cometd';


interface UserCredentials {
    handle: string,
    password: string,
    groupKey?: string,
}
interface AppCredentials {
    secretKey: string,
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
export async function logout(): Promise<void> {
    identification.session = undefined;
    await cometdAdapter.disconnect();
}

export async function login(
    credentials: UserCredentials | AppCredentials,
    optionals: { objectType?: string } & RoutingOptions = {}
): Promise<Session> {
    const { objectType, ...routingOptions } = optionals;
    let payload;
    if (Object.prototype.hasOwnProperty.call(credentials, 'handle')) {
        const { handle, password, groupKey } = credentials as UserCredentials;
        payload = { objectType: objectType ?? 'user', handle, password, groupKey: groupKey || undefined };
    }
    if (Object.prototype.hasOwnProperty.call(credentials, 'secretKey')) {
        const { secretKey } = credentials as AppCredentials;
        payload = { objectType: objectType ?? 'account', secretKey };
    }
    const session = await new Router()
        .post('/authentication', {
            inert: true,
            includeAuthorization: false,
            body: payload,
            ...routingOptions,
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
    optionals: {
        objectType?: string,
    } & RoutingOptions = {}
): Promise<Session> {
    const {
        objectType = 'user',
        accountShortName,
        ...routingOptions
    } = optionals;

    const session = await new Router()
        .patch('/authentication', {
            accountShortName: objectType === 'admin' ?
                groupOrAccount :
                accountShortName,
            body: {
                objectType,
                groupKey: objectType === 'user' ?
                    groupOrAccount :
                    undefined,
            },
            ...routingOptions,
        }).then(({ body }) => body);

    await logout();
    identification.session = session;
    return session;
}

export async function sso(
    optionals: RoutingOptions = {},
): Promise<Session> {
    const session = await new Router()
        .get('/registration/sso', optionals)
        .then(({ body }) => body);

    identification.session = session;
    return session;
}

export async function getSession(): Promise<Session> {
    const { body } = await new Router().get('/authentication');
    identification.session = body;
    return body;
}

export function getLocalSession(): Session | undefined {
    return identification.session;
}

export function setLocalSession(session: Session): Session {
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
 * epicenter.authAdapter.resetPassword(handle, { redirectURL, subject });
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
    } & RoutingOptions = {}
): Promise<void> {
    const {
        redirectURL, subject,
        ...routingOptions
    } = optionals;

    return await new Router()
        .post(`/authentication/password/user/${handle}`, {
            ...routingOptions,
            body: {
                redirectUrl: redirectURL,
                subject,
            },
        })
        .then(({ body }) => body);
}

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
 * Run API adapters -- use this to create, update, delete, and manage your runs
 * @namespace authAdapter
 */

/**
 * Logs out of current Epicenter session.
 * @example
 * epicenter.authAdapter.logout()
 * @returns promise resolving to successful logout
 */
export async function logout(): Promise<void> {
    await cometdAdapter.disconnect();
    try {
        if (identification?.session?.groupKey) {
            await new Router()
                .delete(`/presence/group/${identification?.session?.groupKey}`);
        }
        await new Router()
            .delete('/verification');
    } catch (err) {
        console.error('Error with DELETE to /verification', err);
    }
    identification.session = undefined;
}

export async function getSession(): Promise<Session> {
    const { body } = await new Router().get('/verification');
    identification.session = body;
    return body;
}

export function getLocalSession(): Session | undefined {
    return identification.session;
}

export function setLocalSession(session: Session): Session {
    return identification.session = session;
}

export async function removeLocalSession(): Promise<void> {
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
    
    await removeLocalSession();
    
    identification.session = session;
    return session;
}

/**
 * Regenerates your epicenter session with the appropriate context. Allows users to update their session to the correct group, and admins to update their session with the correct account name. Will fail if the user/admin does not already belong to the group/account.
 * @example
 * // Changes the current user session to have a group context associated with the provided key
 * epicenter.authAdapter.regenerate('00000165ad4e6a3cd22b993340b963820239');
 * // Changes the current admin session to use the account context for the 'acme' account.
 * epicenter.authAdapter.regenerate('acme', { objectType: 'admin' });
 * @param groupOrAccount            Group key or account name
 * @param [optionals]               Optional parameters
 * @param [optionals.objectType]    The object type to regenerate for. Uses objectType: 'user' by default.
 * @returns promise resolving to the new session object
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
    
    await removeLocalSession();
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

/**
 * Sends a link to reset a user's password to their email
 * @example
 * const subject = 'Please reset your password for the Acme simulation';
 * const url = 'https://forio.com/app/acme/simulations';
 * const handle = 'testUser@test.com'
 * epicenter.authAdapter.resetPassword(handle, { redirectURL, subject });
 * @param  handle                   Handle that user would use to login
 * @param  [optionals]              Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param  [optionals.redirectURL]  Url to redirect to after password reset is completed. Must be in the forio domain otherwise an error will be thrown
 * @param  [optionals.subject]      The subject of the email that will be sent
 * @returns promise that resolves to undefined (indicating success)
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
        .post(`/verification/password/user/${handle}`, {
            ...routingOptions,
            body: {
                redirectUrl: redirectURL,
                subject,
            },
        })
        .then(({ body }) => body);
}

export async function verify(
    token: string,
    optionals: RoutingOptions = {},
): Promise<Session> {
    return await new Router()
        .get('/verification', {
            authorization: `Bearer ${token}`,
            ...optionals,
        })
        .then(({ body }) => body);
}

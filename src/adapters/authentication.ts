import { Router, identification } from 'utils/index';
import cometdAdapter from './cometd';


interface Credentials {
    handle: string,
    password: string,
    groupKey?: string,
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
    credentials: Credentials,
    optionals: { objectType?: string } & GenericAdapterOptions = {}
): Promise<Session> {
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
    optionals: {
        objectType?: string,
        inert?: boolean,
    } & GenericAdapterOptions = {}
): Promise<Session> {
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

export async function sso(
    optionals: GenericAdapterOptions = {},
): Promise<Session> {
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


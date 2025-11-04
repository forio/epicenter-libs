import type { RoutingOptions } from '../utils/router';
import type { Session } from '../utils/identification';

import { Router, identification } from '../utils';
import cometdAdapter from './cometd';


export interface UserCredentials {
    handle: string;
    password: string;
    groupKey?: string;
}

export interface AppCredentials {
    secretKey: string;
}


/**
 * Logs out of current Epicenter session. Also disconnects from CometD and removes user presence.
 * Priorities:
 * 1. Delete local session (even if 2 and 3 fail)
 * 2. Delete remote session (even if 3 fails)
 * 3. Other cleanup (disconnect CometD, delete presence)
 * Cleanup operations require authentication, so await cleanup before delete.
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/verification`
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * await authAdapter.logout();
 *
 * @param [verificationOptionals]   Optional arguments; pass network call options overrides here.
 * @param [presenceOptionals]       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when logout is complete
 */
export async function logout(
    verificationOptionals: RoutingOptions = {},
    presenceOptionals: RoutingOptions = verificationOptionals,
): Promise<void> {
    const cleanup = [cometdAdapter.disconnect()];
    const groupKey = identification?.session?.groupKey;
    if (groupKey) {
        cleanup.push(
            new Router().delete(
                `/presence/group/${groupKey}`,
                presenceOptionals,
            ),
        );
    }
    await Promise.allSettled(cleanup);
    await new Router()
        .delete('/verification', verificationOptionals)
        .finally(() => (identification.session = undefined));
}


/**
 * Retrieves the current session from the server
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/verification`
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * const session = await authAdapter.getSession();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the session object
 */
export async function getSession(optionals: RoutingOptions = {}): Promise<Session> {
    const { body } = await new Router().get('/verification', optionals);
    identification.session = body;
    return body;
}


/**
 * Retrieves the session stored in memory
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * const session = authAdapter.getLocalSession();
 *
 * @returns the session object if it exists, undefined otherwise
 */
export function getLocalSession(): Session | undefined {
    return identification.session;
}


/**
 * Stores a session in memory
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * authAdapter.setLocalSession(session);
 *
 * @param session   The session object to store
 * @returns the stored session object
 */
export function setLocalSession(session: Session): Session {
    return identification.session = session;
}


/**
 * Removes the session stored in memory and disconnects from CometD
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * await authAdapter.removeLocalSession();
 *
 * @returns promise that resolves when the session is removed and CometD is disconnected
 */
export async function removeLocalSession(): Promise<void> {
    identification.session = undefined;
    await cometdAdapter.disconnect();
}


/**
 * Logs in a user or app and stores the session
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/authentication`
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * // User login
 * const session = await authAdapter.login({
 *     handle: 'user@example.com',
 *     password: 'myPassword',
 *     groupKey: '00000165ad4e6a3cd22b993340b963820239',
 * });
 * // App login
 * const session = await authAdapter.login({
 *     secretKey: 'my-secret-key',
 * });
 *
 * @param credentials                           User or app credentials
 * @param credentials.handle                    User handle (email or username)
 * @param credentials.password                  User password
 * @param [credentials.groupKey]                Group key for user login
 * @param credentials.secretKey                 Secret key for app login
 * @param [optionals]                           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.objectType]                Object type for authentication (defaults to 'user' or 'account' based on credentials)
 * @param [optionals.forcePathInclusion]        Force admin login to include the path in the generated cookie; useful when an admin login should be limited in scope to a single project
 * @returns promise that resolves to the session object
 */
export async function login(
    credentials: UserCredentials | AppCredentials,
    optionals: {
        objectType?: string;
        forcePathInclusion?: boolean;
    } & RoutingOptions = {},
): Promise<Session> {
    const { objectType, forcePathInclusion, ...routingOptions } = optionals;
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

    identification.setSessionWithOptions(session, forcePathInclusion ?? false);
    return session;
}


/**
 * Regenerates your epicenter session with the appropriate context. Allows users to update their session to the correct group, and admins to update their session with the correct account name. Will fail if the user/admin does not already belong to the group/account.
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/authentication`
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * // Changes the current user session to have a group context associated with the provided key
 * await authAdapter.regenerate('00000165ad4e6a3cd22b993340b963820239');
 * // Changes the current admin session to use the account context for the 'acme' account
 * await authAdapter.regenerate('acme', { objectType: 'admin' });
 *
 * @param groupOrAccount                    Group key or account name
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.objectType]            The object type to regenerate for (defaults to 'user')
 * @param [optionals.forcePathInclusion]    Force the path to be included in the generated cookie
 * @returns promise that resolves to the new session object
 */
export async function regenerate(
    groupOrAccount: string,
    optionals: {
        objectType?: string;
        forcePathInclusion?: boolean;
    } & RoutingOptions = {},
): Promise<Session> {
    const {
        objectType = 'user',
        accountShortName,
        forcePathInclusion,
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
    identification.setSessionWithOptions(session, forcePathInclusion ?? false);
    return session;
}


/**
 * Authenticates using Single Sign-On (SSO)
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/sso/user`
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * const session = await authAdapter.sso();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the session object
 */
export async function sso(
    optionals: RoutingOptions = {},
): Promise<Session> {
    const session = await new Router()
        .get('/registration/sso/user', optionals)
        .then(({ body }) => body);

    identification.session = session;
    return session;
}


/**
 * Retrieves the SAML link from the SSO configuration
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/sso/user/saml`
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * const samlLink = await authAdapter.getSAMLLink();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the SAML link
 */
export async function getSAMLLink(
    optionals: RoutingOptions = {},
): Promise<string> {
    return await new Router()
        .get('/registration/sso/user/saml', optionals)
        .then(({ body }) => body);
}


/**
 * Generates and returns an epicenter URL that will redirect to the SAML url
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * const samlURL = authAdapter.generateSAMLLINK();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns the generated SAML URL string
 */
export function generateSAMLLINK(
    optionals: RoutingOptions = {},
): string {
    return new Router().getURL('/registration/sso/user/saml', optionals).toString();
}


/**
 * Sends an outcome to an external link specified in project config. For example, sending a grade back to a third party platform.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/lti/{LTI_VERSION}/outcome`
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * await authAdapter.ssoOutcome('1.3', {
 *     value: 95,
 *     sourcedId: 'student-assignment-123',
 *     outcomeServiceUrl: 'https://lms.example.com/outcome',
 * });
 *
 * @param ltiVersion                                The version of LTI to use (valid versions: 1.1, 1.2, 1.3)
 * @param outcomeInformation                        Outcome information to send
 * @param outcomeInformation.value                  The value to pass back to the outcomeServiceUrl (e.g., the grade a student received)
 * @param outcomeInformation.sourcedId              The id of the current assignment/student as provided by the client using the SSO service
 * @param outcomeInformation.outcomeServiceUrl      The url called for passing back the outcome
 * @param [optionals]                               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the response object
 */
export async function ssoOutcome(
    ltiVersion: string,
    outcomeInformation: {
        value: number;
        sourcedId: string;
        outcomeServiceUrl: string;
    },
    optionals: RoutingOptions = {},
): Promise<Record<string, unknown>> {
    const { ...routingOptions } = optionals;
    return await new Router()
        .post(`/lti/${ltiVersion}/outcome`, {
            body: outcomeInformation,
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Sends a link to reset a user's password to their email
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/verification/password/user/{HANDLE}`
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * const subject = 'Please reset your password for the Acme simulation';
 * const redirectURL = 'https://forio.com/app/acme/simulations';
 * const handle = 'testUser@test.com';
 * await authAdapter.resetPassword(handle, { redirectURL, subject });
 *
 * @param handle                        Handle that user would use to login
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.redirectURL]       URL to redirect to after password reset is completed (must be in the forio domain)
 * @param [optionals.subject]           The subject of the email that will be sent
 * @returns promise that resolves when the reset email is sent
 */
export async function resetPassword(
    handle: string,
    optionals: {
        redirectURL?: string;
        subject?: string;
    } & RoutingOptions = {},
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


/**
 * Verifies a token and retrieves the associated session
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/verification`
 *
 * @example
 * import { authAdapter } from 'epicenter-libs';
 * const session = await authAdapter.verify('my-auth-token');
 *
 * @param token         Authorization token to verify
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the session object
 */
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

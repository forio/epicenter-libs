import type { RoutingOptions } from '../utils/router';
import { Router } from '../utils';

export interface RegistrationInfo {
    projectShortName?: string | null;
    groupName?: string | null;
    accountShortName?: string | null;
    accountName?: string | null;
    familyName?: string | null;
    givenName?: string | null;
    projectName?: string | null;
    email?: string | null;
    groupKey?: string | null;
}

export interface TeamRegistrationInfo {
    accountShortName?: string | null;
    accountName?: string | null;
    familyName?: string | null;
    givenName?: string | null;
    email?: string | null;
}

export interface RegistrationResult {
    whoAmI: unknown;
    redirectUrl?: string | null;
}

export type TeamRole = 'OWNER' | 'AUTHOR' | 'SUPPORT' | 'ASSOCIATE';
export type SsoProtocol = 'SAML';


/**
 * Gets registration info for a self-registration token.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/self/{token}`
 *
 * @param token         Self-registration token
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to registration info
 */
export async function getSelfRegistrationInfo(
    token: string,
    optionals: RoutingOptions = {},
): Promise<RegistrationInfo> {
    return await new Router()
        .get(`/registration/self/${token}`, optionals)
        .then(({ body }) => body);
}


/**
 * Completes a self-registration using a token.
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/self/{token}`
 *
 * @param token                     Self-registration token
 * @param password                  Password for the new account
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @param [optionals.displayName]   Display name for the new user
 * @param [optionals.givenName]     Given name for the new user
 * @param [optionals.familyName]    Family name for the new user
 * @param [optionals.handle]        Handle for the new user
 * @returns promise that resolves to the registration result including session info
 */
export async function completeSelfRegistration(
    token: string,
    password: string,
    optionals: {
        displayName?: string;
        givenName?: string;
        familyName?: string;
        handle?: string;
    } & RoutingOptions = {},
): Promise<RegistrationResult> {
    const { displayName, givenName, familyName, handle, ...routingOptions } = optionals;
    return await new Router()
        .patch(`/registration/self/${token}`, {
            body: { password, displayName, givenName, familyName, handle },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Sends a self-registration invite email to a user.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/self/{groupKey}`
 *
 * @param groupKey                      Group key to register the user into
 * @param email                         Email address of the user to invite
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @param [optionals.linkDestination]   Destination for the registration link ('DASHBOARD' or 'MANAGER')
 * @param [optionals.modality]          Registration modality
 * @param [optionals.redirectUrl]       URL to redirect to after registration
 * @param [optionals.subject]           Subject line for the invite email
 * @param [optionals.givenName]         Pre-populate given name in the registration form
 * @param [optionals.familyName]        Pre-populate family name in the registration form
 * @param [optionals.linkUrl]           Custom URL to use for the registration link
 * @param [optionals.confirmation]      Whether to send a confirmation email
 * @returns promise that resolves to undefined if successful
 */
export async function sendSelfRegistrationInvite(
    groupKey: string,
    email: string,
    optionals: {
        linkDestination?: 'DASHBOARD' | 'MANAGER';
        modality?: 'NONE' | 'HBP' | 'ICC' | 'SSO';
        redirectUrl?: string;
        subject?: string;
        givenName?: string;
        familyName?: string;
        linkUrl?: string;
        confirmation?: boolean;
    } & RoutingOptions = {},
): Promise<void> {
    const {
        linkDestination, modality, redirectUrl, subject,
        givenName, familyName, linkUrl, confirmation,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/registration/self/${groupKey}`, {
            body: { email, linkDestination, modality, redirectUrl, subject, givenName, familyName, linkUrl, confirmation },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Gets registration info for an invite token.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/invite/{token}`
 *
 * @param token         Invite registration token
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to registration info
 */
export async function getInviteRegistrationInfo(
    token: string,
    optionals: RoutingOptions = {},
): Promise<RegistrationInfo> {
    return await new Router()
        .get(`/registration/invite/${token}`, optionals)
        .then(({ body }) => body);
}


/**
 * Completes an invite registration using a token.
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/invite/{token}`
 *
 * @param token                     Invite registration token
 * @param password                  Password for the new account
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @param [optionals.displayName]   Display name for the new user
 * @param [optionals.givenName]     Given name for the new user
 * @param [optionals.familyName]    Family name for the new user
 * @param [optionals.handle]        Handle for the new user
 * @returns promise that resolves to the registration result including session info
 */
export async function completeInviteRegistration(
    token: string,
    password: string,
    optionals: {
        displayName?: string;
        givenName?: string;
        familyName?: string;
        handle?: string;
    } & RoutingOptions = {},
): Promise<RegistrationResult> {
    const { displayName, givenName, familyName, handle, ...routingOptions } = optionals;
    return await new Router()
        .patch(`/registration/invite/${token}`, {
            body: { password, displayName, givenName, familyName, handle },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Sends an invite registration email to a user.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/invite/{groupKey}`
 *
 * @param groupKey                      Group key to invite the user into
 * @param email                         Email address of the user to invite
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @param [optionals.linkDestination]   Destination for the registration link ('DASHBOARD' or 'MANAGER')
 * @param [optionals.modality]          Registration modality
 * @param [optionals.redirectUrl]       URL to redirect to after registration
 * @param [optionals.subject]           Subject line for the invite email
 * @param [optionals.givenName]         Pre-populate given name in the registration form
 * @param [optionals.familyName]        Pre-populate family name in the registration form
 * @param [optionals.linkUrl]           Custom URL to use for the registration link
 * @param [optionals.confirmation]      Whether to send a confirmation email
 * @returns promise that resolves to undefined if successful
 */
export async function sendInvite(
    groupKey: string,
    email: string,
    optionals: {
        linkDestination?: 'DASHBOARD' | 'MANAGER';
        modality?: 'NONE' | 'HBP' | 'ICC' | 'SSO';
        redirectUrl?: string;
        subject?: string;
        givenName?: string;
        familyName?: string;
        linkUrl?: string;
        confirmation?: boolean;
    } & RoutingOptions = {},
): Promise<void> {
    const {
        linkDestination, modality, redirectUrl, subject,
        givenName, familyName, linkUrl, confirmation,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/registration/invite/${groupKey}`, {
            body: { email, linkDestination, modality, redirectUrl, subject, givenName, familyName, linkUrl, confirmation },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Gets registration info for a team invite token.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/team/{token}`
 *
 * @param token         Team invite token
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to team registration info
 */
export async function getTeamRegistrationInfo(
    token: string,
    optionals: RoutingOptions = {},
): Promise<TeamRegistrationInfo> {
    return await new Router()
        .get(`/registration/team/${token}`, optionals)
        .then(({ body }) => body);
}


/**
 * Sends a team invite email.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/team`
 *
 * @param invitingAuthor            Name or identifier of the person sending the invite
 * @param role                      Role to assign to the invited user
 * @param redirectUrl               URL to redirect to after accepting the invite
 * @param email                     Email address of the user to invite
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @param [optionals.subject]       Subject line for the invite email
 * @param [optionals.givenName]     Pre-populate given name for the invited user
 * @param [optionals.familyName]    Pre-populate family name for the invited user
 * @returns promise that resolves to undefined if successful
 */
export async function sendTeamInvite(
    invitingAuthor: string,
    role: TeamRole,
    redirectUrl: string,
    email: string,
    optionals: {
        subject?: string;
        givenName?: string;
        familyName?: string;
    } & RoutingOptions = {},
): Promise<void> {
    const { subject, givenName, familyName, ...routingOptions } = optionals;
    return await new Router()
        .post('/registration/team', {
            body: { invitingAuthor, role, redirectUrl, email, subject, givenName, familyName },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * @deprecated Use getSsoAdminRegistration or getSsoUserRegistration instead.
 * Gets SSO registration info for a given SSO protocol.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/sso/{ssoProtocol}`
 *
 * @param ssoProtocol   The SSO protocol (e.g. 'SAML')
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to SSO registration data
 */
export async function getSsoRegistration(
    ssoProtocol: SsoProtocol,
    optionals: RoutingOptions = {},
): Promise<unknown> {
    console.warn('getSsoRegistration is deprecated. Use getSsoAdminRegistration or getSsoUserRegistration instead.');
    return await new Router()
        .get(`/registration/sso/${ssoProtocol}`, optionals)
        .then(({ body }) => body);
}


/**
 * Gets admin SSO registration info for a given SSO protocol.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/sso/admin/{ssoProtocol}`
 *
 * @param ssoProtocol   The SSO protocol (e.g. 'SAML')
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to SSO admin registration data
 */
export async function getSsoAdminRegistration(
    ssoProtocol: SsoProtocol,
    optionals: RoutingOptions = {},
): Promise<unknown> {
    return await new Router()
        .get(`/registration/sso/admin/${ssoProtocol}`, optionals)
        .then(({ body }) => body);
}


/**
 * Gets user SSO registration info for a given SSO protocol.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/registration/sso/user/{ssoProtocol}`
 *
 * @param ssoProtocol   The SSO protocol (e.g. 'SAML')
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to SSO user registration data
 */
export async function getSsoUserRegistration(
    ssoProtocol: SsoProtocol,
    optionals: RoutingOptions = {},
): Promise<unknown> {
    return await new Router()
        .get(`/registration/sso/user/${ssoProtocol}`, optionals)
        .then(({ body }) => body);
}

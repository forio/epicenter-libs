import type { GenericScope, Permit } from '../utils/constants';
import type { RoutingOptions } from '../utils/router';

import Router from '../utils/router';


export type SessionID = string;
export type ArchiveID = string;
export type APIKey = string;
export type Token = string;
export interface VonageSession {
    sessionId: SessionID;
}
export interface VonageArchive {
    archiveId: string;
    status:
        | 'available'
        | 'deleted'
        | 'failed'
        | 'paused'
        | 'started'
        | 'stopped'
        | 'uploaded'
        | 'expired';
}


/**
 * Retrieves a Vonage session ID
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vonage/session`
 *
 * @example
 * import { vonageAPI } from 'epicenter-libs';
 * const session = await vonageAPI.getSession();
 * console.log(session.sessionId);
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an object containing the Vonage session ID
 */
export async function getSession(
    optionals: RoutingOptions = {},
): Promise<{ sessionId: SessionID }> {
    return await new Router()
        .get('/vonage/session', optionals)
        .then(({ body }) => body);
}


/**
 * Creates a token for a Vonage session
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vonage/token`
 *
 * @example
 * import { vonageAPI } from 'epicenter-libs';
 * const token = await vonageAPI.postToken({ sessionId: 'my-session-id' });
 * console.log(token.token);
 *
 * @param body              Token request body
 * @param body.sessionId    The Vonage session ID to create a token for
 * @param [optionals]       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an object containing the Vonage token
 */
export async function postToken(
    body: { sessionId: string },
    optionals: RoutingOptions = {},
): Promise<{ token: Token }> {
    return await new Router()
        // The initialLayoutClassList is a temporary fix for existing simulations;
        // This should likely be implemented differently if we decide to continue using Vonage;
        // We are currently investigating alternatives due to performance issues, so this solution just prevents API errors;
        .post('/vonage/token', { body: { ...body, initialLayoutClassList: ['placeholder'] }, ...optionals })
        .then(({ body }) => body);
}


/**
 * Creates an archive for a Vonage session
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vonage/archive`
 *
 * @example
 * import { vonageAPI } from 'epicenter-libs';
 * const archive = await vonageAPI.postArchive({
 *     name: 'my-archive',
 *     scope: { scopeBoundary: 'group', scopeKey: 'group-123' },
 *     sessionId: 'session-id',
 * });
 *
 * @param body                      Archive configuration
 * @param body.name                 Name for the archive
 * @param body.scope                Scope associated with the archive
 * @param body.scope.scopeBoundary  Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param body.scope.scopeKey       Scope key, a unique identifier tied to the scope
 * @param [body.scope.userKey]      Optional key to scope the archive to a user
 * @param body.sessionId            The Vonage session ID to archive
 * @param [body.permit]             Optional permissions for the archive
 * @param [body.ttlSeconds]         Time to live in seconds for the archive
 * @param [body.resolution]         Resolution for the archive
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the created Vonage archive
 */
export async function postArchive(
    body: {
        name: string;
        scope: { userKey?: string } & GenericScope;
        sessionId: SessionID;
        permit?: Permit;
        ttlSeconds?: number;
        resolution?: string;
    },
    optionals: RoutingOptions = {},
): Promise<VonageArchive> {
    return await new Router()
        .post('/vonage/archive', { body, ...optionals })
        .then(({ body }) => body);
}


/**
 * Retrieves Vonage API key information
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vonage/info`
 *
 * @example
 * import { vonageAPI } from 'epicenter-libs';
 * const info = await vonageAPI.getInfo();
 * console.log(info.apiKey);
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an object containing the Vonage API key
 */
export async function getInfo(
    optionals: RoutingOptions = {},
): Promise<{ apiKey: APIKey }> {
    return await new Router()
        .get('/vonage/info', optionals)
        .then(({ body }) => body);
}


/**
 * Deletes a Vonage archive by its ID
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vonage/archive/{ARCHIVE_ID}`
 *
 * @example
 * import { vonageAPI } from 'epicenter-libs';
 * await vonageAPI.deleteArchiveByID('archive-123');
 *
 * @param archiveID     The ID of the archive to delete
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the deleted Vonage archive
 */
export async function deleteArchiveByID(
    archiveID: string,
    optionals: RoutingOptions = {},
): Promise<VonageArchive> {
    return await new Router()
        .delete(`/vonage/archive/${archiveID}`, optionals)
        .then(({ body }) => body);
}

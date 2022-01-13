import type { RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';
import type { APIKey, SessionID, Token, ArchiveID, ArchiveStatus } from '../apis/vonage';

import { ROLE } from '../utils/constants';
import * as vonageAPI from '../apis/vonage';


/**
 * Gets the Vonage project ID (not to be confused with the Epicenter project). Used to initialize the session object on the client side
 * @example
  * import OT from '@opentok/client';
 * import { vonageAdapter } from 'epicenter-libs';
 *
 * const [sessionID, projectID] = await Promise.all([
 *      vonageAdapter.createSession(),
 *      vonageAdapter.getProjectID()
 * ]);
 *
 * const vonageSession = OT.initSession(projectID, sessionID);
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the Vonage project ID (otherwise known as the Vonage API key)
 */
export async function getProjectID(
    optionals: RoutingOptions = {}
): Promise<APIKey> {
    return vonageAPI.getAPIKey(optionals);
}

/**
 * Calls the server SDK call for creating a session. Used to create a session object on the client side.
 * @example
 * import OT from '@opentok/client';
 * import { vonageAdapter } from 'epicenter-libs';
 *
 * const [sessionID, projectID] = await Promise.all([
 *      vonageAdapter.createSession(),
 *      vonageAdapter.getProjectID()
 * ]);
 *
 * const vonageSession = OT.initSession(projectID, sessionID);
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a Vonage session ID
 */
export async function createSession(
    optionals: RoutingOptions = {}
): Promise<SessionID> {
    return vonageAPI.getSession(optionals);
}

/**
 * Creates a Vonage session token, used to connect a session.
 * @example
 * import { vonageAdapter } from 'epicenter-libs';
 * const token = await vonageAdapter.generateToken('2_MX40NzQ...Y1TnZ-fg');
 * vonageSession.connect(token);
 * @param sessionID     ID of the session you're expecting to connect to using the token
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a Vonage session token
 */
export async function generateToken(
    sessionID: SessionID,
    optionals: RoutingOptions = {}
): Promise<Token> {
    return vonageAPI.postToken({ sessionId: sessionID }, optionals);
}

/**
 * Starts a Vonage archive -- a user recording of a Vonage session
 * @example
 * import { vonageAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const session = authAdapter.getLocalSession();
 * vonageAdapter.startArchive('my-archive', '2_MX40NzQ...Y1TnZ-fg', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: session.groupKey,
 * })
 * @param name                      Name of the archive; for your own purposes
 * @param sessionID                 ID of the session you're creating an archive for
 * @param scope                     Scope attached to the archive
 * @param scope.scopeBoundary       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey            Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]           User key, to attach a user to the scope
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]      Read permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.writeLock]     Write permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.ttlSeconds]    Life span of the archive (how long before it is deleted); defaults to 604,800 (1 week), max of 31,536,000 (1 year)
 * @returns promise that resolves to the ID of the archive created
 */
export async function startArchive(
    name: string,
    sessionID: SessionID,
    scope: { userKey?: string } & GenericScope,
    optionals: {
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: number,
    } & RoutingOptions = {}
): Promise<ArchiveID> {
    const { readLock, writeLock, ttlSeconds, ...routingOptions } = optionals;
    const { PARTICIPANT, USER } = ROLE;
    const defaultLock = scope.userKey ? USER : PARTICIPANT;

    return vonageAPI.postArchive({
        name,
        sessionId: sessionID,
        scope,
        permit: {
            readLock: readLock ?? defaultLock,
            writeLock: writeLock ?? defaultLock,
        },
        ttlSeconds,
    }, routingOptions);
}

/**
 * Stops a Vonage archive -- begins the serialization process for a recording
 * @example
 * import { vonageAdapter } from 'epicenter-libs';
 * vonageAdapter.stopArchive('004355...ede770e39');
 * @param archiveID ID of the archive to stop
 * @param optionals Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a string indicating the archive status (expected to be 'stopped')
 */
export async function stopArchive(
    archiveID: ArchiveID,
    optionals: RoutingOptions = {}
): Promise<ArchiveStatus> {
    return vonageAPI.deleteArchiveByID(archiveID, optionals);
}
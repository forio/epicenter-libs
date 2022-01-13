import type { GenericScope, Permit } from '../utils/constants';
import type { RoutingOptions } from '../utils/router';

import Router from '../utils/router';


export type SessionID = string;
export type ArchiveID = string;
export type APIKey = string;
export type Token = string;
export type ArchiveStatus = 'available' | 'deleted' | 'failed' | 'paused' | 'started' | 'stopped' | 'uploaded' | 'expired';

export async function getSession(
    optionals: RoutingOptions = {},
): Promise<SessionID> {
    return await new Router()
        .get('/vonage/session', optionals)
        .then(({ body }) => body);
}

export async function postToken(
    body: { sessionId: string },
    optionals: RoutingOptions = {},
): Promise<Token> {
    return await new Router()
        .post('/vonage/token', { body, ...optionals })
        .then(({ body }) => body);
}

export async function postArchive(
    body: {
        name: string,
        scope: { userKey?: string } & GenericScope,
        sessionId: SessionID,
        permit?: Permit,
        ttlSeconds?: number,
    },
    optionals: RoutingOptions = {},
): Promise<ArchiveID> {
    return await new Router()
        .post('/vonage/archive', { body, ...optionals })
        .then(({ body }) => body);
}

export async function getAPIKey(
    optionals: RoutingOptions = {}
): Promise<APIKey> {
    return await new Router()
        .get('/vonage/apiKey', optionals)
        .then(({ body }) => body);
}

export async function deleteArchiveByID(
    archiveID: string,
    optionals: RoutingOptions = {}
): Promise<ArchiveStatus> {
    return await new Router()
        .delete(`/vonage/archive/${archiveID}`, optionals)
        .then(({ body }) => body);
}

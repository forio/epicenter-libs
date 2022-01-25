import type { GenericScope, Permit } from '../utils/constants';
import type { RoutingOptions } from '../utils/router';

import Router from '../utils/router';


export type SessionID = string;
export type ArchiveID = string;
export type APIKey = string;
export type Token = string;
export type VonageSession = {
    sessionId: SessionID,
};
export type VonageArchive = {
    archiveId: string,
    status: 'available' | 'deleted' | 'failed' | 'paused' | 'started' | 'stopped' | 'uploaded' | 'expired',
}

export async function getSession(
    optionals: RoutingOptions = {},
): Promise<{ sessionId: SessionID }> {
    return await new Router()
        .get('/vonage/session', optionals)
        .then(({ body }) => body);
}

export async function postToken(
    body: { sessionId: string },
    optionals: RoutingOptions = {},
): Promise<{ token: Token }> {
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
        resolution?: string,
    },
    optionals: RoutingOptions = {},
): Promise<VonageArchive> {
    return await new Router()
        .post('/vonage/archive', { body, ...optionals })
        .then(({ body }) => body);
}

export async function getInfo(
    optionals: RoutingOptions = {}
): Promise<{ apiKey: APIKey }> {
    return await new Router()
        .get('/vonage/info', optionals)
        .then(({ body }) => body);
}

export async function deleteArchiveByID(
    archiveID: string,
    optionals: RoutingOptions = {}
): Promise<VonageArchive> {
    return await new Router()
        .delete(`/vonage/archive/${archiveID}`, optionals)
        .then(({ body }) => body);
}

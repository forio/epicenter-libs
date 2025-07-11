import type { RoutingOptions } from '../utils/router';
import type { User } from './user';

import Router from '../utils/router';
import cometdAdapter from './cometd';


interface Presence {
    lastUpdated: number,
    ttlSeconds: number,
    groupRole: 'FACILITATOR' | 'REVIEWER' | 'LEADER' | 'PARTICIPANT',
    user: User,
}


/**
 * Makes a connection request to the cometd server; effectively marking the user as online. This isn't required to be called in order to be considered online. Subscribe to a CometD channel will do the same as well. This is just a convenience method for when you don't need to utilize the channels expect specifically for presence.
 * Using [logout](#authAdapter-logout) will automatically disconnect for you.
 * @example
 * epicenter.presenceAdapter.connect()
 * @returns promise indicating whether or not the connection was successful
 */
export async function connect(): Promise<void> {
    await cometdAdapter.handshake();
    return;
}


/**
 * Retrieves the presence information for a particular group
 * @example
 * epicenter.presenceAdapter.forGroup('0000017dd3bf540e5ada5b1e058f08f20461');
 * @param groupKey      Key associated with group
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a list of users online
 */
export async function forGroup(
    groupKey: string,
    optionals: RoutingOptions = {}
): Promise<Presence[]> {
    return await new Router()
        .get(`/presence/group/${groupKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Retrieves the presence information for a particular world
 * @example
 * epicenter.presenceAdapter.forWorld('0000017a445032dc38cb2cecd5fc13708314')
 * @param worldKey      Key associated with world
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a list of users online
 */
export async function forWorld(
    worldKey: string,
    optionals: RoutingOptions = {},
): Promise<Presence[]> {
    return await new Router()
        .get(`/presence/world/${worldKey}`, optionals)
        .then(({ body }) => body);
}


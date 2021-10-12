import { Router } from 'utils/index';
import cometdAdapter from './cometd';


/**
 * Presence API adapters -- use this to track online/offline users
 * @namespace presenceAdapter
 */

interface Presence {
    lastUpdated: number,
    ttlSeconds: number,
    groupRole: 'FACILITATOR' | 'REVIEWER' | 'LEADER' | 'PARTICIPANT',
    user: User,
}


/**
 * Makes a connection request to the cometd server; effectively marking the user as online; using [logout](#authAdapter-logout) will automatically disconnect for you.
 *
 * @memberof presenceAdapter
 * @example
 *
 * epicenter.presenceAdapter.forWorld(world.worldKey)
 *
 * @returns {Promise}   Promise indicating whether or not the connection was successful
 */
export async function connect(): Promise<void> {
    await cometdAdapter.handshake();
    return;
}


/**
 * Retrieves the presence information for a particular group
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/presence/group/{GROUP_KEY}`
 *
 * @memberof presenceAdapter
 * @example
 *
 * epicenter.presenceAdapter.forGroup(group.groupKey)
 *
 * @param {string}  groupKey                        Key associated with group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                List of users online
 */
export async function forGroup(
    groupKey: string,
    optionals: GenericAdapterOptions = {}
): Promise<Presence[]> {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/presence/group/${groupKey}`)
        .then(({ body }) => body);
}


/**
 * Retrieves the presence information for a particular world
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/presence/world/{WORLD_KEY}`
 *
 * @memberof presenceAdapter
 * @example
 *
 * epicenter.presenceAdapter.forWorld(world.worldKey)
 *
 * @param {string}  worldKey                        Key associated with world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                List of users online
 */
export async function forWorld(
    worldKey: string,
    optionals: GenericAdapterOptions = {},
): Promise<Presence[]> {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/presence/world/${worldKey}`)
        .then(({ body }) => body);
}


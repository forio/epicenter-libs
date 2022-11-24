import type { RoutingOptions } from '../utils/router';

import {
    Router,
} from 'utils';

interface Consensus {
    instantiated: boolean,
    triggered: boolean,
    closed: boolean,
    transparent: boolean,
    worldKey: string,
    name: string,
    stage: string,
    ttlSeconds: number,
    secondsLeft: number,
    expectedRoles: Record<string, unknown>,
    impendingRoles: Record<string, unknown>,
    arrivedRoles: Record<string, unknown>,
}

/**
 * Creates a new consensus point
 * @example
 * import { consensusAdapter } from 'epicenter-libs';
 * consensusAdapter.create(
 *      00000173078afb05b4ae4c726637167a1a9e,
 *      'SUBMISSIONS',
 *      'ROUND1', 
 *      {
 *          ROLE1: 1,
 *          ROLE2: 1,
 *          ROLE3: 2,
 *      }
 * );
 * @param worldKey                      World key for the world you are making a consensus point for
 * @param name                          Unique string to name a set of consensus points
 * @param stage                         Unique string to name one stage of the set of consensus points
 * @param expectedRoles                 Map where the keys are the names of each role participating and the number of users expected to submit consensus actions for each role
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.defaultActions]    Actions to take if the role specified in the key does not submit
 * @param [optionals.ttlSeconds]        How long the consensus point lasts for.
 * @returns promise that resolves to the newly created consensus point
 */
export async function create(
    worldKey: string,
    name: string,
    stage: string,
    expectedRoles: Record<string, unknown>,
    optionals: {
        defaultActions?: Record<string, unknown>,
        ttlSeconds?: number,
        transparent?: boolean,
    } & RoutingOptions = {}
): Promise<Consensus> {
    const {
        ttlSeconds,
        defaultActions,
        transparent = false,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/consensus/${worldKey}/${name}/${stage}`, {
            body: {
                actions: defaultActions,
                expectedRoles,
                ttlSeconds,
                transparent,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

//TODO:
export async function submitActions(
    worldKey: string,
    name: string,
    stage: string,
): Promise<unknown> {
    return await new Router()
        .post(`/consensus/actions/${worldKey}/${name}/${stage}`, {
            body: {

            },
        })
        .then(({ body }) => body);
}

// PATCH /api/v3/{accountShortName}/{projectShortName}/consensus/actions/{worldKey}/{name}/{stage}
//To edit the actions for this user's role

// POST /api/v3/{accountShortName}/{projectShortName}/consensus/actions/{worldKey}/{name}/{stage}
// Submitting actions , "publish"

// DELETE /api/v3/{accountShortName}/{projectShortName}/consensus/actions/{worldKey}/{name}/{stage}
// Deletes anyone who has made the call
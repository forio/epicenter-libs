import type { RoutingOptions } from '../utils/router';

import {
    Router,
    RITUAL,
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


//TODO: Is this still an optoin? executeActionsImmediately
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
 *      },
 *      {
 *          ROLE1: [{ name: 'step', arguments: [] }],
 *          ROLE2: [{ name: 'step', arguments: [] }],
 *          ROLE3: [{ name: 'step', arguments: [] }],
 *      }
 * );
 * @param worldKey                      World key for the world you are making a consensus point for
 * @param name                          Unique string to name a set of consensus points
 * @param stage                         Unique string to name one stage of the set of consensus points
 * @param expectedRoles                 Map where the keys are the names of each role participating and the number of users expected to submit consensus actions for each role
 * @param defaultActions                Map defining which actions to take if the role specified in the key does not submit
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.ttlSeconds]        How long the consensus point lasts for.
 * @returns promise that resolves to the newly created consensus point
 */
export async function create(
    worldKey: string,
    name: string,
    stage: string,
    expectedRoles: Record<string, number>,
    defaultActions: Record<string, Record<string, number>[]>,
    optionals: {
        ttlSeconds?: number,
        transparent?: boolean,
    } & RoutingOptions = {}
): Promise<Consensus> {
    const {
        ttlSeconds,
        transparent = false,
        ...routingOptions
    } = optionals;
    
    return await new Router()
        .post(`/consensus/${worldKey}/${name}/${stage}`, {
            body: {
                expectedRoles,
                ttlSeconds,
                transparent,
                actions: defaultActions,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Submits actions for your turn and marks you as having `submitted`. If `executeActionsImmediately` was set to `true` while creating the consensus point, the actions will be immediately sent to the model.
 * Note that you can still call operations from the RunService directly, but will bypass the consensus requirements.
 *
 * @example
 * import { consensusAdapter } from 'epicenter-libs';
 * consensusAdapter.submitActions(
 *      00000173078afb05b4ae4c726637167a1a9e,
 *      'SUBMISSIONS',
 *      'ROUND1', 
 *      [{ name: 'step', arguments: [] }]);
 *  
 * @param worldKey                      World key for the world you are making a consensus point for
 * @param name                          Unique string to name a set of consensus points
 * @param stage                         Unique string to name one stage of the set of consensus points
 * @param actions                       List of objects describing the actions to send
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @returns {Promise}
 */
export async function submitActions(
    worldKey: string,
    name: string,
    stage: string,
    actions: {
        name: string,
        arguments: string|number|Record<string, unknown>[],
    }[],
    optionals: {
        message?: string,
        ritual?: keyof typeof RITUAL,
    } & RoutingOptions = {}
): Promise<unknown> {
    const {
        ritual,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/consensus/publish/${worldKey}/${name}/${stage}`, { //consensus/publish/{worldKey}/{name}/{stage}
            body: {
                ritual,
                actions,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

// PATCH /api/v3/{accountShortName}/{projectShortName}/consensus/actions/{worldKey}/{name}/{stage}
//To edit the actions for this user's role

// DELETE /api/v3/{accountShortName}/{projectShortName}/consensus/actions/{worldKey}/{name}/{stage}
// Deletes anyone who has made the call
import type { RoutingOptions } from '../utils/router';

import {
    Router,
    RITUAL,
} from 'utils';

export interface Consensus {
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
    allowChannel: boolean,
}

/**
 * Creates a new consensus barrier
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
 * @param worldKey                      World key for the world you are making a consensus barrier for
 * @param name                          Unique string to name a set of consensus barriers
 * @param stage                         Unique string to name one stage of the set of consensus barriers
 * @param expectedRoles                 Map where the keys are the names of each role participating and the number of users expected to submit consensus actions for each role
 * @param defaultActions                Map defining which actions to take if the role specified in the key does not submit
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.ttlSeconds]        How long the consensus barrier lasts for.
 * @param [optionals.transparent]       If the barrier has `transparent: false`, then only one of the default actions will be sent. If it has `transparent: true` then they are all sent.
 * @param [optionals.allowChannel]      Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @returns promise that resolves to the newly created consensus barrier
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
        allowChannel?: boolean,
    } & RoutingOptions = {},
): Promise<Consensus> {
    const {
        ttlSeconds,
        transparent = false,
        allowChannel,
        ...routingOptions
    } = optionals;

    return await new Router()
        .post(`/consensus/${worldKey}/${name}/${stage}`, {
            body: {
                expectedRoles,
                ttlSeconds,
                transparent,
                actions: defaultActions,
                allowChannel,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Load one specific consensus barrier by specifying stage
 *
 * @example
 * consensusAdapter.load(00000173078afb05b4ae4c726637167a1a9e, 'SUBMISSIONS', 'ROUND1');
 *
 * @param worldKey                      World key for the world you are loading a consensus barrier for
 * @param name                          Unique string that names a set of consensus barriers
 * @param stage                         Unique string to specify which specific barrier to load
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns promise that returns a 204 if successful
 */
export async function load(
    worldKey: string,
    name: string,
    stage: string,
    optionals: RoutingOptions = {},
): Promise<Consensus> {
    return await new Router()
        .get(`/consensus/${worldKey}/${name}/${stage}`, optionals)
        .then(({ body }) => body);
}

/**
 * List all consensus barriers sharing the same name
 *
 * @example
 * consensusAdapter.list(00000173078afb05b4ae4c726637167a1a9e, 'SUBMISSIONS');
 *
 * @param worldKey                      World key for the world you are loading consensus barriers for
 * @param name                          Unique string that specifies which set of consensus barriers to retrieve
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns promise that returns a 204 if successful
 */
export async function list(
    worldKey: string,
    name: string,
    optionals: RoutingOptions = {},
): Promise<Consensus> {
    return await new Router()
        .get(`/consensus/${worldKey}/${name}`, optionals)
        .then(({ body }) => body);
}

/**
 * Facilitator only. Marks current consensus barrier as complete. Closing the barrier will send default actions for anyone who has not arrived. If the barrier is opaque, then only one of the default actions will be sent, and if it's transparent then they are all sent
 *
 * @example
 * consensusAdapter.forceClose(00000173078afb05b4ae4c726637167a1a9e, 'SUBMISSIONS', 'ROUND1');
 *
 * @param worldKey                      World key for the world you are making a consensus barrier for
 * @param name                          Unique string that names a set of consensus barriers
 * @param stage                         Unique string that specifies which stage of the set of consensus barriers to close
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns promise that returns a 204 if successful
 */
export async function forceClose(
    worldKey: string,
    name: string,
    stage: string,
    optionals: {
        ritual?: keyof typeof RITUAL,
    } & RoutingOptions = {},
): Promise<unknown> {
    const {
        ritual,
        ...routingOptions
    } = optionals;

    return await new Router()
        .post(`/consensus/close/${worldKey}/${name}/${stage}`, {
            body: {
                ritual,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Updates the default actions defined in .create. A user can only update their own default actions, and this call will only work for a barrier that has `transparent: true`
 *
 * @example
 * import { consensusAdapter } from 'epicenter-libs';
 * consensusAdapter.updateDefaults(
 *      00000173078afb05b4ae4c726637167a1a9e,
 *      'SUBMISSIONS',
 *      'ROUND1',
 *      [{name: "message", value: "DEFAULT MESSAGE 2", objectType: "set"}]}
 *
 * @param worldKey                      World key for the world you are making a consensus barrier for
 * @param name                          Unique string to name a set of consensus barriers
 * @param stage                         Unique string to name one stage of the set of consensus barriers
 * @param actions                       List of objects describing the default actions to update for the current user
 * @returns promise that resolves to the newly created consensus barrier
*/
export async function updateDefaults(
    worldKey: string,
    name: string,
    stage: string,
    actions: Record<string, Record<string, number>[]>,
    optionals: RoutingOptions = {},
): Promise<Consensus> {
    const {
        ...routingOptions
    } = optionals;

    return await new Router()
        .patch(`/consensus/actions/${worldKey}/${name}/${stage}`, {
            body: {
                actions,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Submits actions for your turn and marks you as having `submitted`. If `executeActionsImmediately` was set to `true` while creating the consensus barrier, the actions will be immediately sent to the model.
 * Note that you can still call operations from the runAdapter directly, but will bypass the consensus requirements.
 *
 * @example
 * import { consensusAdapter } from 'epicenter-libs';
 * consensusAdapter.submitActions(
 *      00000173078afb05b4ae4c726637167a1a9e,
 *      'SUBMISSIONS',
 *      'ROUND1',
 *      [{ name: 'step', arguments: [] }]
 *      { message: 'Student side submission!' },
 * );
 *
 * @param worldKey                      World key for the world you are making a consensus barrier for
 * @param name                          Unique string to name a set of consensus barriers
 * @param stage                         Unique string to name one stage of the set of consensus barriers
 * @param actions                       List of objects describing the actions to send
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.message]           Message that is stored in the barrier arrival entity; opportunity to note a description regarding this submission
 * @returns {Promise}                   Note: the response consensus object will have `triggered: true` for the final user that submits and triggers the barrier. triggered is a virtual field, not stored in the database as part of the barrier entity, so it only appears in the response for the final user submitting
 */
export async function submitActions(
    worldKey: string,
    name: string,
    stage: string,
    actions: {
        name: string,
        arguments: string | number | Record<string, unknown>[],
    }[],
    optionals: {
        message?: string,
        ritual?: keyof typeof RITUAL,
    } & RoutingOptions = {},
): Promise<unknown> {
    const {
        message,
        ritual,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/consensus/publish/${worldKey}/${name}/${stage}`, {
            body: {
                ritual,
                actions,
                message,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Deletes the targeted barrier, which allows users to create a new barrier with the same name and stage
 *
 * @example
 * import { consensusAdapter } from 'epicenter-libs';
 * consensusAdapter.deleteBarrier(
 *      00000173078afb05b4ae4c726637167a1a9e,
 *      'SUBMISSIONS',
 *      'ROUND1',
 * );
 *
 * @param worldKey                      World key for the world you are targeting
 * @param name                          Unique string that names a set of consensus barriers
 * @param stage                         Unique string to specify which specific barrier to undo your submission for
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns {Promise}
 */
export async function deleteBarrier(
    worldKey: string,
    name: string,
    stage: string,
    optionals: RoutingOptions = {},
): Promise<Consensus> {
    const {
        ...routingOptions
    } = optionals;

    return await new Router()
        .delete(`/consensus/${worldKey}/${name}/${stage}`, {
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Deletes all barriers under the same name, which allows users to create new barriers with the same name and stage
 *
 * @example
 * import { consensusAdapter } from 'epicenter-libs';
 * consensusAdapter.deleteAll(
 *      00000173078afb05b4ae4c726637167a1a9e,
 *      'SUBMISSIONS',
 * );
 *
 * @param worldKey                      World key for the world you are targeting
 * @param name                          Unique string that names a set of consensus barriers
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns {Promise}
 */
export async function deleteAll(
    worldKey: string,
    name: string,
    optionals: RoutingOptions = {},
): Promise<Consensus> {
    const {
        ...routingOptions
    } = optionals;

    return await new Router()
        .delete(`/consensus/${worldKey}/${name}`, {
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Removes the currently logged in user from the list of users that have arrived at this barrier, thus allowing the user to redo their submission.
 *
 * @example
 * import { consensusAdapter } from 'epicenter-libs';
 * consensusAdapter.undoSubmit(
 *      00000173078afb05b4ae4c726637167a1a9e,
 *      'SUBMISSIONS',
 *      'ROUND1',
 * );
 *
 * @param worldKey                      World key for the world you are targeting
 * @param name                          Unique string that names a set of consensus barriers
 * @param stage                         Unique string to specify which specific barrier to undo your submission for
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns {Promise}
 */
export async function undoSubmit(
    worldKey: string,
    name: string,
    stage: string,
    optionals: RoutingOptions = {},
): Promise<Consensus> {
    const {
        ...routingOptions
    } = optionals;

    return await new Router()
        .delete(`/consensus/arrival/${worldKey}/${name}/${stage}`, {
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Facilitator only; artificial triggering of the arrival of a participant to the barrier. Useful for testing or for missing participants
 *
 *
 * @example
 * import { consensusAdapter } from 'epicenter-libs';
 * consensusAdapter.triggerFor(
 *      00000173078afb05b4ae4c726637167a1a9e,
 *      'SUBMISSIONS',
 *      'ROUND1',
 *       userKey: 0000017cb60ad697e109dcb11cdd4cfcdd1d,
 *      { message: "Facilitator Triggered this submission!" },
 *
 * @param worldKey                      World key for the world you are targeting
 * @param name                          Unique string that names this set of consensus barriers
 * @param stage                         Unique string that names the stage of targeted barrier
 * @param userKey                       userKey of the user the facilitator is triggering for
 * @param actions                       List of objects describing the default actions to update for the current user
 * @param [optionals.message]           message
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns {Promise}                   ???
 */
export async function triggerFor(
    worldKey: string,
    name: string,
    stage: string,
    userKey: string,
    actions: {
        name: string,
        arguments: string | number | Record<string, unknown>[],
    }[],
    optionals: {
        message?: string,
        ritual?: keyof typeof RITUAL,
    } & RoutingOptions = {},
): Promise<unknown> {
    const {
        ritual,
        message,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/consensus/trigger/${worldKey}/${name}/${stage}`, {

            body: {
                ritual,
                userKey,
                message,
                actions,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Removes the specified user from the list of users that have arrived at this barrier, thus allowing the user to redo their submission.
 *
 * @example
 * import { consensusAdapter } from 'epicenter-libs';
 * consensusAdapter.undoSubmit(
 *      00000173078afb05b4ae4c726637167a1a9e,
 *      'SUBMISSIONS',
 *      'ROUND1',
 * );
 *
 * @param worldKey                      World key for the world you are targeting
 * @param name                          Unique string that names a set of consensus barriers
 * @param stage                         Unique string to specify which specific barrier to undo your submission for
 * @param userKey                       userKey of the user the facilitator is undoing the submit for
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns {Promise}
 */
export async function undoSubmitFor(
    worldKey: string,
    name: string,
    stage: string,
    userKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    const {
        ...routingOptions
    } = optionals;

    return await new Router()
        .delete(`/consensus/expectation/${worldKey}/${name}/${stage}/${userKey}`, {
            ...routingOptions,
        })
        .then(({ body }) => body);
}
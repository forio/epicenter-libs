import type { UserSession } from '../utils/identification';
import type { RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';
import type { PseudonymReadOutView } from './user';

import { Router, identification, SCOPE_BOUNDARY } from '../utils';

// Generic type parameter for world role names
export type WorldRole = string;

export const OBJECTIVE = {
    MINIMUM: 'MINIMUM',
    MAXIMUM: 'MAXIMUM',
    MARGINAL: 'MARGINAL',
    OPTIMAL: 'OPTIMAL',
} as const;

export type Objective = (typeof OBJECTIVE)[keyof typeof OBJECTIVE];

export type OrbitType = 'GROUP' | 'EPISODE';

export const WORLD_NAME_GENERATOR_TYPE = {
    colorAnimal: 'colorAnimal',
    sequential: 'sequential',
} as const;

export type WorldNameGeneratorType = (typeof WORLD_NAME_GENERATOR_TYPE)[keyof typeof WORLD_NAME_GENERATOR_TYPE];

export interface ColorAnimalWorldNameGenerator {
    objectType: 'colorAnimal';
}

export interface SequentialWorldNameGenerator {
    objectType: 'sequential';
    prefix?: string;
}

export type WorldNameGenerator =
    | ColorAnimalWorldNameGenerator
    | SequentialWorldNameGenerator;

export interface AssignmentReadOutView<R extends WorldRole = WorldRole> {
    role: R;
    user: PseudonymReadOutView;
}

export interface PersonaReadOutView<R extends WorldRole = WorldRole> {
    role: R;
    minimum?: number;
    maximum?: number;
    marginal?: number;
    insertionOrder?: number;
}

export interface WorldReadOutView<R extends WorldRole = WorldRole> {
    lastUpdated: string;
    personae: PersonaReadOutView<R>[];
    assignments: AssignmentReadOutView<R>[];
    orbitKey: string;
    worldKey: string;
    created: string;
    orbitType: OrbitType;
    runKey: string;
    displayName: string;
    allowChannel: boolean;
    name: string;
    room: string;
}

export interface AssignmentCreateInView<R extends WorldRole = WorldRole> {
    role?: R;
    userKey: string;
}

export interface PersonaCreateInView<R extends WorldRole = WorldRole> {
    role: R;
    minimum?: number;
    maximum?: number;
    marginal?: number;
    insertionOrder?: number;
}

type WorldKey = string;
export type AssignmentMap<R extends WorldRole = WorldRole> = Record<WorldKey, AssignmentCreateInView<R>[]>;

/**
 * Updates fields for a particular world
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{WORLD_KEY}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.update('0000017a445032dc38cb2cecd5fc13708314', { runKey: '0000018d61f1217b22ce0ae605ff00609f5e', displayName: 'World A1' });
 *
 * @param worldKey              Key associated with world
 * @param update                Attributes you wish to update
 * @param [update.displayName]  Display name of the world
 * @param [update.runKey]       Key for the run you want to attach to the world
 * @param [update.allowChannel] Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the world with updated attributes
 */
export async function update<R extends WorldRole = WorldRole>(
    worldKey: string,
    update: {
        displayName?: string;
        runKey?: string;
        allowChannel?: boolean;
    },
    optionals: RoutingOptions = {},
): Promise<WorldReadOutView<R>> {
    const {
        displayName,
        runKey,
        allowChannel,
    } = update;

    return await new Router()
        .patch(`/world/${worldKey}`, {
            body: {
                displayName,
                runKey,
                allowChannel,
            },
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Deletes a world
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{WORLD_KEY}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.destroy('0000017a445032dc38cb2cecd5fc13708314');
 *
 * @param worldKey      Key associated with world
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to undefined when successful
 */
export async function destroy(
    worldKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .delete(`/world/${worldKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Creates a world
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{GROUP_NAME}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.create({ name: 'Whole New World' });
 *
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.name]          Name of the new world (if omitted one will be provided by Epicenter). Must be unique within the world's scope.
 * @param [optionals.displayName]   Display name of the new world
 * @param [optionals.groupName]     Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]   Name of the episode for episode scoping
 * @param [optionals.worldNameGenerator]    Specifies how world names are generated
 * @param [optionals.worldNameGenerator.objectType]     Can be either colorAnimal or sequential
 * @param [optionals.allowChannel]  Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @returns promise that resolves to the newly created world
 */
export async function create<R extends WorldRole = WorldRole>(
    optionals: {
        name?: string;
        displayName?: string;
        groupName?: string;
        episodeName?: string;
        worldNameGenerator?: WorldNameGenerator;
        allowChannel?: boolean;
    } & RoutingOptions = {},
): Promise<WorldReadOutView<R>> {
    const {
        name,
        displayName,
        groupName,
        episodeName,
        worldNameGenerator,
        allowChannel,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .post(`/world/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: {
                name,
                worldNameGenerator,
                displayName,
                allowChannel,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Fetches the worlds in a group or episode if specified
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{GROUP_NAME}`
 *
 * @example
 * // Gets all the worlds in the group attached to the session
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.get();
 * // Gets all the worlds in the group attached to the session that the user is assigned to
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.get({ mine: true });
 *
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName]     Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]   Name of the episode for episode scoped worlds
 * @param [optionals.mine]          Flag for indicating to get only the worlds the requesting user is in (based on session token)
 * @returns promise that resolves to a list of worlds
 */
export async function get<R extends WorldRole = WorldRole>(
    optionals: {
        groupName?: string;
        episodeName?: string;
        mine?: boolean;
    } & RoutingOptions = {},
): Promise<WorldReadOutView<R>[]> {
    const {
        groupName, episodeName, mine,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .withSearchParams({ mine })
        .get(`/world/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Fetches the assignments (plus some world info) in a group or episode if specified
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/for/{GROUP_NAME}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.getAssignments({ mine: true });
 *
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName]     Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]   Name of the episode for episode scoped worlds
 * @param [optionals.mine]          Flag for indicating to get only the worlds the requesting user is in (based on session token)
 * @returns promise that resolves to a list of worlds the user is assigned to
 */
export async function getAssignments<R extends WorldRole = WorldRole>(
    optionals: {
        groupName?: string;
        episodeName?: string;
        mine?: boolean;
    } & RoutingOptions = {},
): Promise<WorldReadOutView<R>[]> {
    const {
        groupName, episodeName, mine,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .withSearchParams({ mine })
        .get(`/world/assignment/for/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Fetches all worlds assigned to the current session's user
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * const worlds = await worldAdapter.getSessionWorlds();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an array of worlds assigned to the current user
 */
export async function getSessionWorlds<R extends WorldRole = WorldRole>(
    optionals: RoutingOptions = {},
): Promise<WorldReadOutView<R>[]> {
    return await new Router()
        .get('/world/assignment', optionals)
        .then(({ body }) => body);
}


/**
 * Automatically assigns the current session's user a world
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment`
 *
 * @example
 * // Assigns user to a group-scoped world
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.selfAssign();
 * // Assigns user to a group-scoped world with role "cartographer"
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.selfAssign({ role: 'cartographer' });
 * // Assigns user to an episode-scoped world with role "cartographer"
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.selfAssign({ role: 'cartographer', episodeName: 'my-episode-name' });
 *
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.role]          Role constraint -- will put the user in a world with a role
 * @param [optionals.groupName]     Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]   Name of the episode for episode scoped worlds
 * @param [optionals.objective]     Allows platform to assign users beyond minimum amount
 * @param [optionals.worldNameGenerator]    Specifies how world names are generated
 * @param [optionals.worldNameGenerator.objectType]     Can be either colorAnimal or sequential
 * @param [optionals.populace]      List of role description objects (personas) to dictate the self assignment
 * @param [optionals.populace[].role]       Name of the role
 * @param [optionals.populace[].minimum]    The minimum number of users that required for this role
 * @param [optionals.populace[].maximum]    The maximum number of users that can be assigned to this role
 * @param [optionals.populace[].marginal]   The maximum number of users that can be assigned to this role when using objective MARGINAL
 * @param [optionals.allowChannel]  Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @returns promise that resolves to the world the user was assigned to
 */
export async function selfAssign<R extends WorldRole = WorldRole>(
    optionals: {
        role?: R;
        groupName?: string;
        episodeName?: string;
        objective?: keyof typeof OBJECTIVE;
        worldNameGenerator?: WorldNameGenerator;
        populace?: PersonaCreateInView<R>[];
        allowChannel?: boolean;
    } & RoutingOptions = {},
): Promise<WorldReadOutView<R>> {
    const {
        role,
        groupName,
        episodeName,
        objective = OBJECTIVE.MINIMUM,
        worldNameGenerator,
        populace,
        allowChannel,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .post(`/world/selfassign/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { role, objective, worldNameGenerator, populace, allowChannel },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * (Auto assign) -- makes worlds given a list of users.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * const worlds = await worldAdapter.assignUsers([
 *      { userKey: '000001796733eef0842f4d6d960997018a43', role: 'locksmith' },
 *      { userKey: '000001796733eef0842f4d6d960997018a3b' },
 * ]);
 *
 * @param assignments                       List of users assignment objects
 * @param assignments[].userKey             User key
 * @param [assignments[].role]              Role to assign to the user
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.role]                  Role constraint -- will put the user in a world with a role
 * @param [optionals.groupName]             Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]           Name of the episode for episode scoped worlds
 * @param [optionals.objective]             Allows platform to assign users beyond minimum amount
 * @param [optionals.requireAllAssignments] Have the server return w/ an error whenever an assignment was not made (instead of silently leaving the user as unassigned)
 * @param [optionals.keepEmptyWorlds]       Specify whether worlds that are now empty should be deleted
 * @param [optionals.worldNameGenerator]    Specifies how world names are generated
 * @param [optionals.worldNameGenerator.objectType]     Can be either colorAnimal or sequential
 * @param [optionals.populace]              List of role description objects (personas) to use while creating assignments
 * @param [optionals.populace[].role]       Name of the role
 * @param [optionals.populace[].minimum]    The minimum number of users that required for this role
 * @param [optionals.populace[].maximum]    The maximum number of users that can be assigned to this role
 * @param [optionals.populace[].marginal]   The maximum number of users that can be assigned to this role when using objective MARGINAL
 * @param [optionals.allowChannel]  Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @returns promise that resolves to the list of worlds created by the assignment
 */
export async function autoAssignUsers<R extends WorldRole = WorldRole>(
    assignments: AssignmentCreateInView<R>[],
    optionals: {
        groupName?: string;
        episodeName?: string;
        objective?: keyof typeof OBJECTIVE;
        worldNameGenerator?: WorldNameGenerator;
        requireAllAssignments?: boolean;
        keepEmptyWorlds?: boolean;
        populace?: PersonaCreateInView<R>[];
        allowChannel?: boolean;
    } & RoutingOptions = {},
): Promise<WorldReadOutView<R>[]> {
    const {
        groupName,
        episodeName,
        objective = OBJECTIVE.MINIMUM,
        requireAllAssignments,
        worldNameGenerator,
        keepEmptyWorlds,
        populace,
        allowChannel,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .post(`/world/assignment/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: {
                assignments,
                objective,
                requireAllAssignments,
                worldNameGenerator,
                keepEmptyWorlds,
                populace,
                allowChannel,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Edits assignments across specified worlds
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{GROUP_NAME}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * const updatedWorlds = await worldAdapter.editAssignments({
 *      '0000017a445032dc38cb2cecd5fc13708314': [
 *          { userKey: '000001796733eef0842f4d6d960997018a43', role: 'locksmith' },
 *          { userKey: '000001796733eef0842f4d6d960997018a3b' },
 *      ],
 *      '0000017a445032dc38cb2cecd5fc13708315': [
 *          { userKey: '000001796733eef0842f4d6d960997018a4c', role: 'navigator' },
 *      ],
 * });
 *
 * @param assignments                       Map of world keys to list of user assignment objects
 * @param assignments[].userKey             User key
 * @param [assignments[].role]              Role to assign to the user
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName]             Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]           Name of the episode for episode scoped worlds
 * @param [optionals.objective]             Allows platform to assign users beyond minimum amount
 * @param [optionals.requireAllAssignments] Have the server return w/ an error whenever an assignment was not made (instead of silently leaving the user as unassigned)
 * @param [optionals.keepEmptyWorlds]       Specify whether worlds that are now empty should be deleted
 * @returns promise that resolves to the list of worlds updated by the assignment
 */
export async function editAssignments<R extends WorldRole = WorldRole>(
    assignments: AssignmentMap<R>,
    optionals: {
        groupName?: string;
        episodeName?: string;
        objective?: keyof typeof OBJECTIVE;
        keepEmptyWorlds?: boolean;
        requireAllAssignments?: boolean;
    } & RoutingOptions = {},
): Promise<WorldReadOutView<R>[]> {
    const {
        groupName, episodeName, objective = OBJECTIVE.MINIMUM, requireAllAssignments, keepEmptyWorlds,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .put(`/world/assignment/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { assignments, objective, requireAllAssignments, keepEmptyWorlds },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Retrieves the current assignment information for a given world
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{WORLD_KEY}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * const assignments = await worldAdapter.getAssignmentsByKey(world.worldKey);
 *
 * @param worldKey      Key associated with the world
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the world containing the assignment object
 */
export async function getAssignmentsByKey<R extends WorldRole = WorldRole>(
    worldKey: string,
    optionals: RoutingOptions = {},
): Promise<WorldReadOutView<R>> {
    return await new Router()
        .get(`/world/assignment/${worldKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Removes a user or list of users from all worlds in a given group or episode. Any worlds that do not contain users within them will be automatically deleted in the process.
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{GROUP_NAME}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * await worldAdapter.removeUser(user.userKey);
 *
 * @param userKeys                      List of keys associated with users to remove from worlds
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName]         Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]       Name of the episode for episode scoped worlds
 * @param [optionals.keepEmptyWorlds]   If the unassignment results in an empty world, whether to delete it
 * @returns promise that resolves to undefined when successful
 */
export async function removeUsers(
    userKeys: string[],
    optionals: {
        groupName?: string;
        episodeName?: string;
        keepEmptyWorlds?: boolean;
    } & RoutingOptions = {},
): Promise<void> {
    const {
        groupName, episodeName, keepEmptyWorlds,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .withSearchParams({ userKey: userKeys, keepEmptyWorlds: Boolean(keepEmptyWorlds) })
        .delete(`/world/assignment/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Gets the personas of a given scope (project, group, episode, world). Personas correspond to a role that a user in the world can be assigned to.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/persona/{SCOPE_BOUNDARY}/{SCOPE_KEY}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * await worldAdapter.getPersonas({ scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: GROUP_KEY });
 *
 * @param scope                 Scope associated with the persona set (by default the scope used will be the current project). Use this to do any specific overrides.
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an array of personas for the specified scope
 */
export async function getPersonas<R extends WorldRole = WorldRole>(
    scope: GenericScope,
    optionals: RoutingOptions = {},
): Promise<PersonaReadOutView<R>[]> {
    const { scopeBoundary, scopeKey } = scope;
    const boundary = scopeBoundary || SCOPE_BOUNDARY.PROJECT;
    /* We will at some point remove the need to explicitly lower case this */
    const boundaryComponent = boundary === SCOPE_BOUNDARY.WORLD ? '' : `/${boundary.toLowerCase()}`;
    const scopeKeyComponent = boundary === SCOPE_BOUNDARY.PROJECT ? '' : `/${scopeKey}`;
    const uriComponent = `${boundaryComponent}${scopeKeyComponent}`;

    return await new Router()
        .get(`/world/persona${uriComponent}`, {
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Sets the personas of a given scope (project, group, episode, world). Personas correspond to a role a user in the world can be assigned to.
 * A null value for minimum is 0, but a null maximum is uncapped. A null marginal defaults to maximum. Personas with greater specificity override more general ones (which are by default PROJECT scoped).
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/persona/{SCOPE_BOUNDARY}/{SCOPE_KEY}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * await worldAdapter.setPersonas([
 *      { role: 'leader',  minimum: 1 },
 * ]);
 *
 * @param personas              List of role description objects (personas)
 * @param personas[].role       Name of the role
 * @param [personas[].minimum]  The minimum number of users that required for this role
 * @param [personas[].maximum]  The maximum number of users that can be assigned to this role
 * @param [personas[].marginal] The maximum number of users that can be assigned to this role when using objective MARGINAL
 * @param scope                 Scope associated with the persona set (by default the scope used will be the current project). Use this to do any specific overrides.
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves with undefined when successful
 */
export async function setPersonas<R extends WorldRole = WorldRole>(
    personas: PersonaCreateInView<R>[],
    scope: GenericScope,
    optionals: RoutingOptions = {},
): Promise<void> {
    const { scopeBoundary, scopeKey } = scope;
    const boundary = scopeBoundary || SCOPE_BOUNDARY.PROJECT;
    /* We will at some point remove the need to explicitly lower case this */
    const boundaryComponent = boundary === SCOPE_BOUNDARY.WORLD ? '' : `/${boundary.toLowerCase()}`;
    const scopeKeyComponent = boundary === SCOPE_BOUNDARY.PROJECT ? '' : `/${scopeKey}`;
    const uriComponent = `${boundaryComponent}${scopeKeyComponent}`;

    return await new Router()
        .put(`/world/persona${uriComponent}`, {
            body: personas,
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Assigns an existing run to the given world.
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/run/{WORLD_KEY}`
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * await worldAdapter.assignRun(world.worldKey, { runKey: run.runKey });
 *
 * @param worldKey      Key associated with the world
 * @param runKey        Key associated with the run
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the newly resolved world
 */
export async function assignRun<R extends WorldRole = WorldRole>(
    worldKey: string,
    runKey: string,
    optionals: RoutingOptions = {},
): Promise<WorldReadOutView<R>> {
    return await new Router()
        .patch(`/world/run/${worldKey}`, {
            body: { runKey },
            ...optionals,
        })
        .then(({ body }) => body);
}

import type { UserSession } from '../utils/identification';
import type { RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';
import type { User } from './user';

import {
    Router, identification,
    SCOPE_BOUNDARY,
} from '../utils';


enum OBJECTIVE {
    MINIMUM = 'MINIMUM',
    MAXIMUM = 'MAXIMUM',
}

enum ORBIT_TYPE {
    GROUP = 'GROUP',
    EPISODE = 'EPISODE',
}

enum WORLD_NAME_GENERATOR {
    colorAnimal = 'colorAnimal',
    sequential = 'sequential',
}

interface UserAssignment {
    userKey: string,
    role?: string,
}

interface Persona {
    role: string,
    minimum: number,
    maximum?: number,
}

interface Assignment {
    role: string,
    user: User,
}

interface World {
    lastUpdated: string,
    personae: Persona[],
    assignments: Assignment[],
    orbitKey: string,
    worldKey: string,
    created: string,
    orbitType: keyof typeof ORBIT_TYPE,
    runKey: string,
}

/**
 * Updates fields for a particular world.
 * @example
 * epicenter.worldAdapter.update('0000017a445032dc38cb2cecd5fc13708314', { runKey: '0000018d61f1217b22ce0ae605ff00609f5e', displayName: 'World A1' });
 * @param worldKey              Key associated with world
 * @param update                Attributes you wish to update
 * @param [update.displayName]  Display name of the world
 * @param [update.runKey]       Key for the run you want to attach to the world
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise wiworld with updated attributes
 */
export async function update(
    worldKey: string,
    update: { displayName?: string, runKey?: string },
    optionals: RoutingOptions = {}
): Promise<World> {
    const { displayName, runKey } = update;

    return await new Router()
        .patch(`/world/${worldKey}`, {
            body: { displayName, runKey },
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Deletes a world
 * @example
 * epicenter.worldAdapter.destroy('0000017a445032dc38cb2cecd5fc13708314');
 * @param worldKey      Key associated with world
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns
 */
export async function destroy(
    worldKey: string,
    optionals: RoutingOptions = {}
): Promise<void> {

    return await new Router()
        .delete(`/world/${worldKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Creates a world
 * @example
 * epicenter.worldAdapter.create({ name: 'Whole New World' });
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.name]          Name of the new world -- if omitted one will be provided by Epicenter. Must be unique within the world's scope.
 * @param [optionals.displayName]   Display name of the new world
 * @param [optionals.groupName]     Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]   Name of the episode for episode scoping
 * @param [optionals.worldNameGenerator]    Specifies how world names are generated
 * @param [optionals.worldNameGenerator.objectType]     Can be either colorAnimal or sequential
 * @returns promise that resolves to the newly created world
 */
export async function create(
    optionals: {
        name?: string,
        displayName?: string,
        groupName?: string,
        episodeName?: string,
        worldNameGenerator?: {objectType: keyof typeof WORLD_NAME_GENERATOR},
    } & RoutingOptions = {}
): Promise<World> {
    const {
        name, displayName, groupName, episodeName, worldNameGenerator,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .post(`/world/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { name, worldNameGenerator, displayName },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Fetches the worlds in a group or episode if specified
 * @example
 * // Gets all the worlds in the group attached to the session
 * epicenter.worldAdapter.get();
 * // Gets all the worlds in the group attached to the session that the user is assigned to
 * epicenter.worldAdapter.get({ mine: true });
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName]     Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]   Name of the episode for episode scoped worlds
 * @param [optionals.mine]          Flag for indicating to get only the worlds the requesting user is in (based on session token)
 * @returns promise that resolves to a list of worlds
 */
export async function get(
    optionals: {
        groupName?: string,
        episodeName?: string,
        mine?: boolean,
    } & RoutingOptions = {}
): Promise<World> {
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
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * worldAdapter.getAssignments({ mine: true });
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName]     Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]   Name of the episode for episode scoped worlds
 * @param [optionals.mine]          Flag for indicating to get only the worlds the requesting user is in (based on session token)
 * @returns promise that resolves to a list of worlds the user is assigned to
 *
 */
export async function getAssignments(
    optionals: {
        groupName?: string,
        episodeName?: string,
        mine?: boolean,
    } & RoutingOptions = {}
): Promise<World[]> {
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

export async function getSessionWorlds(
    optionals: RoutingOptions = {}
): Promise<World> {
    return await new Router()
        .get('/world/assignment', optionals)
        .then(({ body }) => body);
}

/**
 * Automatically assigns the current session's user a world
 * @example
 * // Assigns user to a group-scoped world
 * epicenter.worldAdapter.selfAssign();
 * // Assigns user to a group-scoped world with role "cartographer"
 * epicenter.worldAdapter.selfAssign({ role: 'cartographer' });
 * // Assigns user to an episode-scoped world with role "cartographer"
 * epicenter.worldAdapter.selfAssign({ role: 'cartographer', episodeName: 'my-episode-name' });
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.role]          Role constaint -- will put the user in a world with a role
 * @param [optionals.groupName]     Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]   Name of the episode for episode scoped worlds
 * @param [optionals.objective]     Allows platform to assign users beyond minimum amount
 * @param [optionals.worldNameGenerator]    Specifies how world names are generated
 * @param [optionals.worldNameGenerator.objectType]     Can be either colorAnimal or sequential
 * @returns promise that resolves to the world the user was assigned to
 */
export async function selfAssign(
    optionals: {
        role?: string,
        groupName?: string,
        episodeName?: string,
        objective?: keyof typeof OBJECTIVE,
        worldNameGenerator?: {objectType: keyof typeof WORLD_NAME_GENERATOR},
    } & RoutingOptions = {}
): Promise<World> {
    const {
        role, groupName, episodeName, objective = OBJECTIVE.MINIMUM, worldNameGenerator,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .post(`/world/selfassign/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { role, objective, worldNameGenerator },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * (Auto assign) -- makes worlds given a list of users.
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
 * @param [optionals.role]                  Role constaint -- will put the user in a world with a role
 * @param [optionals.groupName]             Name of the group (defaults to name of group associated with session)
 * @param [optionals.episodeName]           Name of the episode for episode scoped worlds
 * @param [optionals.objective]             Allows platform to assign users beyond minimum amount
 * @param [optionals.requireAllAssignments] Have the server return w/ an error whenever an assignment was not made (instead of silently leaving the user as unassigned)
 * @param [optionals.keepEmptyWorlds]       Specify whether worlds that are now empty should be deleted
 * @param [optionals.worldNameGenerator]    Specifies how world names are generated
 * @param [optionals.worldNameGenerator.objectType]     Can be either colorAnimal or sequential
 * @returns promise that resolves to the list of worlds created by the assignment
 */
export async function autoAssignUsers(
    assignments: UserAssignment[],
    optionals: {
        groupName?: string,
        episodeName?: string,
        objective?: keyof typeof OBJECTIVE,
        worldNameGenerator?: {objectType: keyof typeof WORLD_NAME_GENERATOR},
        requireAllAssignments?: boolean,
        keepEmptyWorlds?: boolean,
    } & RoutingOptions = {}
): Promise<World[]> {
    const {
        groupName, episodeName, objective = OBJECTIVE.MINIMUM, requireAllAssignments, worldNameGenerator, keepEmptyWorlds,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .post(`/world/assignment/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { assignments, objective, requireAllAssignments, worldNameGenerator, keepEmptyWorlds },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

type WorldKey = string;
export async function editAssignments(
    assignments: Record<WorldKey, UserAssignment[]>,
    optionals: {
        groupName?: string,
        episodeName?: string,
        objective?: keyof typeof OBJECTIVE,
        keepEmptyWorlds?: boolean,
        requireAllAssignments?: boolean,
    } & RoutingOptions = {}
): Promise<World[]> {
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
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * const assignments = await worldAdapter.getAssignmentsByKey(world.worldKey);
 *
 * @param worldKey      Key associated with the world
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the world containing the assignment object
 */
export async function getAssignmentsByKey(
    worldKey: string,
    optionals: RoutingOptions = {}
): Promise<World> {

    return await new Router()
        .get(`/world/assignment/${worldKey}`, optionals)
        .then(({ body }) => body);
}

/**
 * Removes a user or list of users the all worlds in a given group or episode. Any worlds that do not contain users within them will be automatically deleted in the process.
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
        groupName?: string,
        episodeName?: string,
        keepEmptyWorlds?: boolean,
    } & RoutingOptions = {}
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
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * await worldAdapter.getPersonas({ scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: GROUP_KEY });
 * 
 * @param scope                 Scope associated with the persona set (by default the scope used will be the current project). Use this to do any specific overrides.
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves with undefined when successful
 */
export async function getPersonas(
    scope: GenericScope,
    optionals: RoutingOptions = {}
): Promise<void> {
    const { scopeBoundary, scopeKey } = scope;
    const boundary = scopeBoundary || SCOPE_BOUNDARY.PROJECT;
    const uriComponent = boundary === SCOPE_BOUNDARY.PROJECT ? '' : `/${scopeKey}`;

    return await new Router()
        /* We will at some point remove the need to explicitly lower case this */
        .get(`/world/persona/${boundary.toLowerCase()}${uriComponent}`, {
            ...optionals,
        })
        .then(({ body }) => body);
}
/**
 * Sets the personas of a given scope (project, group, episode, world). Personas correspond to a role the a user in the world can be assigned to.
 * A null value for minimum is 0, but a null maximum is uncapped. Personas with greater specificity override more general ones (which are by default PROJECT scoped).
 *
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * await worldAdapter.setPersonas([
 *      { role: 'leader',  minimum: 1 },
 * ]);
 * @param personas              List of role description objects (personas)
 * @param personas[].role       Name of the role
 * @param [personas[].minimum]  The minimum number of users that required for this role
 * @param [personas[].maximum]  The maximum number of users that can be assigned to this role
 * @param scope                 Scope associated with the persona set (by default the scope used will be the current project). Use this to do any specific overrides.
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves with undefined when successful
 */
export async function setPersonas(
    personas: { role: string, minimum?: number, maximum?: number }[],
    scope: GenericScope,
    optionals: RoutingOptions = {}
): Promise<void> {
    const { scopeBoundary, scopeKey } = scope;
    const boundary = scopeBoundary || SCOPE_BOUNDARY.PROJECT;
    const uriComponent = boundary === SCOPE_BOUNDARY.PROJECT ? '' : `/${scopeKey}`;

    return await new Router()
        /* We will at some point remove the need to explicitly lower case this */
        .put(`/world/persona/${boundary.toLowerCase()}${uriComponent}`, {
            body: personas,
            ...optionals,
        })
        .then(({ body }) => body);
}

/**
 * Assigns an existing run to the given world.
 * @example
 * import { worldAdapter } from 'epicenter-libs';
 * await worldAdapter.assignRun(world.worldKey, { runKey: run.runKey });
 * @param worldKey      Key associated with the world
 * @param runKey        Key associated with the run
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the newly resolved world
 */
export async function assignRun(
    worldKey: string,
    runKey: string,
    optionals: RoutingOptions = {}
): Promise<World> {

    return await new Router()
        .patch(`/world/run/${worldKey}`, {
            body: { runKey },
            ...optionals,
        })
        .then(({ body }) => body);
}
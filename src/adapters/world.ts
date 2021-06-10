import { Router, identification } from 'utils/index';
import { SCOPE_BOUNDARY } from 'utils/constants';

enum OBJECTIVE {
    MINIMUM = 'MINIMUM',
    MAXIMUM = 'MAXIMUM',
}

enum ORBIT_TYPE {
    GROUP = 'GROUP',
    EPISODE = 'EPISODE',
}

interface WorldOptions extends GenericAdapterOptions {
    name?: string,
    groupName?: string,
    episodeName?: string,
    keepEmptyWorlds?: boolean,
}

interface AssignmentOptions extends WorldOptions {
    objective?: keyof typeof OBJECTIVE,
    requireAllAssignments?: boolean,
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
    user: {
        lastUpdated: string,
        displayName: string,
        created: string,
        detail: any,
        userId: number,
        userKey: string,
    },
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
 * World API adapters -- handles worlds and user role/assignments
 * @namespace worldAdapter
 */


/**
 * Updates fields for a particular world.
 *
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{WORLD_KEY}`
 *
 * @memberof worldAdapter
 * @example
 *
 * epicenter.worldAdapter.update(world.worldKey, { name: 'World A1' });
 *
 * @param {string}  worldKey                        Key associated with world
 * @param {object}  update                          Attributes you wish to update
 * @param {string}  [update.name]                   Name of the world
 * @param {string}  [update.runKey]                 Key of the run associated with the world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                world with updated attributes
 */
export async function update(
    worldKey: string,
    update: { name?: string, runKey?: string },
    optionals: GenericAdapterOptions = {}
): Promise<World> {
    const { name, runKey } = update;
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/world/${worldKey}`, {
            body: { name, runKey },
        })
        .then(({ body }) => body);
}


/**
 * Deletes a world
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{WORLD_KEY}`
 *
 * @memberof worldAdapter
 * @example
 *
 * epicenter.worldAdapter.destroy(world.worldKey);
 *
 * @param {string}  worldKey                        Key associated with world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */
export async function destroy(
    worldKey: string,
    optionals: GenericAdapterOptions = {}
): Promise<void> {
    const { accountShortName, projectShortName } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/world/${worldKey}`)
        .then(({ body }) => body);
}


/**
 * Creates a world
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{GROUP_NAME}[/{EPISODE_NAME}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * worldAdapter.create({ name: 'Whole New World' });
 *
 * @param {object}  world                           New world object
 * @param {string}  world.name                      Name of the world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.groupName]           Name of the group (defaults to name of group associated with session)
 * @param {string}  [optionals.episodeName]         Name of the episode
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */
export async function create(
    optionals: WorldOptions = {}
): Promise<World> {
    const {
        name, groupName, episodeName,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/world/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { name },
        }).then(({ body }) => body);
}


/**
 * Fetches the worlds in a group or episode if specified
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/{GROUP_NAME}[/{EPISODE_NAME}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const worlds = await worldAdapter.get();
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.groupName]           Name of the group (defaults to name of group associated with session)
 * @param {string}  [optionals.episodeName]         Name of the episode
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                              List of worlds
 */
export async function get(optionals: WorldOptions = {}): Promise<World> {
    const {
        groupName, episodeName,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/world/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`)
        .then(({ body }) => body);
}


// Fetches the assignments (plus some world info) in a group or episode if specified
export async function getAssignments(optionals: WorldOptions = {}): Promise<World> {
    const {
        groupName, episodeName,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/world/assignment/for/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`)
        .then(({ body }) => body);
}

/**
 * Automatically assigns the current session's user to a world
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/selfassign/{GROUP_NAME}[/{EPISODE_NAME}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const myWorld = await worldAdapter.selfAssign('cartographer');
 *
 * @param {string}  role                            Role to assign for, can be undefined
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.groupName]           Name of the group (defaults to name of group associated with session)
 * @param {string}  [optionals.episodeName]         Name of the episode
 * @param {boolean} [optionals.objective]           Allows platform to assign users beyond minimum amount
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                World users were assigned to
 */
export async function selfAssign(
    role: string,
    optionals: AssignmentOptions = {}
): Promise<World> {
    const {
        groupName, episodeName, objective = OBJECTIVE.MINIMUM,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/world/selfassign/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { role, objective },
        })
        .then(({ body }) => body);
}


/**
 * (Auto assign) -- makes worlds given a list of users.
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{GROUP_NAME}[/{EPISODE_NAME}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const worlds = await worldAdapter.assignUsers([
 *      { userKey: '123', role: 'locksmith' },
 *      { userKey: '456' },
 * ]);
 *
 * @param {object[]}    assignments                         List of users to assign where each item contains a `userKey` and optional `role`
 * @param {object}      [optionals={}]                      Optional parameters
 * @param {string}      [optionals.groupName]               Name of the group (defaults to name of group associated with session)
 * @param {string}      [optionals.episodeName]             Name of the episode
 * @param {boolean}     [optionals.objective]               Allows platform to assign users beyond minimum amount
 * @param {boolean}     [optionals.requireAllAssignments]   Will have the server return w/ an error whenever an assignment was not made (instead of silently leaving the user as unassigned)
 * @param {string}      [optionals.accountShortName]        Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]        Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of worlds assigned to
 */
export async function autoAssignUsers(
    assignments: UserAssignment[],
    optionals: AssignmentOptions = {}
): Promise<World> {
    const {
        groupName, episodeName, objective = OBJECTIVE.MINIMUM, requireAllAssignments,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/world/assignment/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { assignments, objective, requireAllAssignments },
        })
        .then(({ body }) => body);
}

export async function editAssignments(
    assignments: AssignmentMap,
    optionals: AssignmentOptions = {}
): Promise<World[]> {
    const {
        groupName, episodeName, objective = OBJECTIVE.MINIMUM, requireAllAssignments, keepEmptyWorlds,
        accountShortName, projectShortName, server,
    } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .put(`/world/assignment/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { assignments, objective, requireAllAssignments, keepEmptyWorlds },
        })
        .then(({ body }) => body);
}


/**
 * Retrieves the current assignment information for a given world
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{WORLD_KEY}`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const assignments = await worldAdapter.getAssignmentsByKey(world.worldKey);
 *
 * @param {string}      worldKey                            Key associated with the world
 * @param {object}      [optionals={}]                      Optional parameters
 * @param {string}      [optionals.accountShortName]        Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]        Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of assignment objects containing user and role information
 */
export async function getAssignmentsByKey(
    worldKey: string,
    optionals: GenericAdapterOptions = {}
): Promise<World> {
    const { accountShortName, projectShortName } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/world/assignment/${worldKey}`)
        .then(({ body }) => body);
}

/**
 * Removes a user or list of users the all worlds in a given group or episode. Any worlds that do not contain users within them will be automatically deleted in the process.
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment?userKey={USER_KEY}[&userKey={USER_KEY}&userKey=...]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * await worldAdapter.removeUser(user.userKey);
 *
 * @param {string[]}    userKeys                        List of keys associated with users to remove from worlds
 * @param {object}      [optionals={}]                  Optional parameters
 * @param {string}      [optionals.groupName]           Name of the group (defaults to name of group associated with session)
 * @param {string}      [optionals.episodeName]         Name of the episode
 * @param {string}      [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */
export async function removeUsers(
    userKeys: string[],
    optionals: WorldOptions = {}
): Promise<void> {
    const {
        groupName, episodeName, keepEmptyWorlds,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ userKey: userKeys, keepEmptyWorlds: Boolean(keepEmptyWorlds) })
        .delete(`/world/assignment/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`)
        .then(({ body }) => body);
}


/**
 * Sets the personas of a given scope (project, group, episode, world). Personas correspond to a role the a user in the world can be assigned to.
 * null minimum is 0, but null maximum is uncapped
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/persona/{SCOPE_BOUNDARY}[/{SCOPE_KEY}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * await worldAdapter.editPersonas([
 *
 * ]);
 *
 * @param {object[]}    personas                        List of persona objects containing `role`, `minimum`, and `maximum`
 * @param {object}      [scope={}]                      Scope associated with the persona set (by default the scope used will be the current project). Use this to do any specific overrides.
 * @param {string}      [scope.scopeBoundary]           Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}      [scope.scopeKey]                Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}      [optionals={}]                  Optional parameters
 * @param {string}      [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */
export async function setPersonas(
    personas: Persona[],
    scope: GenericScope,
    optionals: GenericAdapterOptions = {}
): Promise<void> {
    const { scopeBoundary, scopeKey } = scope;
    const { accountShortName, projectShortName } = optionals;
    const boundary = scopeBoundary || SCOPE_BOUNDARY.PROJECT;
    const uriComponent = boundary === SCOPE_BOUNDARY.PROJECT ? '' : `/${scopeKey}`;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        /* We will at some point remove the need to explicitly lower case this */
        .put(`/world/persona/${boundary.toLowerCase()}${uriComponent}`, {
            body: personas,
        })
        .then(({ body }) => body);
}

/**
 * Assigns an existing run to the given world.
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/run/{WORLD_KEY}`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * await worldAdapter.assignRun(world.worldKey, { runKey: run.runKey });
 *
 * @param {string}      worldKey                        Key associated with the world
 * @param {string}      runKey                          Key associated with the world
 * @param {object}      [optionals={}]                  Optional parameters
 * @param {string}      [optionals.groupName]           Name of the group (defaults to name of group associated with session)
 * @param {string}      [optionals.episodeName]         Name of the episode
 * @param {string}      [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns object[]
 */
export async function assignRun(
    worldKey: string,
    runKey: string,
    optionals: GenericAdapterOptions = {}
): Promise<World> {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/world/run/${worldKey}`, {
            body: { runKey },
        })
        .then(({ body }) => body);
}
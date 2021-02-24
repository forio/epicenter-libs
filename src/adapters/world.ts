import { Router, identification } from 'utils/index';
import { SCOPE_BOUNDARY } from 'utils/constants';

interface AssignmentOptions extends GenericAdapterOptions {
    groupName?: string,
    episodeName?: string,
    exceedMinimums?: boolean,
    requireAllAssignments?: boolean,
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
    update: WorldUpdate,
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
export async function destroy(worldKey, optionals = {}) {
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
export async function create(world, optionals = {}) {
    const {
        groupName, episodeName,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/world/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`, { body: world })
        .then(({ body }) => body);
}


/**
 * Fetches the worlds in a group
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
export async function get(optionals = {}) {
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
 * @param {boolean} [optionals.exceedMinimums]      Allows platform to assign users beyond minimum amount
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                World users were assigned to
 */
export async function selfAssign(role, optionals = {}) {
    const {
        groupName, episodeName, exceedMinimums,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/world/selfassign/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { role, exceedMinimums },
        })
        .then(({ body }) => body);
}


/**
 * Assigns a list of users to a world.
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{GROUP_NAME}[/{EPISODE_NAME}]`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const worlds = await worldAdapter.assignUsers([
 *      { userKey: '123', role: 'locksmith' },
 *      { userKey: '456', role: 'cartographer' },
 * ]);
 *
 * @param {object[]}    assignments                         List of users to assign where each item contains a `userKey` and optional `role`
 * @param {object}      [optionals={}]                      Optional parameters
 * @param {string}      [optionals.groupName]               Name of the group (defaults to name of group associated with session)
 * @param {string}      [optionals.episodeName]             Name of the episode
 * @param {boolean}     [optionals.exceedMinimums]          Allows platform to assign users beyond minimum amount
 * @param {boolean}     [optionals.requireAllAssignments]   Will have the server return w/ an error whenever an assignment was not made (instead of silently leaving the user as unassigned)
 * @param {string}      [optionals.accountShortName]        Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]        Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of worlds assigned to
 */
export async function assignUsers(assignments, optionals = {}) {
    const {
        groupName, episodeName, exceedMinimums, requireAllAssignments,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/world/assignment/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`, {
            body: { assignments, exceedMinimums, requireAllAssignments },
        })
        .then(({ body }) => body);
}

/**
 * Updates a specific world's user assignments. Users who have previously been assigned to a different world, will be automatically unassigned and reassigned to the provided world.
 *
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/world/assignment/{WORLD_KEY}`
 *
 * @memberof worldAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const worlds = await worldAdapter.updateUsers(world.worldKey, [
 *      { userKey: '123', role: 'locksmith' },
 *      { userKey: '456', role: 'cartographer' },
 * ]);
 *
 * @param {string}      worldKey                            Key associated with the world
 * @param {object[]}    assignments                         List of users to assign where each item contains a `userKey` and optional `role`
 * @param {object}      [optionals={}]                      Optional parameters
 * @param {boolean}     [optionals.exceedMinimums]          Allows platform to assign users beyond minimum amount
 * @param {boolean}     [optionals.requireAllAssignments]   Will have the server return w/ an error whenever an assignment was not made (instead of silently leaving the user as unassigned)
 * @param {string}      [optionals.accountShortName]        Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]        Name of project (by default will be the project associated with the session)
 * @returns {object}                                        Updated world object
 */
export async function updateAssignments(worldKey, assignments, optionals = {}) {
    const {
        exceedMinimums, requireAllAssignments,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .put(`/world/assignment/${worldKey}`, {
            body: { assignments, exceedMinimums, requireAllAssignments },
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
 * const assignments = await worldAdapter.getAssignments(world.worldKey);
 *
 * @param {string}      worldKey                            Key associated with the world
 * @param {object}      [optionals={}]                      Optional parameters
 * @param {string}      [optionals.accountShortName]        Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]        Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of assignment objects containing user and role information
 */
export async function getAssignments(worldKey, optionals = {}) {
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
export async function removeUsers(userKeys, optionals = {}) {
    const {
        groupName, episodeName,
        accountShortName, projectShortName,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ userKey: userKeys })
        .delete(`/world/assignment/${groupName ?? identification.session?.groupName}${episodeName ? `/${episodeName}` : ''}`)
        .then(({ body }) => body);
}


/**
 * Edits the personas of a given scope (project, group, episode, world). Personas correspond to a role the a user in the world can be assigned to.
 *
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
export async function editPersonas(personas, scope = {}, optionals = {}) {
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
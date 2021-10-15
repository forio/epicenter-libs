import { Router, EpicenterError, identification } from 'utils/index';
import { ROLE } from 'utils/constants';

/**
 * Group API adapters -- handles groups and group memberships
 * @namespace groupAdapter
 */
enum AUGMENT {
    MEMBERS = 'MEMBERS',
    QUANTIZED = 'QUANTIZED',
}

interface Pricing {
    amount: number
}

interface FlightRecorder {
    start: number,
    stop: number,
    enabled: boolean,
}

interface GroupUpdate {
    runLimit?: number,
    organization?: string,
    allowSelfRegistration?: boolean,
    flightRecorder?: FlightRecorder,
    event?: string,
    allowMembershipChanges?: boolean,
    pricing?: Pricing,
    startDate?: Date,
    expirationDate?: Date,
    capacity?: number,
}

interface Group extends GroupUpdate {
    name: string,
    groupKey: string,
}


/**
 * Provides information on a particular Epicenter group.
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group[/(member|quantized)]/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * import { authAdapter, groupAdapter } from 'epicenter';
 * const session = authAdapter.getLocalSession();
 * const group = await groupAdapter.get(session.groupKey, {
 *      augment: 'MEMBERS'      // include members of the group in the response
 * });
 *
 * const group = await groupAdapter.get(session.groupKey, {
 *      augment: 'QUANTIZED'    // include metrics relating to the group in the response
 * });
 *
 */
export async function get(
    optionals: {
        augment?: keyof typeof AUGMENT,
        groupKey?: string,
    } & RoutingOptions = {}
): Promise<Group> {
    const {
        groupKey, augment,
        ...routingOptions
    } = optionals;
    let uriComponent = '';
    if (augment === AUGMENT.MEMBERS) uriComponent = '/member';
    if (augment === AUGMENT.QUANTIZED) uriComponent = '/quantized';

    return await new Router()
        .get(`/group${uriComponent}/${groupKey ?? identification.session?.groupKey}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Deletes the group; available only to Epicenter admins
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.destroy(group.groupKey);
 *
 * @param {string}  groupKey                        Key associated with group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */
export async function destroy(
    groupKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {

    return await new Router()
        .delete(`/group/${groupKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Provides information on for all groups in the project
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group?includeExpired={BOOLEAN}`
 *
 * @memberof groupAdapter
 * @example
 *
 * const groups = await epicenter.groupAdapter.gather();
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {boolean} [optionals.includeExpired]             Indicates whether to include expired groups in the query
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                              List of groups
 */
export async function gather(
    optionals: { includeExpired?: boolean } & RoutingOptions = {}
): Promise<Group[]> {
    const {
        includeExpired,
        ...routingOptions
    } = optionals;

    return await new Router()
        .withSearchParams({ includeExpired })
        .get('/group', routingOptions)
        .then(({ body }) => body);
}


/**
 * Updates fields for a particular group; available only to Epicenter admins.
 *
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.update(groupKey, { event: 'Orientation Day' });
 *
 * @param {string}  groupKey                        Key associated with group
 * @param {object}  update                          Attributes you wish to update
 * @param {number}  update.runLimit                 Defines the upper limit of runs allowed in the group
 * @param {string}  update.organization             Name of the organization owning the group
 * @param {boolean} update.allowSelfRegistration    TODO
 * @param {object}  update.flightRecorder           Diagnostic tool for loggin http requests for the server
 * @param {number}  update.flightRecorder.start     Start time (epoch time)
 * @param {number}  update.flightRecorder.stop      End time (epoch time)
 * @param {boolean} update.flightRecorder.enabled   TODO
 * @param {string}  update.event                    Name of the event the group is playing for
 * @param {boolean} update.allowMembershipChanges   TODO
 * @param {object}  update.pricing                  TODO
 * @param {number}  update.pricing.number           TODO
 * @param {object}  update.startDate                TODO
 * @param {object}  update.expirationDate           TODO
 * @param {object}  update.capacity                 Defines the upper limit on the number of users allowed in the group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Group with updated attributes
 */
export async function update(
    groupKey: string,
    update: GroupUpdate,
    optionals: RoutingOptions = {}
): Promise<Group> {
    const {
        runLimit, organization, allowSelfRegistration, flightRecorder,
        event, allowMembershipChanges, pricing,
        startDate, expirationDate, capacity,
    } = update;

    return await new Router()
        .patch(`/group/${groupKey}`, {
            body: {
                runLimit, organization, allowSelfRegistration, flightRecorder,
                event, allowMembershipChanges, pricing,
                startDate, expirationDate, capacity,
            },
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Creates a new group; available only to Epicenter admins
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.create({
 *      runLimit: 10,
 *      name: 'my-group-name',
 * });
 *
 * @param {object}  group                           Group object
 * @param {string}  group.name                      Group name (required)
 * @param {number}  group.runLimit                  Defines the upper limit on the number of runs allowed in the group
 * @param {string}  group.organization              Name of the organization owning the group
 * @param {string}  group.allowSelfRegistration     TODO
 * @param {object}  group.flightRecorder            Diagnostic tool for loggin http requests for the server
 * @param {number}  group.flightRecorder.start      Start time (epoch time)
 * @param {number}  group.flightRecorder.stop       End time (epoch time)
 * @param {boolean} group.flightRecorder.enabled    TODO
 * @param {string}  group.event                     Name of the event the group is playing for
 * @param {boolean} group.allowMembershipChanges    TODO
 * @param {object}  group.pricing                   TODO
 * @param {object}  group.startDate                 TODO
 * @param {object}  group.expirationDate            TODO
 * @param {object}  group.capacity                  Defines the upper limit on the number of users allowed in the group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Newly created group
 */
export async function create(
    group: Group,
    optionals: RoutingOptions = {}
): Promise<Group> {
    const {
        name, runLimit, organization, allowSelfRegistration,
        flightRecorder, event, allowMembershipChanges, pricing,
        startDate, expirationDate, capacity,
    } = group;
    if (!name) throw new EpicenterError('Cannot create a group with no name');
    return await new Router()
        .post('/group', {
            body: {
                name, runLimit, organization, allowSelfRegistration,
                flightRecorder, event, allowMembershipChanges, pricing,
                startDate, expirationDate, capacity,
            },
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Queries for groups
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/search?filter={FILTER}&sort={SORT}&first={FIRST}&max={MAX}`
 *
 * @memberof groupAdapter
 * @example
 *
 * import { groupAdapter } from 'epicenter';
 * groupAdapter.search({
 *      filter: [
 *          'group.name|=group1|group2',    // look for groups whose name is 'group1' or 'group2'
 *          'permission.role=FACILITATOR',  // where there exists at least one facilitator user
 *          'user.userKey=0123',            // whose userKey is '0123'
 *      },
 *      sort: ['+group.name']               // sort all findings by group name ascending (lexigraphically)
 * });
 *
 * @param {object}      [optionals={}]                  Optional parameters
 * @param {string[]}    [optionals.filter]              List of conditionals to filter for
 * @param {string[]}    [optionals.sort]                List of values to sort by
 * @param {string}      [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                    Group object
 */
export async function search(
    optionals: { quantized?: boolean } & GenericSearchOptions & RoutingOptions = {}
): Promise<Page<Group>> {
    const {
        filter = [], sort = [], first, max, quantized,
        ...routingOptions
    } = optionals;

    const searchParams = {
        filter: filter.join(';') || undefined,
        sort: sort.join(';') || undefined,
        first, max,
    };

    return await new Router()
        .withSearchParams(searchParams)
        .get(`/group${quantized ? '/quantized' : ''}/search`, {
            paginated: true,
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Retrieves a group with given group name
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/with/{GROUP_NAME}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.withGroupName(group.groupKey)
 *
 * @param {string}  name                            Name associated with the group
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Group Object
 */
export async function withGroupName(
    name: string,
    optionals: RoutingOptions = {}
): Promise<Group> {

    return await new Router()
        .get(`/group/with/${name}`, optionals)
        .then(({ body }) => body);
}


/**
 * Retrieves the list of groups a particular user is in; intended for admin use
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/for/{USER_KEY}[?includeExpired={BOOLEAN}&all={BOOLEAN}&role={ROLE}&role={ROLE}...]`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.forUser(
 *      user.userKey,               // get groups where this user is a member of
 *      { role: ['FACILITATOR'] }   // where this user is a facilitator in the group
 * );
 *
 * @param {string}          userKey                         Name associated with the group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {boolean}         [optionals.includeExpired]             Indicates whether to include expired groups in the query
 * @param {boolean}         [optionals.includeAllMembers]                 Indicates whether to include the other members in the group (by default, only the requested user appears)
 * @param {string|string[]} [optionals.role]                Role or list of possible roles the user holds in the group
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of groups
 */
export async function forUser(
    userKey: string,
    optionals: {
        includeAllMembers?: boolean,
        includeExpired?: boolean,
        role?: string | string[],
    } & RoutingOptions = {},
): Promise<Group[]> {
    const {
        includeExpired, includeAllMembers, role,
        ...routingOptions
    } = optionals;
    const isMultiple = Array.isArray(role) && role.length > 0;
    const roleList = isMultiple ? role : [role];
    const searchParams = {
        includeExpired,
        includeAllMembers,
        role: role ? roleList : undefined,
    };

    return await new Router()
        .withSearchParams(searchParams)
        .get(`/group/member/for/${userKey}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Retrieves the list of groups particular to the current session
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member[?includeExpired={BOOLEAN}&role={ROLE}&role={ROLE}...]`
 *
 * @memberof groupAdapter
 * @example
 *
 * const groups = await epicenter.groupAdapter.getSessionGroups();
 *
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {boolean}         [optionals.includeExpired]             Indicates whether to include expired groups in the query (defaults to false)
 * @param {string|string[]} [optionals.role]                Role or list of possible roles the user holds in the group
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of groups
 */
export async function getSessionGroups(
    optionals: {
        includeAllMembers?: boolean,
        includeExpired?: boolean,
        role?: string | string[],
    } & RoutingOptions = {},
): Promise<Group[]> {
    const {
        includeExpired, role,
        ...routingOptions
    } = optionals;
    const isMultiple = Array.isArray(role) && role.length > 0;
    const roleList = isMultiple ? role : [role];
    const searchParams = {
        includeExpired,
        role: role ? roleList : undefined,
    };

    return await new Router()
        .withSearchParams(searchParams)
        .get('/group/member', routingOptions)
        .then(({ body }) => body);
}


/**
 * Self-application for membership in a group; will only work if the group has the self-registration setting turned on.
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/selfRegistration/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.register(group.groupKey);
 *
 * @param {string}          groupKey                        Key associated with group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of groups
 */
export async function register(
    groupKey: string,
    optionals: RoutingOptions = {}
): Promise<Group> {

    return await new Router()
        .post(`/group/selfRegistration/${groupKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Adds user(s) to the group
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.addUser(group.groupKey);
 *
 * @param {string}          groupKey                        Key associated with group
 * @param {string}          usersOfUserKeys                 Key associated with group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {string}          [optionals.role]                User's role -- defaults to PARTICIPANT if unset; See [ROLE](#ROLE) for all types
 * @param {string}          [optionals.available]           Indicates whether or not the user is 'active' (for semantic labeling) -- defaults to true if unset
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                        Group the user was added to
 */

type UserInput = string | { userKey: string, role?: keyof typeof ROLE, available?: boolean };

export async function addUser(
    usersInput: UserInput | UserInput[],
    optionals: { groupKey?: string } & RoutingOptions = {}
):Promise<Group> {
    const { groupKey, ...routingOptions } = optionals;

    const users = Array.isArray(usersInput) ? usersInput : [usersInput];

    return await new Router()
        .post(`/group/member/${groupKey ?? identification.session?.groupKey}`, {
            body: users.map((u) => {
                const userKey = typeof u === 'string' ? u : u.userKey;
                const role = typeof u === 'string' ? ROLE.PARTICIPANT : u.role;
                const available = typeof u === 'string' ? true : u.available;

                return {
                    role,
                    userKey,
                    objectType: 'group',
                    available: available ?? true,
                };
            }),
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Updates a user's group membership information
 *
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/{GROUP_KEY}/{USER_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.updateUser(group.groupKey);
 *
 * @param {string}          groupKey                        Key associated with group
 * @param {string}          userKey                         Key associated with group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {string}          [optionals.role]                User's role; See [ROLE](#ROLE) for all types
 * @param {string}          [optionals.available]           Indicates whether or not the user is 'active' (for semantic labeling)
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                        Group the user was added to
 */
export async function updateUser(
    userKey: string,
    update: { role?: keyof typeof ROLE, available?: boolean },
    optionals: { groupKey?: string } & RoutingOptions = {}
):Promise<User> {
    const { role, available } = update;
    const { groupKey, ...routingOptions } = optionals;

    return await new Router()
        .patch(`/group/member/${groupKey ?? identification.session?.groupKey}/${userKey}`, {
            body: {
                objectType: 'group',
                role,
                available,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Removes user(s) from the group
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/{GROUP_KEY}[/{USER_KEY}][?userKey={USER_KEY}&userKey=...]`
 *
 * @memberof groupAdapter
 * @example
 *
 * const userKeys = members.map(({ userKey }) => userKey);
 * epicenter.groupAdapter.removeUsers(group.groupKey, userKeys)
 *
 * @param {string}          groupKey                        Key associated with the group
 * @param {string|string[]} userKey                         Key associated with the user or an array of user keys to remove from group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */
export async function removeUser(
    userKey: string | string[],
    optionals: { groupKey?: string } & RoutingOptions = {}
): Promise<void> {
    const { groupKey, ...routingOptions } = optionals;
    const hasMultiple = Array.isArray(userKey) && userKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${userKey.length === 1 ? userKey[0] : userKey}`;
    const searchParams = hasMultiple ? { userKey } : undefined;

    return await new Router()
        .withSearchParams(searchParams)
        .delete(`/group/member/${groupKey ?? identification.session?.groupKey}${uriComponent}`, routingOptions)
        .then(({ body }) => body);
}


export async function statusUpdate(
    code: string,
    message: string,
    optionals: { groupKey?: string } & RoutingOptions = {}
): Promise<Group> {
    const { groupKey, ...routingOptions } = optionals;

    return await new Router()
        .patch(`/group/status/${groupKey ?? identification.session?.groupKey}`, {
            body: { code, message },
            ...routingOptions,
        }).then(({ body }) => body);
}

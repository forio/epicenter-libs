import { Router, EpicenterError } from 'utils/index';
import { ROLE } from 'utils/constants';

/**
 * Group API adapters -- handles groups and group memberships
 * @namespace groupAdapter
 */
enum AUGMENT {
    MEMBERS = 'MEMBERS',
    QUANTIZED = 'QUANTIZED',
}

interface GetOptions extends GenericAdapterOptions {
    augment?: keyof typeof AUGMENT
}

interface GatherOptions extends GenericAdapterOptions {
    expired?: boolean,
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
}

interface QueryOptions extends GenericAdapterQueryOptions {
    quantized?: boolean
}

interface GroupOptions extends GenericAdapterOptions {
    all?: boolean,
    expired?: boolean,
    role?: string | string[],
}

interface UserOptions extends GenericAdapterOptions {
    role?: string,
    available?: boolean,
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
    groupKey: string,
    optionals: GetOptions = {}
) {
    const { accountShortName, projectShortName, server, augment } = optionals;
    let uriComponent = '';
    if (augment === AUGMENT.MEMBERS) uriComponent = '/member';
    if (augment === AUGMENT.QUANTIZED) uriComponent = '/quantized';

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/group${uriComponent}/${groupKey}`)
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
export async function destroy(groupKey: string, optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/group/${groupKey}`)
        .then(({ body }) => body);
}


/**
 * Provides information on for all groups in the project
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group?expired={BOOLEAN}`
 *
 * @memberof groupAdapter
 * @example
 *
 * const groups = await epicenter.groupAdapter.gather();
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {boolean} [optionals.expired]             Indicates whether to include expired groups in the query
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                              List of groups
 */
export async function gather(optionals: GatherOptions = {}) {
    const { accountShortName, projectShortName, server, expired } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ expired })
        .get('/group')
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
export async function update(groupKey: string, update: GroupUpdate, optionals: GenericAdapterOptions = {}) {
    const {
        runLimit, organization, allowSelfRegistration, flightRecorder,
        event, allowMembershipChanges, pricing,
        startDate, expirationDate, capacity,
    } = update;
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/group/${groupKey}`, {
            body: {
                runLimit, organization, allowSelfRegistration, flightRecorder,
                event, allowMembershipChanges, pricing,
                startDate, expirationDate, capacity,
            },
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
export async function create(group: Group, optionals: GenericAdapterOptions = {}) {
    const {
        name, runLimit, organization, allowSelfRegistration,
        flightRecorder, event, allowMembershipChanges, pricing,
        startDate, expirationDate, capacity,
    } = group;
    const { accountShortName, projectShortName, server } = optionals;
    if (!name) throw new EpicenterError('Cannot create a group with no name');
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post('/group', {
            body: {
                name, runLimit, organization, allowSelfRegistration,
                flightRecorder, event, allowMembershipChanges, pricing,
                startDate, expirationDate, capacity,
            },
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
export async function search(optionals: QueryOptions = {}) {
    const {
        filter = [], sort = [], first, max, quantized,
        accountShortName, projectShortName, server,
    } = optionals;

    const searchParams = {
        filter: filter.join(';') || undefined,
        sort: sort.join(';') || undefined,
        first, max,
    };

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/group${quantized ? '/quantized' : ''}/search`, { paginated: true })
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
export async function withGroupName(name: string, optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/group/with/${name}`)
        .then(({ body }) => body);
}


/**
 * Retrieves the list of groups a particular user is in; intended for admin use
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/for/{USER_KEY}[?expired={BOOLEAN}&all={BOOLEAN}&role={ROLE}&role={ROLE}...]`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.forUserKey(
 *      user.userKey,               // get groups where this user is a member of
 *      { role: ['FACILITATOR'] }   // where this user is a facilitator in the group
 * );
 *
 * @param {string}          userKey                         Name associated with the group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {boolean}         [optionals.expired]             Indicates whether to include expired groups in the query
 * @param {boolean}         [optionals.all]                 Indicates whether to include the other members in the group (by default, only the requested user appears)
 * @param {string|string[]} [optionals.role]                Role or list of possible roles the user holds in the group
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of groups
 */
export async function forUserKey(userKey: string, optionals: GroupOptions = {}) {
    const {
        expired, all, role,
        accountShortName, projectShortName, server,
    } = optionals;
    const isMultiple = Array.isArray(role) && role.length > 0;
    const roleList = isMultiple ? role : [role];
    const searchParams = {
        expired,
        all,
        role: role ? roleList : undefined,
    };

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/group/member/for/${userKey}`)
        .then(({ body }) => body);
}


/**
 * Retrieves the list of groups particular to the current session
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member[?expired={BOOLEAN}&role={ROLE}&role={ROLE}...]`
 *
 * @memberof groupAdapter
 * @example
 *
 * const groups = await epicenter.groupAdapter.getSessionGroups();
 *
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {boolean}         [optionals.expired]             Indicates whether to include expired groups in the query (defaults to false)
 * @param {string|string[]} [optionals.role]                Role or list of possible roles the user holds in the group
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object[]}                                      List of groups
 */
export async function getSessionGroups(optionals: GroupOptions = {}) {
    const {
        expired, role,
        accountShortName, projectShortName, server,
    } = optionals;
    const isMultiple = Array.isArray(role) && role.length > 0;
    const roleList = isMultiple ? role : [role];
    const searchParams = {
        expired,
        role: role ? roleList : undefined,
    };

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get('/group/member')
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
export async function register(groupKey: string, optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/group/selfRegistration/${groupKey}`)
        .then(({ body }) => body);
}


/**
 * Adds a user to a group
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/group/member/{GROUP_KEY}`
 *
 * @memberof groupAdapter
 * @example
 *
 * epicenter.groupAdapter.addUser(group.groupKey);
 *
 * @param {string}          groupKey                        Key associated with group
 * @param {string}          userKey                         Key associated with group
 * @param {object}          [optionals={}]                  Optional parameters
 * @param {string}          [optionals.role]                User's role -- defaults to PARTICIPANT if unset; See [ROLE](#ROLE) for all types
 * @param {string}          [optionals.available]           Indicates whether or not the user is 'active' (for semantic labeling) -- defaults to true if unset
 * @param {string}          [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}          [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                        Group the user was added to
 */
export async function addUser(
    groupKey: string,
    userKey: string,
    optionals: UserOptions = {}
) {
    const {
        role, available,
        accountShortName, projectShortName, server,
    } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/group/member/${groupKey}`, {
            body: {
                objectType: 'group',
                userKey,
                role: role ?? ROLE.PARTICIPANT,
                available: available ?? true,
            },
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
    groupKey: string,
    userKey: string,
    optionals: UserOptions = {}
) {
    const {
        role, available,
        accountShortName, projectShortName, server,
    } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/group/member/${groupKey}/${userKey}`, {
            body: {
                objectType: 'group',
                role,
                available,
            },
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
    groupKey: string,
    userKey: string | string[],
    optionals: GenericAdapterOptions = {}
) {
    const { accountShortName, projectShortName, server } = optionals;
    const hasMultiple = Array.isArray(userKey) && userKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${userKey.length === 1 ? userKey[0] : userKey}`;
    const searchParams = hasMultiple ? { userKey } : undefined;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .delete(`/group/member/${groupKey}${uriComponent}`)
        .then(({ body }) => body);
}


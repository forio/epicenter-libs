import type { UserSession, Session } from '../utils/identification';
import type { RoutingOptions, Page } from '../utils/router';
import type { GenericSearchOptions } from '../utils/constants';
import type { PseudonymReadOutView } from './user';

import { Router, EpicenterError, identification, ROLE, parseFilterInput } from '../utils';

export type Augment = 'MEMBERS' | 'QUANTIZED';
export type SalesChannel = 'TEAM' | 'TEST' | 'FORIO' | 'HBP_HIGHER_ED' | 'HBP_CL';

export interface Status {
    code?: string;
    message?: string;
}

export interface StripePaymentCreateInView {
    description: string;
    token: string;
    objectType: 'stripe';
}

export interface Pricing {
    amount?: number;
}

export interface FlightRecorderReadOutView {
    enabled?: boolean;
    start?: number;
    stop?: number;
}

export interface FlightRecorderCreateInView {
    enabled: boolean;
    stop: number;
    start?: number;
}

export interface FlightRecorderUpdateInView {
    enabled?: boolean;
    start?: number;
    stop?: number;
}

export interface GroupReadOutView {
    groupKey: string;
    name: string;
    members?: GroupPermissionReadOutView[];
    creator?: string;
    created?: string;
    lastUpdated?: string;
    tombstone?: string;
    capacity?: number;
    runLimit?: number;
    approximateMemberCount?: number;
    startDate?: string;
    expirationDate?: string;
    terminationDate?: string;
    allowSelfRegistration?: boolean;
    allowMembershipChanges?: boolean;
    allowChannel?: boolean;
    demonstration?: boolean;
    perpetual?: boolean;
    reference?: string;
    organization?: string;
    event?: string;
    salesChannel?: SalesChannel;
    status?: Status;
    pricing?: Pricing;
    flightRecorder?: FlightRecorderReadOutView;
}

export interface GroupPermissionReadOutView {
    objectType: 'group';
    role?: string;
    available?: boolean;
    user: PseudonymReadOutView;
}

export interface GroupPermissionCreateInView {
    userKey: string;
    role: string;
    available?: boolean;
    payment?: StripePaymentCreateInView;
}

type UserInput = string | GroupPermissionCreateInView;

// Aliases for backward compatibility
export type Group = GroupReadOutView;
export type Member = GroupPermissionReadOutView;

export interface SelfRegistrationResult {
    redirectUrl: string;
    whoAmI: Session;
}

/**
 * Provides information on a particular Epicenter group.
 * @example
 * import { authAdapter, groupAdapter } from 'epicenter-libs';
 * const session = authAdapter.getLocalSession();
 * // include members of the group in the response
 * const group = await groupAdapter.get(session.groupKey, { augment: 'MEMBERS' });
 * // include metrics relating to the group in the response
 * const group = await groupAdapter.get(session.groupKey, { augment: 'QUANTIZED' });
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.augment]   Specifies which additional information you'd like returned with the group
 * @param [optionals.groupKey]  Group key, if omitted will attempt to use the group associated with the current session
 * @returns promise that resolves to a group
 */
export async function get(
    optionals: {
        augment?: Augment;
        groupKey?: string;
    } & RoutingOptions = {},
): Promise<GroupReadOutView> {
    const {
        groupKey, augment,
        ...routingOptions
    } = optionals;
    let uriComponent = '';
    if (augment === 'MEMBERS') uriComponent = '/member';
    if (augment === 'QUANTIZED') uriComponent = '/quantized';
    const session = identification.session as UserSession;

    return await new Router()
        .get(`/group${uriComponent}/${groupKey ?? session?.groupKey}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Deletes the group; available only to Epicenter admins
 * @example
 * epicenter.groupAdapter.destroy('0000017dd3bf540e5ada5b1e058f08f20461');
 * @param groupKey      Key associated with group
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to undefined if successful
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
 * @example
 * const groups = await epicenter.groupAdapter.gather();
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @param [optionals.includeExpired]    Indicates whether to include expired groups in the query
 * @returns promise that resolves to a list of groups
 */
export async function gather(
    optionals: { includeExpired?: boolean } & RoutingOptions = {},
): Promise<GroupReadOutView[]> {
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
 * @example
 * epicenter.groupAdapter.update('0000017dd3bf540e5ada5b1e058f08f20461', { event: 'Orientation Day' });
 * @param groupKey                          Key associated with group
 * @param update                            Attributes you wish to update
 * @param [update.runLimit]                 Defines the upper limit of runs allowed in the group
 * @param [update.organization]             Name of the organization owning the group
 * @param [update.allowSelfRegistration]    TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [update.flightRecorder]           Diagnostic tool for logging http requests for the server
 * @param [update.flightRecorder].start     Start time (epoch time)
 * @param [update.flightRecorder].stop      End time (epoch time)
 * @param [update.flightRecorder].enabled   Enabled flag for the flight recorder
 * @param [update.event]                    Name of the event the group is playing for
 * @param [update.allowMembershipChanges]   TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [update.pricing]                  TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [update.pricing].number           TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [update.startDate]                TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [update.expirationDate]           Date the group expires
 * @param [update.capacity]                 Defines the upper limit on the number of users allowed in the group
 * @param [update.allowChannel]             Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @param [optionals]                       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the updated group
 */
export async function update(
    groupKey: string,
    update: {
        tombstone?: string;
        capacity?: number;
        runLimit?: number;
        perpetual?: boolean;
        salesChannel?: SalesChannel;
        reference?: string;
        organization?: string;
        event?: string;
        allowSelfRegistration?: boolean;
        allowMembershipChanges?: boolean;
        allowChannel?: boolean;
        demonstration?: boolean;
        startDate?: string;
        expirationDate?: string;
        terminationDate?: string;
        status?: Status;
        pricing?: Pricing;
        flightRecorder?: FlightRecorderUpdateInView;
    },
    optionals: RoutingOptions = {},
): Promise<GroupReadOutView> {
    const {
        runLimit,
        organization,
        allowSelfRegistration,
        flightRecorder,
        event,
        allowMembershipChanges,
        pricing,
        startDate,
        expirationDate,
        capacity,
        allowChannel,
    } = update;

    return await new Router()
        .patch(`/group/${groupKey}`, {
            body: {
                runLimit,
                organization,
                allowSelfRegistration,
                flightRecorder,
                event,
                allowMembershipChanges,
                pricing,
                startDate,
                expirationDate,
                capacity,
                allowChannel,
            },
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Creates a new group; available only to Epicenter admins
 * @example
 * epicenter.groupAdapter.create({
 *      runLimit: 10,
 *      name: 'my-group-name',
 * });
 * @param group                             Group object
 * @param group.name                        Group name (required)
 * @param [group.runLimit]                  Defines the upper limit on the number of runs allowed in the group
 * @param [group.organization]              Name of the organization owning the group
 * @param [group.allowSelfRegistration]     TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [group.flightRecorder]            Diagnostic tool for loggin http requests for the server
 * @param [group.flightRecorder.start]      Start time (epoch time)
 * @param [group.flightRecorder.stop]       End time (epoch time)
 * @param [group.flightRecorder.enabled]    Enabled flag for the flight recorder
 * @param [group.event]                     Name of the event the group is playing for
 * @param [group.allowMembershipChanges]    TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [group.pricing]                   TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [group.startDate]                 TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [group.expirationDate]            Date the group expires
 * @param [group.capacity]                  Defines the upper limit on the number of users allowed in the group
 * @param [group.allowChannel]              Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @param [optionals]                       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the newly created group
 */
export async function create(
    group: {
        name: string;
        capacity?: number;
        runLimit?: number;
        allowSelfRegistration?: boolean;
        allowMembershipChanges?: boolean;
        allowChannel?: boolean;
        perpetual?: boolean;
        demonstration?: boolean;
        startDate?: string;
        expirationDate?: string;
        terminationDate?: string;
        reference?: string;
        organization?: string;
        event?: string;
        salesChannel?: SalesChannel;
        status?: Status;
        pricing?: Pricing;
        flightRecorder?: FlightRecorderCreateInView;
    },
    optionals: RoutingOptions = {},
): Promise<GroupReadOutView> {
    const {
        name,
        runLimit,
        organization,
        allowSelfRegistration,
        flightRecorder,
        event,
        allowMembershipChanges,
        pricing,
        startDate,
        expirationDate,
        capacity,
        allowChannel,
    } = group;
    if (!name) throw new EpicenterError('Cannot create a group with no name');
    return await new Router()
        .post('/group', {
            body: {
                name,
                runLimit,
                organization,
                allowSelfRegistration,
                flightRecorder,
                event,
                allowMembershipChanges,
                pricing,
                startDate,
                expirationDate,
                capacity,
                allowChannel,
            },
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Queries for groups
 * @example
 * import { groupAdapter } from 'epicenter-libs';
 * const filter = [
 *      'name|=group1|group2',                              // look for groups whose name is 'group1' or 'group2'
 *      'groupKey=0000017dd3bf540e5ada5b1e058f08f20461',    // look for groups with the specific group key
 *      'approximateMemberCount>30',                        // look for groups larger than 30
 *      'startDate<2022-01-03T20:30:53.054Z',               // look for groups with start date before Jan 3rd 2022
 *      'expirationDate<2022-01-03T20:30:53.054Z',          // look for groups with expiration date before Jan 3rd 2022
 *      // 'account.shortName=acme',                        // specifies account, intended for admin use
 *      // 'project.shortName=simulations',                 // specifies project, intended for admin use
 * ];
 * groupAdapter.query({
 *      filter,
 *      sort: ['+group.name']   // sort all findings by group name ascending (lexigraphically)
 *      first: 3,               // page should start with the 4th item found (will default to 0)
 *      max: 10,                // page should only include the first 10 items
 * });
 * @param searchOptions             Search options for the query
 * @param [searchOptions.filter]    Filters for searching
 * @param [searchOptions.sort]      Sorting criteria
 * @param [searchOptions.first]     The starting index of the page returned
 * @param [searchOptions.max]       The number of entries per page
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a page of groups
 */
export async function query(
    searchOptions: { quantized?: boolean } & GenericSearchOptions,
    optionals: RoutingOptions = {},
): Promise<Page<GroupReadOutView>> {
    const { filter, sort = [], first, max, quantized } = searchOptions;

    const searchParams = {
        filter: parseFilterInput(filter),
        sort: sort.join(';') || undefined,
        first, max,
    };

    return await new Router()
        .withSearchParams(searchParams)
        .get(`/group${quantized ? '/quantized' : ''}/search`, {
            paginated: true,
            ...optionals,
        })
        .then(({ body }) => body);
}
/** DEPRECATED -- use groupAdapter.query instead */
export async function search(
    optionals: { quantized?: boolean } & GenericSearchOptions & RoutingOptions = {},
): Promise<Page<GroupReadOutView>> {
    console.warn('DEPRECATION WARNING: groupAdapter.search is deprecated and will be removed with the next release. Use groupAdapter.query instead.');
    const { filter = [], sort = [], first, max, quantized, ...routingOptions } = optionals;
    const searchOptions = { filter, sort, first, max, quantized };
    return await query(searchOptions, routingOptions);
}


/**
 * Retrieves a group with given group name
 * @example
 * epicenter.groupAdapter.withGroupName('my-group-name');
 * @param name          Name associated with the group
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a group
 */
export async function withGroupName(
    name: string,
    optionals: RoutingOptions = {},
): Promise<GroupReadOutView> {
    return await new Router()
        .get(`/group/with/${name}`, optionals)
        .then(({ body }) => body);
}


/**
 * Retrieves the list of groups a particular user is in; intended for admin use
 * @example
 * epicenter.groupAdapter.forUser(
 *      '000001796733eef0842f4d6d960997018a3b', // get groups where this user is a member of
 *      { role: ['FACILITATOR'] }               // where this user is a facilitator in the group
 * );
 * @param userKey                       Name associated with the group
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.includeExpired]    Indicates whether to include expired groups in the query
 * @param [optionals.includeAllMembers] Indicates whether to include the other members in the group (by default, only the requested user appears)
 * @param [optionals.role]              Role or list of possible roles the user holds in the group
 * @returns promise that resolves to a list of groups
 */
export async function forUser(
    userKey: string,
    optionals: {
        includeAllMembers?: boolean;
        includeExpired?: boolean;
        role?: string | string[];
    } & RoutingOptions = {},
): Promise<GroupReadOutView[]> {
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
 * @example
 * const groups = await epicenter.groupAdapter.getSessionGroups();
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @param [optionals.includeExpired]    Indicates whether to include expired groups in the query
 * @param [optionals.includeAllMembers] Indicates whether to include the other members in the group (by default, only the requested user appears)
 * @param [optionals.role]              Role or list of possible roles the user holds in the group
 * @returns promise that resolves to a list of groups
 */
export async function getSessionGroups(
    optionals: {
        includeAllMembers?: boolean;
        includeExpired?: boolean;
        role?: string | string[];
    } & RoutingOptions = {},
): Promise<GroupReadOutView[]> {
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
 * Permits a list of users to self-register for membership in a group; will only work if the group has allowSelfRegistration set to true
 * @example
 * epicenter.groupAdapter.whitelistUsers('0000017dd3bf540e5ada5b1e058f08f20461', {
 *    allow: true,
 *    emails: ['user1@test.com', 'user2@test.com'],
 * });
 * @param groupKey                  Key associated with group
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @param [optionals.allow]         Whether to allow or disallow self-registration for the specified users; defaults to true if unset
 * @param [optionals.emails]        List of emails to allow or disallow; a value of "*" is interpreted as all users; defaults to all users if unset
 * @returns promise that resolves to undefined (indicating success)
 */
export async function whitelistUsers(
    groupKey: string,
    optionals: {
        allow?: boolean;
        emails?: string[];
    } & RoutingOptions = {},
): Promise<void> {
    const {
        allow = true,
        emails = ['*'],
        ...routingOptions
    } = optionals;

    return await new Router()
        .post(`/group/self/${groupKey}`, {
            body: {
                allow,
                emails,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Retrieves a list of users allowed to self-register for membership in a group with a given groupKey
 * @example
 * epicenter.groupAdapter.getWhitelistedUsers('0000017dd3bf540e5ada5b1e058f08f20461');
 * @param groupKey      Key associated with the group
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a list of users
 */
export async function getWhitelistedUsers(
    groupKey: string,
    optionals: RoutingOptions = {},
): Promise<PseudonymReadOutView[]> {
    return await new Router()
        .get(`/group/self/${groupKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Sends an email to the specified email address with a link to complete self-registration for a group
 * @example
 * epicenter.groupAdapter.sendRegistrationEmail('0000017dd3bf540e5ada5b1e058f08f20461', 'user1@test.com', {
 *     redirectURL: '/login',
 *     linkURL: '/register',
 *     subject: 'Complete your registration!',
 * });
 * @param groupKey                  Key associated with group
 * @param email                     Email address to send the link to
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @param  [optionals.linkURL]      Relative path to link sent in email to complete registration (<forio scheme>://<forio host>/app/<account>/<project><linkURL>)
 * @param  [optionals.redirectURL]  Relative path to redirect to after completing registration (<forio scheme>://<forio host>/app/<account>/<project><redirectURL>)
 * @param  [optionals.subject]      The subject of the email that will be sent
 * @returns promise that resolves to undefined (indicating success)
 */
export async function sendRegistrationEmail(
    groupKey: string,
    email: string,
    optionals: {
        linkURL?: string;
        redirectURL?: string;
        subject?: string;
    } & RoutingOptions = {},
): Promise<void> {
    const { redirectURL, linkURL, subject, ...routingOptions } = optionals;

    return await new Router()
        .post(`/registration/self/${groupKey}`, {
            body: {
                email,
                linkUrl: linkURL,
                redirectUrl: redirectURL,
                subject,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Finalizes a user's self-registration process for a group, requires the project to have deployment.autoCreatePlayer set to true
 * @example
 * epicenter.groupAdapter.selfRegister('myregistrationtoken', 'pass', {
 *    displayName: 'My Display Name',
 *    givenName: 'Leonard',
 *    familyName: 'Nimoy',
 *    handle: 'the_real_spock',
 * });
 * @param groupKey                  Key associated with group
 * @param password                  Password the user would use to log in
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @param  [optionals.displayName]  Display name chosen by user
 * @param  [optionals.givenName]    User's given name
 * @param  [optionals.familyName]   User's family name
 * @param  [optionals.handle]       Handle the user would use to log in, defaults to email address if not specified
 * @returns promise resolving to an object containing the redirect URL and the session
 */
export async function selfRegister(
    token: string,
    password: string,
    optionals: {
        displayName?: string;
        givenName?: string;
        familyName?: string;
        handle?: string;
    } & RoutingOptions = {},
): Promise<SelfRegistrationResult> {
    const { displayName, givenName, familyName, handle, ...routingOptions } = optionals;

    return await new Router()
        .patch(`/registration/self/${token}`, {
            body: {
                password,
                displayName,
                givenName,
                familyName,
                handle,
            },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Adds user(s) to the group
 * @example
 * epicenter.groupAdapter.addUser('000001796733eef0842f4d6d960997018a3b');
 * epicenter.groupAdapter.addUser([{
 *      userKey: '000001796733eef0842f4d6d960997018a3b',
 *      role: 'REVIEWER',
 *      available: false,
 * }]);
 * @param usersInput                List of user keys or user input objects (properties defined below)
 * @param usersInput[].userKey      User key
 * @param [usersInput[].role]       User's role -- defaults to PARTICIPANT if unset; See [ROLE](#ROLE) for all types
 * @param [usersInput[].available]  Indicates whether or not the user is 'active' (for semantic labeling) -- defaults to true if unset
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupKey]      Group key to do indicate the group; will default to the group key associated with the current session
 * @returns promise that resolves to the group the user was added to
 */
export async function addUser(
    usersInput: UserInput | UserInput[],
    optionals: { groupKey?: string } & RoutingOptions = {},
): Promise<GroupReadOutView> {
    const { groupKey, ...routingOptions } = optionals;

    const users = Array.isArray(usersInput) ? usersInput : [usersInput];
    const session = identification.session as UserSession;
    return await new Router()
        .post(`/group/member/${groupKey ?? session?.groupKey}`, {
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
 * @example
 * epicenter.groupAdapter.updateUser('000001796733eef0842f4d6d960997018a3b', { role: 'LEADER' });
 * @param userKey               User key
 * @param update                Object containing the updates to a user's group membership information
 * @param [update.role]         User's role; See [ROLE](#ROLE) for all types
 * @param [update.available]    Indicates whether or not the user is 'active' (for semantic labeling)
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the membership information that was updated
 */
export async function updateUser(
    userKey: string,
    update: {
        role?: string;
        available?: boolean;
    },
    optionals: { groupKey?: string } & RoutingOptions = {},
): Promise<GroupReadOutView> {
    const { role, available } = update;
    const { groupKey, ...routingOptions } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .patch(`/group/member/${groupKey ?? session?.groupKey}/${userKey}`, {
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
 * @example
 * const userKeys = members.map(({ userKey }) => userKey);
 * epicenter.groupAdapter.removeUsers(userKeys)
 * @param userKey               Key associated with the user or an array of user keys to remove from group
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupKey]  Group key for the group you want to remove from; defaults to the group in the current session
 * @returns promise that resolves to undefined when successful
 */
export async function removeUser(
    userKey: string | string[],
    optionals: { groupKey?: string } & RoutingOptions = {},
): Promise<void> {
    const { groupKey, ...routingOptions } = optionals;
    const hasMultiple = Array.isArray(userKey) && userKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${userKey.length === 1 ? userKey[0] : userKey}`;
    const searchParams = hasMultiple ? { userKey } : undefined;
    const session = identification.session as UserSession;
    return await new Router()
        .withSearchParams(searchParams)
        .delete(`/group/member/${groupKey ?? session?.groupKey}${uriComponent}`, routingOptions)
        .then(({ body }) => body);
}


export async function statusUpdate(
    code: string,
    message: string,
    optionals: { groupKey?: string } & RoutingOptions = {},
): Promise<GroupReadOutView> {
    const { groupKey, ...routingOptions } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .patch(`/group/status/${groupKey ?? session?.groupKey}`, {
            body: { code, message },
            ...routingOptions,
        }).then(({ body }) => body);
}

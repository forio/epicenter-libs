import type { UserSession } from '../utils/identification';
import type { GenericSearchOptions } from '../utils/constants';
import type { RoutingOptions, Page } from '../utils/router';

import { Router, identification, parseFilterInput } from '../utils';


export interface Episode {
    name: string,
    episodeKey: string,
}

/**
 * Create an episode.
 * @example
 * epicenter.episodeAdapter.create('myEpisode', 'myGroupName', {
 *      runLimit: 20,
 *      draft: true,
 * });
 * @param name                  Episode name
 * @param groupName             Group to make the episode under
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.draft]     Flag to indicate the episode is a draft (intended when used for settings scoping)
 * @param [optionals.runLimit]  Optional argument to define the number of runs that can be made using this episode as the scope
 * @param [optionals.category]  Optional argument to allow for establishing episode hierarchies
 * @returns promise that resolves to the newly created episode
 */
export async function create(
    name: string,
    groupName: string,
    optionals: {
        draft?: boolean,
        runLimit?: number,
        category?: string,
    } & RoutingOptions = {},
): Promise<Episode> {
    const {
        draft, runLimit, category,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/episode/${groupName}`, {
            body: { name, draft, runLimit, category },
            ...routingOptions,
        }).then(({ body }) => body);
}

/**
 * Gets a specific episode.
 * @example
 * epicenter.episodeAdapter.get('000001796733eef0842f4d6d960997018a37');
 *
 * @param episodeKey    The episode key
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an episode
 */
export async function get(
    episodeKey: string,
    optionals: RoutingOptions = {},
): Promise<Episode> {
    return await new Router()
        .get(`/episode/${episodeKey}`, optionals)
        .then(({ body }) => body);
}

/**
 * Gets episodes.
 * @example
 * const filter = [
 *      'name|=one|two',                                            // searches only for episodes named 'one' or 'two'
 *      'draft=false',                                              // searches only for episodes that aren't drafts
 *      'created>=2022-01-03T20:30:53.054Z',                        // looks for any episodes created after Jan 3rd 2022
 *      // 'account.shortName=acme'                                 // specifies the account, intended for admin use
 *      // 'project.shortName=simulations'                          // specifies the project, intended for admin use
 *      // 'group.name=my-group-name',                              // specifies a group name, intended for admin use
 *      // 'group.groupKey=0000017dd3bf540e5ada5b1e058f08f20461',   // specifies a group key, intended for admin use
 * ];
 * epicenter.episodeAdapter.query({
 *      filter,
 *      sort: ['+episode.created'],     // sort all findings by the 'created' field (ascending)
 *      first: 3,                       // page should start with the 4th item found (will default to 0)
 *      max: 10,                        // page should only include the first 10 items
 * });
 * @param searchOptions             Search options for the query
 * @param [searchOptions.filter]    Filters for searching
 * @param [searchOptions.sort]      Sorting criteria
 * @param [searchOptions.first]     The starting index of the page returned
 * @param [searchOptions.max]       The number of entries per page
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a page of episodes
 */
export async function query(
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {},
): Promise<Page<Episode>> {
    const { filter, sort = [], first = 0, max } = searchOptions;

    return await new Router()
        .withSearchParams({
            filter: parseFilterInput(filter),
            sort: sort.join(';') || undefined,
            first, max,
        })
        .get('/episode/search', {
            paginated: true,
            ...optionals,
        })
        .then(({ body }) => body);
}

/**
 * Gets episodes based on a group key
 * @example
 * epicenter.episodeAdapter.withGroup('0000017dd3bf540e5ada5b1e058f08f20461');
 *
 * @param groupKey      The group key
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise resolving to a list of episodes
 */
export async function forGroup(
    groupKey: string,
    optionals: RoutingOptions = {},
): Promise<Episode[]> {
    return await new Router()
        .get(`/episode/in/${groupKey}`, optionals)
        .then(({ body }) => body);
}

/**
 * Gets episode based on group name and episode name
 * @example
 * epicenter.episodeAdapter.withName('myEpisodeName');
 * @param name                  The episode name
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName] Name of the group, if omitted will use the group name associated with the current session
 * @returns promise that resolves to an episode
 */
export async function withName(
    name: string,
    optionals: { groupName?: string } & RoutingOptions = {},
): Promise<Episode> {
    const {
        groupName,
        ...routingOptions
    } = optionals;

    const session = identification.session as UserSession;
    return await new Router()
        .get(`/episode/with/${groupName ?? session?.groupName}/${name}`, routingOptions)
        .then(({ body }) => body);
}

/**
 * Deletes an episode
 * @example
 * epicenter.episodeAdapter.remove('000001796733eef0842f4d6d960997018a3b');
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to undefined if successful
 */
export async function remove(
    episodeKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .delete(`/episode/${episodeKey}`, optionals)
        .then(({ body }) => body);
}

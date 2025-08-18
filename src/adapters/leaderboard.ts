import type { UserSession } from '../utils/identification';
import type { RoutingOptions } from '../utils/router';
import type { GenericScope, GenericSearchOptions } from '../utils/constants';

import { identification, Router } from '../utils';


interface Score {
    name: string,
    quantity: number,
}

interface Tag {
    label: string,
    content: string,
}

interface Leaderboard {
    lastUpdated: Date,
    scores: Score[],
    scope: { userKey?: string } & GenericScope,
    collection: string,
    tags: Tag[],
}


/**
 * Creates a leaderboard entry.
 * @example
 * import { leaderboardAdapter } from 'epicenter-libs';
 * const leaderboard = await leaderboardAdapter.update(
 *      'class-23-leaderboard',
 *      { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461' },
 *      [{ name: 'total', quantity: 20 }, { name: 'extraCredit', quantity: 2 }],
 *      { tags: [{ label: 'role', content: 'doctor' }] }
 * );
 * @param collection            Name of the leaderboard
 * @param scope                 Scope attached to the leaderboard entry; allows for scoping
 * @param scope.scopeBoundary   Can be a couple things, commonly group, project, episode, or world
 * @param scope.scopeKey        Key of the resource defined by the scope boundary
 * @param scope.userKey         User key for the user creating the entry, if omitted will use the one in current session
 * @param scores                List of score objects
 * @param scores[].name         Name of the score
 * @param scores[].quantity     Value of the score
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @params [optionals.tags]     Tags for the leaderboard entry, helps to provide another layer of scope if needed
 * @returns promise that resolves to the leaderboard entry created
 */
export async function update(
    collection: string,
    scope: { userKey?: string } & GenericScope,
    scores: Score[],
    optionals: {
      tags?: Tag[],
      allowChannel?: boolean,
    } & RoutingOptions = {}
): Promise<Leaderboard> {
    const { tags, allowChannel, ...routingOptions } = optionals;
    const { scopeBoundary, scopeKey, userKey } = scope;
    const session = identification.session as UserSession;
    return await new Router()
        .post('/leaderboard', {
            body: {
                scope: {
                    scopeBoundary,
                    scopeKey,
                    userKey: userKey ?? session?.userKey,
                },
                collection,
                scores,
                tags,
                allowChannel,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

/**
 * Gathers leaderboard information; not paginable (hence named 'list' and not 'query'). Technically there is no leader
 * @example
 * import { leaderboardAdapter } from 'epicenter-libs';
 * const leaderboard = await leaderboardAdapter.list('myLeaderboard', scope, {
 *      filter: [
 *          'tag.role=doctor',  // look for leaderboard entries tagged with role=doctor
 *          'score.total>0'     // where the users scored a total higher than 0
 *      ],
 *      sort: ['+score.total'], // sort results by 'total' in ascending order,
 *      first: 0,
 *      max: 20                 // retrieve only the first 20 entries
 * });
 * @param collection                Name of the leaderboard
 * @param scope                     Scope attached to the leaderboard entry; allows for scoping
 * @param scope.scopeBoundary       Can be a couple things, commonly group, project, episode, or world
 * @param scope.scopeKey            Key of the resource defined by the scope boundary
 * @param searchOptions             Search options for the query
 * @param [searchOptions.filter]    Filters for searching
 * @param [searchOptions.sort]      Sorting criteria
 * @param [searchOptions.first]     The starting index of the list returned
 * @param [searchOptions.max]       The maximum number of entries in the list
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to to a list of leaderboard entries
 */
export async function list(
    collection: string,
    scope: GenericScope,
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {}
): Promise<Leaderboard[]> {
    const { scopeBoundary, scopeKey } = scope;
    const { filter = [], sort = [], first, max } = searchOptions;
    const searchParams = {
        filter: filter.join(';') || undefined,
        sort: sort.join(';') || undefined,
        first, max,
    };

    return await new Router()
        .withSearchParams(searchParams)
        .get(`/leaderboard/${scopeBoundary}/${scopeKey}/${collection}`, optionals)
        .then(({ body }) => body);
}

export async function get(
    collection: string,
    scope: GenericScope,
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {}
): Promise<Leaderboard[]> {
    console.warn('DEPRECATION WARNING: leaderboardAdapter.get is deprecated and will be removed with the next release. Use leaderboardAdapter.list instead.');
    return await list(collection, scope, searchOptions, optionals);
}


/**
 * Returns the total count in the given collection
 * @example
 * import { leaderboardAdapter } from 'epicenter-libs';
 * const leaderboard = await leaderboardAdapter.getCount('myLeaderboard', scope, {
 *      filter: [
 *          'tag.role=doctor',  // look for leaderboard entries tagged with role=doctor
 *          'score.total>0'     // where the users scored a total higher than 0
 *      ],
 * });
 * @param collection                Name of the leaderboard
 * @param scope                     Scope attached to the leaderboard entry; allows for scoping
 * @param scope.scopeBoundary       Can be a couple things, commonly group, project, episode, or world
 * @param scope.scopeKey            Key of the resource defined by the scope boundary
 * @param searchOptions             Search options for the query
 * @param [searchOptions.filter]    Filters for searching
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the number of entries in hte leaderboard
 */
export async function getCount(
    collection: string,
    scope: GenericScope,
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {}
): Promise<number> {
    const { scopeBoundary, scopeKey } = scope;
    const { filter = [] } = searchOptions;
    const searchParams = {
        filter: filter.join(';') || undefined,
    };

    return await new Router()
        .withSearchParams(searchParams)
        .get(`/leaderboard/count/${scopeBoundary}/${scopeKey}/${collection}`, optionals)
        .then(({ body }) => body);
}
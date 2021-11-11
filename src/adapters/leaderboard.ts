import type { UserSession } from 'utils/identification';
import type { RoutingOptions, GenericSearchOptions } from 'utils/router';
import type { GenericScope } from 'utils/constants';

import { identification, Router } from 'utils';

/**
 * Leaderboard API adapter
 * @namespace leaderboardAdapter
 */

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
}


/**
 * Updates leaderboard information
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/leaderboard`
 *
 * @memberof leaderboardAdapter
 * @example
 *
 * import { leaderboardAdapter } from 'epicenter';
 * const leaderboard = await leaderboardAdapter.post();
 */
export async function update(
    collection: string,
    scores: Score[],
    scope: { userKey?: string } & GenericScope,
    optionals: {
        tags?: Tag[],
        userKey?: string,
    } & RoutingOptions = {}
): Promise<Leaderboard> {
    const { tags, ...routingOptions } = optionals;
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
                scores, tags,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

/**
 * Gathers leaderboard information; not pageable
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/leaderboard/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{COLLECTION}`
 *
 * @memberof leaderboardAdapter
 * @example
 *
 * import { leaderboardAdapter } from 'epicenter';
 * const leaderboard = await leaderboardAdapter.list('myLeaderboard', scope, {
 *      filter: [
 *          'tag.role=doctor',  // look for leaderboard entries tagged with role=doctor
 *          'score.total>0'     // where the users scored a total higher than 0
 *      ],
 *      sort: ['+score.total'], // sort results by 'total' in ascending order,
 *      first: 0,
 *      max: 20                 // retrieve only the first 20 entries
 * });
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
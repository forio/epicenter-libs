import { identification, Router } from 'utils/index';

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
    scope: GenericScope,
    optionals: {
        tags?: Tag[],
        userKey?: string,
    } & GenericAdapterOptions = {}
): Promise<Leaderboard> {
    const {
        tags, userKey,
        accountShortName, projectShortName, server,
    } = optionals;
    const { scopeBoundary, scopeKey } = scope;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post('/leaderboard', {
            body: {
                scope: {
                    scopeBoundary,
                    scopeKey,
                    userKey: userKey ?? identification.session?.userKey,
                },
                collection,
                scores, tags,
            },
        }).then(({ body }) => body);
}

/**
 * Gathers leaderboard information
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/leaderboard/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{COLLECTION}`
 *
 * @memberof leaderboardAdapter
 * @example
 *
 * import { leaderboardAdapter } from 'epicenter';
 * const leaderboard = await leaderboardAdapter.get('myLeaderboard', {
 *      filter: [
 *          'tag.role=doctor',  // look for leaderboard entries tagged with role=doctor
 *          'score.total>0'     // where the users scored a total higher than 0
 *      ],
 *      sort: ['+score.total'], // sort results by 'total' in ascending order,
 *      first: 0,
 *      max: 20                 // retrieve only the first 20 entries
 * });
 */
export async function get(
    collection: string,
    scope: GenericScope,
    optionals: GenericSearchOptions & GenericAdapterOptions = {}
): Promise<Leaderboard[]> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        filter = [], sort = [], first, max,
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
        .get(`/leaderboard/${scopeBoundary}/${scopeKey}/${collection}`)
        .then(({ body }) => body);
}
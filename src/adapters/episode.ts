import { identification, Router } from 'utils/index';

/**
 * Episode API adapters -- use this to create, update, delete, and manage your episodes
 * @namespace episodeAdapter
 */

interface Episode {
    episodeKey: string,
}

/**
 * Create an episode.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.create('myEpisode', 'myGroupName', {
 *      runLimit: 20,
 *      draft: true,
 * });
 * @param {string}  name                Episode name
 * @param {object}  groupName           Group to make the episode under
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */
export async function create(
    name: string,
    groupName: string,
    optionals: {
        draft?: boolean,
        runLimit?: number,
    } & RoutingOptions = {}
): Promise<Episode> {
    const {
        draft, runLimit,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/episode/${groupName}`, {
            ...routingOptions,
            body: { name, draft, runLimit },
        }).then(({ body }) => body);
}

/**
 * Gets episodes.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.get('123124141241);
 *
 * @param {string}  episodeKey          The episode key
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */
export async function get(
    episodeKey: string,
    optionals: RoutingOptions = {}
): Promise<Episode> {
    return await new Router()
        .get(`/episode/${episodeKey}`, optionals)
        .then(({ body }) => body);
}

/**
 * Gets episodes.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.get();
 * episodeAdapter.get({ episodeKey: 12321 });
 * episodeAdapter.get({ groupName: 'myGroupName', episodeName: 'myEpisodeName' });
 *
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */
export async function query(
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {}
): Promise<Page<Episode>> {
    const DEFAULT_MAX = 100;
    const { filter = [], sort = [], first = 0, max = DEFAULT_MAX } = searchOptions;

    return await new Router()
        .withSearchParams({
            filter: filter.join(';'),
            sort: sort.join(';'),
            first, max,
        })
        .get('/episode/search', {
            paginated: true,
            ...optionals,
        })
        .then(({ body }) => body);
}

/**
 * Gets episodes.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.withGroup('1231241342345');
 *
 * @param {string}  groupKey            The group key
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */
export async function forGroup(
    groupKey: string,
    optionals: RoutingOptions = {}
): Promise<Episode[]> {
    return await new Router()
        .get(`/episode/in/${groupKey}`, optionals)
        .then(({ body }) => body);
}

/**
 * Gets episode based on group name and episode name
 * Unsure where this would see use...
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * episodeAdapter.withName('myGroupName', 'myEpisodeName');
 *
 * @param {string}  groupName           The group name
 * @param {string}  episodeName         The episode name
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */
export async function withName(
    name: string,
    optionals: { groupName?: string } & RoutingOptions = {}
): Promise<Episode> {
    const {
        groupName,
        ...routingOptions
    } = optionals;
    return await new Router()
        .get(`/episode/with/${groupName ?? identification.session?.groupName}/${name}`, routingOptions)
        .then(({ body }) => body);
}

/**
 * Deletes an episode
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * import { episodeAdapter } from 'epicenter';
 * const episodeKey = 1234;
 * episodeAdapter.remove(episodeKey);
 *
 * @param {string}  episodeKey          Something meaningful about optionals
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */
export async function remove(
    episodeKey: string,
    optionals: RoutingOptions = {}
): Promise<void> {
    return await new Router()
        .delete(`/episode/${episodeKey}`, optionals)
        .then(({ body }) => body);
}

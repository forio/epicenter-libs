import { Router } from 'utils';

/**
 * Episode API adapters -- use this to create, update, delete, and manage your episodes
 * @namespace episodeAdapter
 */


/**
 * Create an episode.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * const { episodeAdapter } = epicenter;
 * episodeAdapter.create('myEpisode', 'myGroupName', {
 *      runLimit: 20,
 *      draft: true,
 * });
 * @param {string}  name                Episode name
 * @param {Object}  groupName           Group to make the episode under
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @returns {Object}                    Something meaningful about returns
 */
export async function create(name, groupName, optionals = {}) {
    const { accountShortName, projectShortName, draft, runLimit } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/episode/${groupName}`, {
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
 * const { episodeAdapter } = epicenter;
 * episodeAdapter.get('123124141241);
 *
 * @param {String}  episodeKey          The episode key
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @returns {Object}                    Something meaningful about returns
 */
export async function get(episodeKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/episode/${episodeKey}`)
        .then(({ body }) => body);
}

/**
 * Gets episodes.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * const { episodeAdapter } = epicenter;
 * episodeAdapter.get();
 * episodeAdapter.get({ episodeKey: 12321 });
 * episodeAdapter.get({ groupName: 'myGroupName', episodeName: 'myEpisodeName' });
 *
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @returns {Object}                    Something meaningful about returns
 */
export async function query(optionals = {}) {
    const {
        accountShortName, projectShortName,
        filter = [], sort = [], first = 0, max = 100,
    } = optionals;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({
            filter: filter.join(';'),
            sort: sort.join(';'),
            first, max,
        })
        .get('/episode/search')
        .then(({ body }) => body);
}

/**
 * Gets episodes.
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * const { episodeAdapter } = epicenter;
 * episodeAdapter.withGroup('1231241342345');
 *
 * @param {String}  groupKey            The group key
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @returns {Object}                    Something meaningful about returns
 */
export async function forGroup(groupKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/episode/in/${groupKey}`)
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
 * const { episodeAdapter } = epicenter;
 * episodeAdapter.withName('myGroupName', 'myEpisodeName');
 *
 * @param {String}  groupName           The group name
 * @param {String}  episodeName         The episode name
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @returns {Object}                    Something meaningful about returns
 */
export async function byName(groupName, episodeName, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/episode/with/${groupName}/${episodeName}`)
        .then(({ body }) => body);
}

/**
 * Deletes an episode
 *
 * TODO -- add meaningful text here
 * @memberof episodeAdapter
 * @example
 *
 * const { episodeAdapter } = epicenter;
 * const episodeKey = 1234;
 * episodeAdapter.remove(episodeKey);
 *
 * @param {String}  episodeKey          Something meaningful about optionals
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @returns {Object}                    Something meaningful about returns
 */
export async function remove(episodeKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/episode/${episodeKey}`)
        .then(({ body }) => body);
}

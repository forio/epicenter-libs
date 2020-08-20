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
 * episodeAdapter.get();
 * episodeAdapter.get({ episodeKey: 12321 });
 * episodeAdapter.get({ groupName: 'myGroupName', episodeName: 'myEpisodeName' });
 *
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @returns {Object}                    Something meaningful about returns
 */
export async function get(optionals = {}) {
    const { accountShortName, projectShortName, episodeKey, groupName, episodeName } = optionals;
    let uriComponent = '';
    if (episodeKey) uriComponent = `/${episodeKey}`;
    if (groupName && episodeName) uriComponent = `/with/${groupName}/${episodeName}`;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/episode${uriComponent}`)
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

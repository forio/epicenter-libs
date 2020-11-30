import { Router } from 'utils';

/**
 * Time API adapter -- handles getting the current server time
 * @namespace timeAdapter
 */

/**
 * Fetches the current server time
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/time`
 *
 * @memberof timeAdapter
 * @example
 *
 * import { worldAdapter } from 'epicenter';
 * const worlds = await worldAdapter.get();
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {string}                                The current server time, in ISO 8601 format
 */

export async function get(optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get('/time')
        .catch((error) => {
            if (error.status === 404) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}
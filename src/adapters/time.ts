import { Router } from 'utils/index';

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
 * import { timeAdapter } from 'epicenter';
 * const worlds = await timeAdapter.get();
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {string}                                The current server time, in ISO 8601 format
 */

const NOT_FOUND = 404;
export async function get(
    optionals: RoutingOptions = {}
):Promise<void | string> {
    return await new Router()
        .get('/time', optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}

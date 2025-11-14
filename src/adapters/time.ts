import type { RoutingOptions } from '../utils/router';

import Router from '../utils/router';


/**
 * Fetches the current server time
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/time`
 *
 * @example
 * import { timeAdapter } from 'epicenter-libs';
 * const serverTime = await timeAdapter.get();
 *
 * @param [optionals]                           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @returns promise that resolves to the current server time in ISO 8601 format, or undefined if not found
 */
const NOT_FOUND = 404;
export async function get(
    optionals: RoutingOptions = {},
): Promise<void | string> {
    return await new Router()
        .get('/time', optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}

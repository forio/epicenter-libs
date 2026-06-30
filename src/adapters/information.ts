import type { RoutingOptions } from '../utils/router';

import { Router } from '../utils';

export interface InformationReadOutView {
    gitCommit?: string;
}


/**
 * Retrieves build information for the current project deployment
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/information`
 *
 * @example
 * import { informationAdapter } from 'epicenter-libs';
 * const info = await informationAdapter.get();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to information about the deployment
 */
export async function get(
    optionals: RoutingOptions = {},
): Promise<InformationReadOutView> {
    return await new Router()
        .get('/information', {
            ...optionals,
        })
        .then(({ body }) => body);
}

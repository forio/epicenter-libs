import type { GenericScope } from '../utils/constants';
import type { RoutingOptions } from '../utils/router';

import Router from '../utils/router';

/**
 * Creates a matchmaker list; requires facilitator level authentication
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/matchmaker/udome/{NAME}`
 *
 * @example
 * import { matchmakerAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const list = await matchmakerAdapter.create('my-matchmaker', 2, {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * });
 *
 * @param name                  The name for the matchmaker list
 * @param partners              The number of partners each participant should be assigned
 * @param scope                 Scope associated with list
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the matchmaker list object
 */
export async function create(
    name: string,
    partners: number,
    scope: GenericScope,
    optionals: RoutingOptions = {},
): Promise<Record<string, unknown>> {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/matchmaker/udome/${name}`, {
            body: {
                scope,
                partners,
            },
        })
        .then(({ body }) => body);
}


/**
 * Changes the opened/closed status of a matchmaker list; requires facilitator level authentication
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/matchmaker/udome/{UDOME_KEY}`
 *
 * @example
 * import { matchmakerAdapter } from 'epicenter-libs';
 * const list = await matchmakerAdapter.edit('udomeKey123', true);
 *
 * @param udomeKey      The unique key for the targeted matchmaker list
 * @param closed        Whether the matchmaker list is open or closed
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the matchmaker list object
 */
export async function edit(
    udomeKey: string,
    closed: boolean,
    optionals: RoutingOptions = {},
): Promise<Record<string, unknown>> {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .put(`/matchmaker/udome/${udomeKey}`, {
            body: {
                closed,
            },
        })
        .then(({ body }) => body);
}


/**
 * Adds the user making the request to the matchmaker list provided that it is open; requires participant authentication
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/matchmaker/udome`
 *
 * @example
 * import { matchmakerAdapter } from 'epicenter-libs';
 * const list = await matchmakerAdapter.addUser('udomeKey123');
 *
 * @param udomeKey      The unique key for the targeted matchmaker list
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the matchmaker list object
 */
export async function addUser(
    udomeKey: string,
    optionals: RoutingOptions = {},
): Promise<Record<string, unknown>> {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch('/matchmaker/udome', {
            body: {
                udomeKey,
            },
        })
        .then(({ body }) => body);
}

const NOT_FOUND = 404;
/**
 * Gets a matchmaker list based on a udomeKey; requires participant level authentication
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/matchmaker/udome/{UDOME_KEY}`
 *
 * @example
 * import { matchmakerAdapter } from 'epicenter-libs';
 * const list = await matchmakerAdapter.get('udomeKey123');
 *
 * @param udomeKey      The unique key for the targeted matchmaker list
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the matchmaker list object, or undefined if not found
 */
export async function get(
    udomeKey: string,
    optionals: RoutingOptions = {},
): Promise<Record<string, unknown>> {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/matchmaker/udome/${udomeKey}`)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        })
        .then(({ body }) => body);
}


/**
 * Gets a matchmaker list based on name and scope; requires participant level authentication
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/matchmaker/udome/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{NAME}`
 *
 * @example
 * import { matchmakerAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const list = await matchmakerAdapter.byName('my-matchmaker', {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: 'GROUP_KEY',
 * });
 *
 * @param name                  The name of the matchmaker list
 * @param scope                 Scope associated with list
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the matchmaker list object, or undefined if not found
 */
export async function byName(
    name: string,
    scope: GenericScope,
    optionals: RoutingOptions = {},
): Promise<Record<string, unknown>> {
    const { accountShortName, projectShortName, server } = optionals;
    const { scopeBoundary, scopeKey } = scope;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/matchmaker/udome/${scopeBoundary}/${scopeKey}/${name}`)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        })
        .then(({ body }) => body);
}

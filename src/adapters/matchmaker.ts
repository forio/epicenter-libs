import type { GenericScope } from '../utils/constants';
import type { RoutingOptions } from '../utils/router';
import { Router } from '../utils';

/**
 * Creates a matchmaker list; Requires facilitator level authentication
 * @param name                              The name for the matchmaker list
 * @param partners                          The number of partners each participant should be assigned
 * @param scope                             Scope associated with list
 * @param scope.scopeBoundary               Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                    Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @returns {matchmakerListObject}
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
 * Changes the opened/closed status of a matchmaker list; Requires facilitator level authentication
 * @param udomeKey                          The unique key for the targeted matchmaker list
 * @param closed                            Whether the matchmaker list is open or closed
 * @returns {matchmakerListObject}
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
 * Adds the user making the request to the matchmaker list provided that it is open; requires partipant authentication
 * @param udomeKey                          The unique key for the targeted matchmaker list
 * @returns {matchmakerListObject}
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
 * Gets a matchmakerList based on a udomeKey; Requires participant level authentication
 * @param udomeKey                          The unique key for the targeted matchmaker list
 * @returns {matchmakerListObject}
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
 * Gets a matchmakerList based on name and scope; Requires participant level authentication
 * @param udomeKey                          The unique key for the targeted matchmaker list
 * @param scope                             Scope associated with list
 * @param scope.scopeBoundary               Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                    Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @returns {matchmakerListObject}
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

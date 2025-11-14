import type { Page, RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';

import Router from '../utils/router';

export interface Somebody {
    email: string;
    somebodyKey: string;
    scope: GenericScope;
    familyName?: string;
    givenName?: string;
}


/**
 * Adds somebody to an account; somebody is a person who is not a user, but whose information is used in a simulation; requires support level authentication
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/somebody`
 *
 * @example
 * import { somebodyAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const email = 'test@test.com';
 * const scope = {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * };
 * const somebody = await somebodyAdapter.create(email, scope, {
 *     givenName: 'Person',
 *     familyName: 'Family',
 * });
 *
 * @param email                         Email of the person being added
 * @param scope                         Scope associated with the somebody
 * @param scope.scopeBoundary           Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.givenName]         Given name of the person
 * @param [optionals.familyName]        Family name of the person
 * @returns promise that resolves to the newly created somebody object
 */

export async function create(
    email: string,
    scope: GenericScope,
    optionals: {
        givenName?: string;
        familyName?: string;
    } & RoutingOptions = {},
): Promise<Somebody> {
    const {
        givenName,
        familyName,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(
            '/somebody',
            {
                body: {
                    email,
                    givenName,
                    familyName,
                    scope,
                },
                ...routingOptions,
            },
        )
        .then(({ body }) => body);
}


/**
 * Gets a somebody by their key
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/somebody/{SOMEBODY_KEY}`
 *
 * @example
 * import { somebodyAdapter } from 'epicenter-libs';
 * const somebodyKey = '0000017dd3bf540e5ada5b1e058f08f20461';
 * const somebody = await somebodyAdapter.get(somebodyKey);
 *
 * @param somebodyKey   Key associated with the somebody
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the somebody object, or undefined if not found
 */
const NOT_FOUND = 404;
export async function get(
    somebodyKey: string,
    optionals: RoutingOptions = {},
): Promise<Somebody | undefined> {
    return await new Router()
        .get(`/somebody/${somebodyKey}`, optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}


/**
 * Gets all somebodies within a specific scope
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/somebody/in/{SCOPE_BOUNDARY}/{SCOPE_KEY}`
 *
 * @example
 * import { somebodyAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const scope = {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * };
 * const somebodies = await somebodyAdapter.inScope(scope, { first: 0, max: 100 });
 *
 * @param scope                 Scope associated with the somebodies
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.first]     Index of first result to return
 * @param [optionals.max]       Maximum number of results to return (max of 300; default of 300)
 * @returns promise that resolves to a page of somebody objects, or undefined if not found
 */
export async function inScope(
    scope: GenericScope,
    optionals: {
        first?: number;
        max?: number;
    } & RoutingOptions = {},
): Promise<Page<Somebody> | undefined> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        first,
        max,
        ...routingOptions
    } = optionals;
    const searchParams = {
        first, max,
    };
    return await new Router()
        .withSearchParams(searchParams)
        .get(`/somebody/in/${scopeBoundary}/${scopeKey}`, {
            paginated: true,
            ...routingOptions,
        })
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}


/**
 * Gets a somebody by their email within a specific scope
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/somebody/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{EMAIL}`
 *
 * @example
 * import { somebodyAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const scope = {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * };
 * const somebody = await somebodyAdapter.byEmail('test@test.com', scope);
 *
 * @param email                 Email of the somebody to retrieve
 * @param scope                 Scope associated with the somebody
 * @param scope.scopeBoundary   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the somebody object, or undefined if not found
 */
export async function byEmail(
    email: string,
    scope: GenericScope,
    optionals: RoutingOptions = {},
): Promise<Somebody | undefined> {
    const { scopeBoundary, scopeKey } = scope;
    return await new Router()
        .get(`/somebody/with/${scopeBoundary}/${scopeKey}/${email}`, optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}

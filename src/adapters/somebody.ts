import type { Page, RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';
import { Router } from '../utils';

export interface Somebody {
    email: string;
    somebodyKey: string;
    scope: GenericScope;
    familyName?: string;
    givenName?: string;
}

/**
 * Adds somebody to an account; somebody is a person who is not a user, but whose information is used in a simulation; requires support level authentication
 *
 * Base URL: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/somebody`
 *
 * @example
 * const email = 'test@test.com';
 * const optionals = {
 *      givenName: 'Person',
 *      familyName: 'Family',
 * }
 * const scope = {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: 'GROUP_KEY'
 * }
 * epicenter.somebodyAdapter.create(email, scope, optionals);
 *
 * @param {string}  email                           Email of the person being added
 * @param scope                                     Scope associated with your run
 * @param scope.scopeBoundary                       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                            Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.givenName]           Given name of new user
 * @param {string}  [optionals.familyName]          Family name of new user
 * @param {string}  [optionals.accountId]           Account Id of new user
 * @returns {somebodyObject}                        Returns a promise that resolves to the newly created somebody
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

export async function inScope(
    scope: GenericScope,
    optionals: {
        first?: number,
        max?: number, // max of 300; default of 300
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
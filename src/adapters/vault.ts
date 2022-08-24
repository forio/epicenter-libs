import type { UserSession } from '../utils/identification';
import type { RoutingOptions } from '../utils/router';
import type { GenericScope, GenericSearchOptions, Permit } from '../utils/constants';

import {
    identification, Router,
    ROLE, SCOPE_BOUNDARY,
} from '../utils';


export interface Vault<Items> {
    created: string,
    lastUpdated: string,
    mutationKey: string,
    address: unknown,
    scope: { userKey?: string } & GenericScope,
    name: string,
    permit: Permit,
    vaultKey: string,
    expiration: string,
    items?: Items,
    changed?: boolean
}

interface Items {
    set?: Record<string, unknown>,
    push?: Record<string, unknown>,
    pop?: Record<string, unknown>,
}

/**
 * Updates a vault,
 * @example
 * // Change the name of the first student object in the list of students in the vault to "Bob"
 * epicenter.vaultAdapter.update('00000166d59adcb0f497ddc1aad0270c0a62', { set: { 'students.0.name': 'Bob' } })
 * @param vaultKey      Vault key
 * @param items         Object with a set/push/pop field to update the vault with
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the vault
 */
export async function update(
    vaultKey: string,
    items: Items,
    optionals: { mutationKey?: string } & RoutingOptions = {},
): Promise<Vault<unknown>> {
    const {
        mutationKey,
        ...routingOptions
    } = optionals;

    return await new Router()
        .withSearchParams({ MutationKey: mutationKey })
        .put(`/vault/${vaultKey}`, {
            body: {
                set: items.set ?? {},
                push: items.push ?? {},
                pop: items.pop ?? {},
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

const NOT_FOUND = 404;
export async function get(
    vaultKey: string,
    optionals: RoutingOptions = {}
): Promise<Vault<unknown>> {
    return await new Router()
        .get(`/vault/${vaultKey}`, optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}


export async function withScope(
    name: string,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {}
): Promise<Vault<unknown>> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/vault/with/${scopeBoundary}/${scopeKey}${uriComponent}/${name}`, optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}

export async function byName(
    name: string,
    optionals: {
        groupName?: string,
        episodeName?: string,
        userKey?: string,
        includeEpisodes?: boolean,
    } & RoutingOptions = {}
): Promise<Vault<unknown>[]> {
    const {
        groupName, episodeName,
        userKey, includeEpisodes,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;

    const searchParams = {
        userKey,
        includeEpisodes,
    };

    return await new Router()
        .withSearchParams(searchParams)
        .get(`/vault/in/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}/${name}`, {
            ...routingOptions,
        })
        .then(({ body }) => body);
}

export async function remove(
    vaultKey: string,
    optionals: { mutationKey?: string } & RoutingOptions = {}
): Promise<void> {
    const {
        mutationKey,
        ...routingOptions
    } = optionals;
    return await new Router()
        .withSearchParams({ MutationKey: mutationKey })
        .delete(`/vault/${vaultKey}`, routingOptions)
        .then(({ body }) => body);
}

/**
 * Defines vault properties, used to create or modify a vault. Vault names are unique to within their scope.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/{COLLECTION_NAME}`
 *
 * @example
 * import { vaultAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * vaultAdapter.define('my-vault-name', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: 'GROUP_KEY'
 * });
 *
 * @param name                          Name of the vault
 * @param scope                         Scope associated with your run
 * @param scope.scopeBoundary           Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]               Optional key to scope the vault to a user
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @param [optionals.items]             Optional items parameter for updating vault contents
 * @param [optionals.items.set]         Sets a field in the vault, where `[name]: [value]`, send `[name]: null` to delete
 * @param [optionals.items.push]        Adds an item to a list in the vault, it the list does not exist it will create one
 * @param [optionals.items.pop]         Use to remove items lists in a vault; TODO: how to use is unclear, elucidate
 * @param [optionals.readLock]          Role allowed to read
 * @param [optionals.writeLock]         Role allowed to write
 * @param [optionals.ttlSeconds]        Life span of the vault -- default to null, minimum value of 1800 (30 minutes)
 * @param [optionals.mutationStrategy]  Setting a mutation strategy allows for the following behaviors: ALLOW - Is an upsert which means if the entry exists it will be updated with the items in the POST. DISALLOW - Is an insert which means that if the entry exists no changes will be made (the 'changed' flag will be false). ERROR - Is an insert and, if the entry exists, a conflict exception will be thrown. If the mutationStrategy is omitted, it will simply search by scope and name; updating if it exists, creating if not.
 * @returns the vault (created or modified) */
export async function define(
    name: string,
    scope: { userKey?: string } & GenericScope,
    optionals: {
        items?: Items,
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: string,
        mutationStrategy?: string,
    } & RoutingOptions = {}
): Promise<Vault<unknown>> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const {
        readLock, writeLock, items,
        ttlSeconds, mutationStrategy = '',
        ...routingOptions
    } = optionals;
    const { WORLD } = SCOPE_BOUNDARY;
    const { PARTICIPANT, USER } = ROLE;
    const defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;

    const searchParams = { mutationStrategy };

    return await new Router()
        .withSearchParams(searchParams)
        .post(`/vault/${name}`, {
            body: {
                scope: {
                    scopeBoundary,
                    scopeKey,
                    userKey,
                },
                permit: {
                    readLock: readLock || defaultLock,
                    writeLock: writeLock || defaultLock,
                },
                ttlSeconds,
                items,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}


export async function create(
    name: string,
    scope: { userKey?: string } & GenericScope,
    items: Items,
    optionals: {
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: string,
        mutationStrategy?: string,
    } & RoutingOptions = {}
): Promise<Vault<unknown>> {
    console.warn('DEPRECATION WARNING: vaultAdapter.create is deprecated and will be removed with the next release. Use vaultAdapter.define instead.');
    return await define(name, scope, { items, ...optionals });
}

export async function list(
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {}
): Promise<Vault<unknown>[]> {
    const { first, filter = [], max } = searchOptions;
    const searchParams = {
        filter: filter.join(';') || undefined,
        first, max,
    };

    return new Router()
        .withSearchParams(searchParams)
        .get('/vault/search', optionals)
        .then(({ body }) => body);
}

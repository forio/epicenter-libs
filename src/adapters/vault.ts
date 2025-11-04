import type { UserSession } from '../utils/identification';
import type { RoutingOptions } from '../utils/router';
import type { GenericScope, GenericSearchOptions, Permit, Address } from '../utils/constants';

import {
    identification,
    Router,
    ROLE,
    SCOPE_BOUNDARY,
    parseFilterInput,
} from '../utils';

// Generic type parameter for vault items structure
export type VaultItems = Record<string, unknown>;

export interface Vault<I extends VaultItems = VaultItems> {
    created: string;
    lastUpdated: string;
    mutationKey: string;
    address: Address;
    scope: { userKey?: string } & GenericScope;
    name: string;
    permit: Permit;
    vaultKey: string;
    expiration: string;
    items?: I;
    changed?: boolean;
}

export interface Items<I extends VaultItems = VaultItems> {
    set?: Partial<I>;
    push?: Partial<I>;
    pop?: Partial<I>;
}


/**
 * Updates a vault's items
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/{VAULT_KEY}`
 *
 * @example
 * import { vaultAdapter } from 'epicenter-libs';
 * // Change the name of the first student object in the list of students in the vault to "Bob"
 * vaultAdapter.update('00000166d59adcb0f497ddc1aad0270c0a62', { set: { 'students.0.name': 'Bob' } });
 *
 * @param vaultKey                  Vault key
 * @param items                     Object with a set/push/pop field to update the vault items with
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.mutationKey]   Mutation key for optimistic concurrency control
 * @returns promise that resolves to the vault
 */
export async function update<I extends VaultItems = VaultItems>(
    vaultKey: string,
    items: Items<I>,
    optionals: {
        mutationKey?: string;
    } & RoutingOptions = {},
): Promise<Vault<I>> {
    const {
        mutationKey,
        ...routingOptions
    } = optionals;

    return await new Router()
        .withSearchParams({ mutationKey: mutationKey })
        .put(`/vault/${vaultKey}`, {
            body: {
                set: items.set ?? {},
                push: items.push ?? {},
                pop: items.pop ?? {},
            },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Updates a vault's properties
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/{VAULT_KEY}`
 *
 * @example
 * import { vaultAdapter, ROLE } from 'epicenter-libs';
 * vaultAdapter.updateProperties('00000166d59adcb0f497ddc1aad0270c0a62', {
 *      allowChannel: true,
 *      permit: {
 *          readLock: ROLE.FACILITATOR,
 *          writeLock: ROLE.FACILITATOR,
 *      },
 *      ttlSeconds: 3600,
 * });
 *
 * @param vaultKey                      Vault key
 * @param update                        Object with properties to update
 * @param [update.mutationKey]          Mutation key for optimistic concurrency control
 * @param [update.allowChannel]         Opt into push notifications for this resource
 * @param [update.permit]               Permission settings for the vault
 * @param [update.ttlSeconds]           Time to live in seconds
 * @param [optionals]                   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the vault
 */
export async function updateProperties<I extends VaultItems = VaultItems>(
    vaultKey: string,
    update: {
        mutationKey?: string;
        allowChannel?: boolean;
        permit?: Permit;
        ttlSeconds?: number;
    },
    optionals: RoutingOptions = {},
): Promise<Vault<I>> {
    return await new Router()
        .patch(`/vault/${vaultKey}`, {
            body: {
                ...update,
            },
            ...optionals,
        }).then(({ body }) => body);
}


const NOT_FOUND = 404;

/**
 * Retrieves a vault by its vault key
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/{VAULT_KEY}`
 *
 * @example
 * import { vaultAdapter } from 'epicenter-libs';
 * const vault = await vaultAdapter.get('00000166d59adcb0f497ddc1aad0270c0a62');
 *
 * @param vaultKey      Vault key
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the vault, or undefined if not found
 */
export async function get<I extends VaultItems = VaultItems>(
    vaultKey: string,
    optionals: RoutingOptions = {},
): Promise<Vault<I>> {
    return await new Router()
        .get(`/vault/${vaultKey}`, optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}


/**
 * Retrieves a vault by name within a specific scope
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{VAULT_NAME}`
 *
 * @example
 * import { vaultAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const vault = await vaultAdapter.withScope('my-vault-name', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * });
 *
 * @param name                      Name of the vault
 * @param scope                     Scope associated with the vault
 * @param scope.scopeBoundary       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey            Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]           Optional key to scope the vault to a user
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the vault, or undefined if not found
 */
export async function withScope<I extends VaultItems = VaultItems>(
    name: string,
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {},
): Promise<Vault<I>> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/vault/with/${scopeBoundary}/${scopeKey}${uriComponent}/${name}`, optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}


/**
 * Retrieves all vaults with a specific name within a group or episode
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/in/{GROUP_NAME}/{VAULT_NAME}`
 *
 * @example
 * import { vaultAdapter } from 'epicenter-libs';
 * const vaults = await vaultAdapter.byName('my-vault-name', {
 *      groupName: 'my-group',
 *      episodeName: 'my-episode',
 *      includeEpisodes: true,
 * });
 *
 * @param name                          Name of the vault
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName]         Name of the group to search within. Defaults to the session user's group.
 * @param [optionals.episodeName]       Name of the episode to search within
 * @param [optionals.userKey]           Optional user key to filter vaults by user
 * @param [optionals.includeEpisodes]   Whether to include vaults from episodes within the group
 * @returns promise that resolves to an array of vaults with the specified name
 */
export async function byName<I extends VaultItems = VaultItems>(
    name: string,
    optionals: {
        groupName?: string;
        episodeName?: string;
        userKey?: string;
        includeEpisodes?: boolean;
    } & RoutingOptions = {},
): Promise<Vault<I>[]> {
    const {
        groupName,
        episodeName,
        userKey,
        includeEpisodes,
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


/**
 * Deletes a vault
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/{VAULT_KEY}`
 *
 * @example
 * import { vaultAdapter } from 'epicenter-libs';
 * await vaultAdapter.remove('00000166d59adcb0f497ddc1aad0270c0a62');
 *
 * @param vaultKey                  Vault key
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.mutationKey]   Mutation key for optimistic concurrency control
 * @returns promise that resolves to undefined when successful
 */
export async function remove(
    vaultKey: string,
    optionals: { mutationKey?: string } & RoutingOptions = {},
): Promise<void> {
    const {
        mutationKey,
        ...routingOptions
    } = optionals;
    return await new Router()
        .withSearchParams({ mutationKey: mutationKey })
        .delete(`/vault/${vaultKey}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Defines vault properties, used to create or modify a vault. Vault names are unique within their scope.
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
 * @param scope                         Scope associated with your vault
 * @param scope.scopeBoundary           Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]               Optional key to scope the vault to a user
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.items]             Optional items parameter for updating vault contents
 * @param [optionals.items.set]         Sets a field in the vault, where `[name]: [value]`, send `[name]: null` to delete
 * @param [optionals.items.push]        Adds an item to a list in the vault; if the list does not exist it will create one
 * @param [optionals.items.pop]         Use to remove items from lists in a vault
 * @param [optionals.readLock]          Role allowed to read
 * @param [optionals.writeLock]         Role allowed to write
 * @param [optionals.ttlSeconds]        Life span of the vault (defaults to null, minimum value of 1800 seconds / 30 minutes)
 * @param [optionals.mutationStrategy]  Setting a mutation strategy allows for the following behaviors: ALLOW - Is an upsert which means if the entry exists it will be updated with the items in the POST. DISALLOW - Is an insert which means that if the entry exists no changes will be made (the 'changed' flag will be false). ERROR - Is an insert and, if the entry exists, a conflict exception will be thrown. If the mutationStrategy is omitted, it will simply search by scope and name; updating if it exists, creating if not.
 * @param [optionals.allowChannel]      Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @returns promise that resolves to the vault (created or modified)
 */
export async function define<I extends VaultItems = VaultItems>(
    name: string,
    scope: { userKey?: string } & GenericScope,
    optionals: {
        items?: Items<I>;
        readLock?: keyof typeof ROLE;
        writeLock?: keyof typeof ROLE;
        ttlSeconds?: number;
        mutationStrategy?: string;
        allowChannel?: boolean;
    } & RoutingOptions = {},
): Promise<Vault<I>> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const {
        readLock,
        writeLock,
        items,
        ttlSeconds,
        mutationStrategy = 'ERROR',
        allowChannel,
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
                allowChannel,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * @deprecated Use vaultAdapter.define instead. This method will be removed in the next release.
 *
 * Creates a new vault with the specified name, scope, and items
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/{COLLECTION_NAME}`
 *
 * @example
 * import { vaultAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * vaultAdapter.create('my-vault-name', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: 'GROUP_KEY'
 * }, {
 *      set: { foo: 'bar' }
 * });
 *
 * @param name                          Name of the vault
 * @param scope                         Scope associated with your vault
 * @param scope.scopeBoundary           Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]               Optional key to scope the vault to a user
 * @param items                         Items to set, push, or pop in the vault
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]          Role allowed to read
 * @param [optionals.writeLock]         Role allowed to write
 * @param [optionals.ttlSeconds]        Life span of the vault -- default to null, minimum value of 1800 (30 minutes)
 * @param [optionals.mutationStrategy]  Mutation strategy: ALLOW (upsert), DISALLOW (insert without update), ERROR (insert with conflict exception if exists)
 * @returns promise that resolves to the created vault
 */
export async function create<I extends VaultItems = VaultItems>(
    name: string,
    scope: { userKey?: string } & GenericScope,
    items: Items<I>,
    optionals: {
        readLock?: keyof typeof ROLE;
        writeLock?: keyof typeof ROLE;
        ttlSeconds?: number;
        mutationStrategy?: string;
    } & RoutingOptions = {},
): Promise<Vault<I>> {
    console.warn('DEPRECATION WARNING: vaultAdapter.create is deprecated and will be removed with the next release. Use vaultAdapter.define instead.');
    return await define<I>(name, scope, { items, ...optionals });
}


/**
 * Searches for vaults that match the search options; not paginable (hence named 'list' and not 'query')
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/search`
 *
 * @example
 * import { vaultAdapter } from 'epicenter-libs';
 * vaultAdapter.list({
 *      filter: [
 *          'name|=vault-one|vault-two',                        // looks for any vaults with the names provided
 *          'scopeBoundary=WORLD',                              // looks for vaults scoped to a world
 *          'scopeKey=00000165ad4e6a3cd22b993340b963820239',    // used in conjunction with the scopeBoundary
 *      ],
 *      sort: ['+vault.created'],                               // sort all findings by the 'created' field (ascending)
 *      first: 3,                                               // page should start with the 4th item found (defaults to 0)
 *      max: 10,                                                // page should only include the first 10 items
 * }, {
 *      groupName: 'my-group-name',                             // search within a group
 * });
 *
 * @param searchOptions             Search options
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName]     Name of the group
 * @returns promise that resolves to an array of vaults that match the search options
 */
export async function list<I extends VaultItems = VaultItems>(
    searchOptions: GenericSearchOptions,
    optionals: { groupName?: string } & RoutingOptions = {},
): Promise<Vault<I>[]> {
    const { first, filter, max } = searchOptions;
    const searchParams = {
        filter: parseFilterInput(filter),
        first, max,
    };
    const {
        groupName,
        ...routingOptions
    } = optionals;

    return new Router()
        .withSearchParams(searchParams)
        .get(`/vault/search${groupName ? `/${groupName}` : ''}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Counts the number of vaults that match the search options
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/count`
 *
 * @example
 * import { vaultAdapter } from 'epicenter-libs';
 * vaultAdapter.count({
 *      filter: [
 *          'name|=vault-one|vault-two',                        // looks for any vaults with the names provided
 *          'scopeBoundary=WORLD',                              // looks for vaults scoped to a world
 *          'scopeKey=00000165ad4e6a3cd22b993340b963820239',    // used in conjunction with the scopeBoundary
 *      ],
 * }, {
 *      groupName: 'my-group-name',                             // search within a group
 * });
 *
 * @param searchOptions             Search options
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.groupName]     Name of the group
 * @returns promise that resolves to the number of vaults that match the search options
 */
export async function count(
    searchOptions: GenericSearchOptions,
    optionals: { groupName?: string } & RoutingOptions = {},
): Promise<number> {
    const { first, filter, max } = searchOptions;
    const searchParams = {
        filter: parseFilterInput(filter),
        first, max,
    };
    const {
        groupName,
        ...routingOptions
    } = optionals;

    return new Router()
        .withSearchParams(searchParams)
        .get(`/vault/count${groupName ? `/${groupName}` : ''}`, routingOptions)
        .then(({ body }) => body);
}

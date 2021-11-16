import type { UserSession } from 'utils/identification';
import type { RoutingOptions } from 'utils/router';
import type { GenericScope, Permit } from 'utils/constants';

import {
    identification, Router,
    ROLE, SCOPE_BOUNDARY,
} from 'utils';


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
    items: Items,
    changed?: boolean
}

/**
 * Updates a vault
 *
 * TODO -- add meaningful text here
 * @memberof vaultAdapter
 * @example
 *
 * import { vaultAdapter } from 'epicenter';
 * vaultAdapter.update
 *
 * @param {string}  vaultKey            Vault key
 * @param {object}  items               Object with a set/push field to update the vault with
 * @param {object}  [optionals={}]      Something meaningful about optionals
 * @returns {object}                    Something meaningful about returns
 */
export async function update(
    vaultKey: string,
    items: {
        set?: Record<string, unknown>,
        push?: Record<string, unknown>,
    },
    optionals: { mutationKey?: string } & RoutingOptions = {}
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
        groupName, episodeName, userKey, includeEpisodes,
        ...routingOptions
    } = optionals;
    const session = identification.session as UserSession;
    return await new Router()
        .withSearchParams({ userKey, includeEpisodes })
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
 * Creates a vault. Vault names are unique to within their scope.
 * If the vault already exists, it will not error -- instead, it will modify the existing vault.
 * TODO -- either rename this function to better match behavior or talk to David to change behavior
 * to better match the function name.
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/vault/{COLLECTION_NAME}`
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter, SCOPE_BOUNDARY } from 'epicenter';
 * runAdapter.create('model.py', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: '000001713a246b0b34b5b5d274c057a5b2a7'
 * });
 * @param {string}  name                            Name of the vault
 * @param {object}  scope                           Scope associated with your run
 * @param {string}  scope.scopeBoundary             Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}  scope.scopeKey                  Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}  items                           Defines the contents in the
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.readLock]            Role (character type)
 * @param {string}  [optionals.writeLock]           Role (chracter type)
 * @param {string}  [optionals.userKey]             Key of the user creating the run, should be `undefined` if it's a world run
 * @param {number}  [optionals.ttlSeconds]          Life span of the vault -- default to null, minimum value of 1800 (30 minutes)
 * @param {string}  [optionals.mutationKey]         Initial mutation key
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Newly created run
 */
export async function create(
    name: string,
    scope: { userKey?: string } & GenericScope,
    items: Record<string, unknown>,
    optionals: {
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: string,
        mutationKey?: string,
    } & RoutingOptions = {}
): Promise<Vault<unknown>> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const {
        readLock, writeLock,
        ttlSeconds, mutationKey,
        ...routingOptions
    } = optionals;
    const { WORLD } = SCOPE_BOUNDARY;
    const { PARTICIPANT, USER } = ROLE;
    const defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;

    return await new Router()
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
                mutationKey,
                items,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}



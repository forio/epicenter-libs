import { Router } from 'utils/index';
import { ROLE, SCOPE_BOUNDARY } from 'utils/constants';

interface CreateOptions extends GenericAdapterOptions {
    readLock?: keyof typeof ROLE,
    writeLock?: keyof typeof ROLE,
    userKey?: string,
    ttlSeconds?: string,
    mutationKey?: string,
}

/**
 * Episode API adapters -- use this to create, update, delete, and manage your episodes
 * @namespace vaultAdapter
 */


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
export async function update(vaultKey, items, optionals = {}) {
    const { accountShortName, projectShortName, mutationKey } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ MutationKey: mutationKey })
        .patch(`/vault/${vaultKey}`, {
            body: {
                set: items.set ?? {},
                push: items.push ?? {},
            },
        }).then(({ body }) => body);
}

export async function get(vaultKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/vault/${vaultKey}`)
        .catch((error) => {
            if (error.status === 404) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}

export async function getWithScope(name, scope, optionals = {}) {
    const { scopeBoundary, scopeKey } = scope;
    const { accountShortName, projectShortName, userKey } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/vault/with/${scopeBoundary}/${scopeKey}${uriComponent}/${name}`)
        .catch((error) => {
            if (error.status === 404) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}

export async function remove(vaultKey, optionals = {}) {
    const { accountShortName, projectShortName, mutationKey } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ MutationKey: mutationKey })
        .delete(`/vault/${vaultKey}`)
        .then(({ body }) => body);
}


/**
 * Creates a vault. Vault names are unique to within their scope
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
    scope: GenericScope,
    items: Record<string, unknown>,
    optionals: CreateOptions = {}
): Promise<Vault> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        readLock, writeLock,
        userKey, ttlSeconds, mutationKey,
        accountShortName, projectShortName,
    } = optionals;
    const { WORLD } = SCOPE_BOUNDARY;
    const { PARTICIPANT, USER } = ROLE;
    const defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
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
        }).then(({ body }) => body);
}


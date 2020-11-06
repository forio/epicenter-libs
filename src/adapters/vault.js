import { Router } from 'utils';
import { LOCK_TYPE, SCOPE_BOUNDARY } from 'utils/constants';

/**
 * Episode API adapters -- use this to create, update, delete, and manage your episodes
 * @namespace vaultAdapter
 */


/**
 * Create an episode.
 *
 * TODO -- add meaningful text here
 * @memberof vaultAdapter
 * @example
 *
 * import { vaultAdapter } from 'epicenter';
 * vaultAdapter.update
 *
 * @param {string}  vaultKey            Episode name
 * @param {object}  items               Group to make the episode under
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

export async function getWithScope(collection, scope, optionals = {}) {
    const { scopeBoundary, scopeKey } = scope;
    const { accountShortName, projectShortName } = optionals;
    const userKey = optionals.userKey ? `/${optionals.userKey}` : '';
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/vault/with/${scopeBoundary}/${scopeKey}${userKey}/${collection}`)
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

export async function create(collection, scope, items, optionals = {}) {
    const { scopeBoundary, scopeKey } = scope;
    const { accountShortName, projectShortName, readLock, writeLock, userKey } = optionals;
    const { WORLD } = SCOPE_BOUNDARY;
    const { PARTICIPANT, USER } = LOCK_TYPE;
    const defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/vault/${collection}`, {
            body: {
                scope: {
                    scopeBoundary,
                    scopeKey,
                    userKey: scopeBoundary === WORLD ? undefined : userKey,
                },
                permit: {
                    readLock: readLock || defaultLock,
                    writeLock: writeLock || defaultLock,
                },
                items,
            },
        }).then(({ body }) => body);

}


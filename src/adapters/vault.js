import { Router, identification } from 'utils';
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
 * const { vaultAdapter } = epicenter;
 * vaultAdapter.update
 *
 * @param {string}  vaultKey            Episode name
 * @param {Array}   items               Group to make the episode under
 * @param {Array}   mutationKey         Group to make the episode under
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @returns {Object}                    Something meaningful about returns
 */
export async function update(vaultKey, items, mutationKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ MutationKey: mutationKey })
        .patch(`/vault/${vaultKey}`, {
            body: { items },
        }).then(({ body }) => body);
}

export async function get(collection, name, scope, optionals = {}) {
    const { scopeBoundary, scopeKey } = scope;
    const { accountShortName, projectShortName } = optionals;
    const userKey = optionals.userKey ? `/${optionals.userKey}` : '';
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/vault${scopeBoundary}/${scopeKey}${userKey}/${collection}/${name}`)
        .then(({ body }) => body);
}

export async function remove(vaultKey, mutationKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ MutationKey: mutationKey })
        .delete(`/vault/${vaultKey}`)
        .then(({ body }) => body);
}

export async function create(collection, name, scope, items, optionals = {}) {
    const { scopeBoundary, scopeKey } = scope;
    const { accountShortName, projectShortName, readLock, writeLock } = optionals;
    const { WORLD } = SCOPE_BOUNDARY;
    const { PARTICIPANT, USER } = LOCK_TYPE;
    const defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;
    const userKey = scopeBoundary === WORLD ? undefined : identification.session.userKey;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/vault/${collection}/${name}`, {
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
                items,
            },
        }).then(({ body }) => body);

}


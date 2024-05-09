import type { Page, RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';
import type { User } from './user';

import {
    Router,
    identification,
} from '../utils';
import { UserSession } from 'epicenter';


interface Item {
    label: string,
    value: string | null,
}

interface Wallet {
    items: Item[],
    user: User,
    walletKey: string,
    scope: { userKey: string } & GenericScope,
}

/**
 * Updates a wallet
 * @example
 * // Add a user's phone number to their wallet
 * epicenter.walletAdapter.update(scope, [{ label: 'phone', value: '555-555-5555' }])
 * @param scope                 Scope attached to the wallet; userKey is required
 * @param scope.scopeBoundary   Can be a couple things, commonly group, project, episode, or world
 * @param scope.scopeKey        Key of the resource defined by the scope boundary
 * @param scope.userKey         User key for the user creating the entry, if omitted will use the one in current session
 * @param items                 List of items to update the wallet with
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the updated wallet
 */
export async function update(
    scope: { userKey: string | undefined } & GenericScope,
    items: Item[],
    optionals: RoutingOptions = {},
): Promise<Wallet> {
    const session = identification.session as UserSession;
    scope.userKey ??= session?.userKey;
    return await new Router()
        .post('/wallet', {
            body: {
                items,
                scope,
            },
            ...optionals,
        }).then(({ body }) => body);
}

const NOT_FOUND = 404;
/**
 * Gets a wallet
 * @example
 * // Get a user's wallet
 * const scope = { userKey, scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: groupKey };
 * epicenter.walletAdapter.get(scope)
 * @param scope                 Scope attached to the wallet; userKey is required
 * @param scope.scopeBoundary   Can be a couple things, commonly group, project, episode, or world
 * @param scope.scopeKey        Key of the resource defined by the scope boundary
 * @param scope.userKey         User key for the user creating the entry, if omitted will use the one in current session
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the wallet
 */
export async function get(
    scope: { userKey: string } & GenericScope,
    optionals: RoutingOptions = {}
): Promise<Wallet> {
    const { scopeBoundary, scopeKey } = scope;
    let { userKey } = scope;
    const session = identification.session as UserSession;
    userKey ??= session?.userKey;
    return await new Router()
        .get(`/wallet/${scopeBoundary}/${scopeKey}/${userKey}`, optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}

/**
 * Get all wallets under a certain scope
 * @example
 * // Get all wallets under a group
 * const scope = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: groupKey };
 * epicenter.walletAdapter.withScope(scope)
 * @param scope                 Scope attached to the wallets
 * @param scope.scopeBoundary   Can be a couple things, commonly group, project, episode, or world
 * @param scope.scopeKey        Key of the resource defined by the scope boundary
 * @param [optionals]           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a page of wallets
 */
export async function withScope(
    scope: GenericScope,
    optionals: {
        first?: number,
        max?: number,
    } & RoutingOptions = {}
): Promise<Page<Wallet>> {
    const { scopeBoundary, scopeKey } = scope;
    const { first = 0, max, ...routingOptions } = optionals;

    return await new Router()
        .withSearchParams({ first, max })
        .get(`/wallet/with/${scopeBoundary}/${scopeKey}`, routingOptions)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}

import type { RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';
import type { User } from './user';

import {
    Router,
    EpicenterError,
} from '../utils';


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
 * @param scope         Scope attached to the wallet; userKey is required
 * @param items         List of items to update the wallet with
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the updated wallet
 */
export async function update(
    scope: { userKey: string } & GenericScope,
    items: Item[],
    optionals: RoutingOptions = {},
): Promise<Wallet> {
    if (!scope.userKey) throw new EpicenterError('userKey is required in wallet scope');
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
 * @param scope     Scope attached to the wallet; userKey is required
 * @param optionals Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the wallet
 */
export async function get(
    scope: { userKey: string } & GenericScope,
    optionals: RoutingOptions = {}
): Promise<Wallet> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    if (!userKey) throw new EpicenterError('userKey is required in wallet scope');
    return await new Router()
        .get(`/wallet/${scopeBoundary}/${scopeKey}/${userKey}`, optionals)
        .catch((error) => {
            if (error.status === NOT_FOUND) return { body: undefined };
            return Promise.reject(error);
        }).then(({ body }) => body);
}

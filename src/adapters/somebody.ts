import type { GenericScope, GenericSearchOptions } from '../utils/constants';
import type { Page, RoutingOptions } from '../utils/router';
import { Router } from '../utils';

interface SomebodyCreateView {
    email: string,
    givenName?: string,
    familyName?: string,
}

export interface Somebody extends SomebodyCreateView {
    somebodyKey: string;
    scope: GenericScope;
}

/**
 * Create a new Somebody at the provided scope.
 * A somebody is a non-user individual whose information is used in the simulation.
 * For example, if your simulation is played by employees, you might store information
 * about each player's manager in a somebody.
 *
 * @example
 * somebodyAdapter.create('test@forio.com', { scopeBoundary: 'group', scopeKey: '000001796733eef0842f4d6d960997018a3b' });

 * @param email     The email address of the new Somebody
 * @param scope     The scope of the new Somebody
 * @param optionals Optional arguments; pass network call options overrides here.
 * @param [optionals.givenName] The given name of the new Somebody
 * @param [optionals.familyName] The family name of the new Somebody
 * @returns promise that resolves to the new Somebody
 */
export async function create(
    email: SomebodyCreateView['email'],
    scope: GenericScope,
    optionals: Omit<SomebodyCreateView, 'email'> & RoutingOptions = {}
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
                    scope,
                    givenName,
                    familyName,
                },
                ...routingOptions,
            }
        )
        .then(({ body }) => body);
}

/**
 * Get a Somebody by their key
 *
 * @example
 * somebodyAdapter.get('000001796733eef0842f4d6d960997018a3b');
 *
 * @param somebodyKey   Somebody key
 * @param optionals     Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the Somebody
 */
export async function get(
    somebodyKey: string,
    optionals: RoutingOptions = {}
): Promise<Somebody> {
    return await new Router()
        .get(`/somebody/${somebodyKey}`, optionals)
        .then(({ body }) => body);
}

/**
 * Get Somebodies at the provided scope
 *
 * @example
 * somebodyAdapter.list({ scopeBoundary: 'group', scopeKey: '000001796733eef0842f4d6d960997018a3b' });
 * somebodyAdapter.list({ scopeBoundary: 'group', scopeKey: '000001796733eef0842f4d6d960997018a3b' }, { first: 10, max: 20 });
 *
 * @param scope     The scope to query
 * @param optionals Optional arguments; pass network call options overrides here.
 * @param [optionals.first] The first item to return
 * @param [optionals.max] The maximum number of items to return
 * @returns promise that resolves to a page of Somebodies
 */
export async function list(
    scope: GenericScope,
    optionals: Pick<GenericSearchOptions, 'first' | 'max'> &
        RoutingOptions = {}
): Promise<Page<Somebody>> {
    const { scopeBoundary, scopeKey } = scope;
    const { first, max, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({ first, max })
        .get(`/somebody/in/${scopeBoundary}/${scopeKey}`, {
            paginated: true,
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Get a Somebody by their email address (unique per scope)
 *
 * @example
 * somebodyAdapter.byEmail('test@forio.com', { scopeBoundary: 'group', scopeKey: '000001796733eef0842f4d6d960997018a3b' });
 *
 * @param email     The email address of the Somebody
 * @param scope     The scope of the Somebody
 * @param optionals Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the Somebody
 */
export async function byEmail(
    email: string,
    scope: GenericScope,
    optionals: RoutingOptions = {}
): Promise<Somebody> {
    return await new Router()
        .get(`/somebody/with/${scope.scopeBoundary}/${scope.scopeKey}/${email}`, optionals)
        .then(({ body }) => body);
}
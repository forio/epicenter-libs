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
        max?: number, //max of 300; default of 300
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
import type { RoutingOptions } from 'utils/router';
import Router from 'utils/router';

export interface Secret {
    password: string;
}

export interface UserCreateView {
    [key: string]: unknown;
    handle: string;
    email?: string;
    givenName?: string;
    familyName?: string;
    active?: true;
}

export interface User {
    lastUpdated: string;
    displayName: string;
    givenName: string;
    familyName: string;
    handle: string;
    created: string;
    detail: Record<string, unknown>;
    userId: number;
    userKey: string;
    objectType: 'external' | 'native';
}

export interface UploadOptions extends RoutingOptions {
    groupKey?: string;
    overwrite?: boolean;
}

export interface NativeUserCreateView extends UserCreateView {
    objectType: 'native';
    secret: Secret;
}

export interface ExternalUserCreateView extends UserCreateView {
    objectType: 'external';
}

export type Modality = 'NONE' | 'HBP' | 'ICC' | 'SSO';

export async function uploadCSV(
    file: File,
    optionals: UploadOptions = {},
): Promise<void> {
    const {
        overwrite,
        ...routingOptions
    } = optionals;

    const formdata = new FormData();
    formdata.append('file', file);

    return await new Router()
        .withSearchParams({ overwrite })
        .post('/user/upload', {
            body: formdata,
            ...routingOptions,
        })
        .then(({ body }) => body);
}

export async function createUser(
    view: ExternalUserCreateView | NativeUserCreateView,
    optionals: RoutingOptions = {},
): Promise<User> {
    return await new Router()
        .post('/user', {
            body: view,
            ...optionals,
        })
        .then(({ body }) => body);
}

/**
 * Gets a specific user.
 * @example
 * epicenter.userAdapter.get('00000179b4d3fb0c84f822df8cd2aa53be25');
 *
 * @param userKey    The user key
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an user
 */
export async function get(
    userKey: string,
    optionals: RoutingOptions = {},
): Promise<User> {
    return await new Router()
        .get(`/user/${userKey}`, optionals)
        .then(({ body }) => body);
}

export async function getWithHandle(
    handle: string,
    optionals: {
        modality?: Modality;
    } & RoutingOptions = {},
): Promise<User> {
    const { modality, ...routingOptions } = optionals;
    const uriComponent = modality ? `/${modality}` : '';
    return await new Router()
        .get(`/user/with/${handle}${uriComponent}`, routingOptions)
        .then(({ body }) => body);
}

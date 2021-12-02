import type { RoutingOptions } from 'utils/router';
import Router from 'utils/router';

interface Secret {
    password: string;
}

export interface UserCreateView {
    [key: string]: unknown,
    handle: string;
    email?: string;
    givenName?: string;
    familyName?: string;
    active?: true;
}

export interface User {
    lastUpdated: string,
    displayName: string,
    givenName: string,
    familyName: string,
    handle: string,
    created: string,
    detail: Record<string, unknown>,
    userId: number,
    userKey: string,
    objectType: 'external' | 'native',
}

interface UploadOptions extends RoutingOptions {
    groupKey?: string,
    overwrite?: boolean,
}

export interface NativeUserCreateView extends UserCreateView {
    objectType: 'native';
    secret: Secret;
}

export interface ExternalUserCreateView extends UserCreateView {
    objectType: 'external';
}

export async function uploadCSV(
    file: File,
    optionals: UploadOptions = {}
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
    optionals: RoutingOptions = {}
): Promise<User> {
    return await new Router()
        .post('/user', {
            body: view,
            ...optionals,
        })
        .then(({ body }) => body);
}
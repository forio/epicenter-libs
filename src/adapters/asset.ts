import type { RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';

import fetch from 'cross-fetch';
import { Fault, Router, ROLE } from '../utils';

export interface AssetScope extends GenericScope {
    userKey?: string,
}

export interface Asset {
    file: string,
    address: {
        projectShortName: string,
        groupName: string,
        accountShortName: string,
        worldKey: string,
        episodeName: string,
    },
    scope: AssetScope,
}

export interface AssetTicket {
    url: string,
}


export async function create(
    file: string,
    scope: AssetScope,
    optionals: {
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: number,
    } & RoutingOptions = {},
): Promise<AssetTicket> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const {
        readLock, writeLock, ttlSeconds,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post('/asset', {
            body: {
                file,
                scope: {
                    scopeBoundary,
                    scopeKey,
                    userKey,
                },
                permit: {
                    readLock: readLock ?? ROLE.USER,
                    writeLock: writeLock ?? ROLE.USER,
                },
                ttlSeconds,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

export async function update(
    file: string,
    scope: AssetScope,
    optionals: {
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: number,
    } & RoutingOptions = {},
): Promise<AssetTicket> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const {
        readLock, writeLock, ttlSeconds,
        ...routingOptions
    } = optionals;
    return await new Router()
        .patch('/asset', {
            body: {
                file,
                scope: {
                    scopeBoundary,
                    scopeKey,
                    userKey,
                },
                permit: {
                    readLock: readLock ?? ROLE.USER,
                    writeLock: writeLock ?? ROLE.USER,
                },
                ttlSeconds,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

export async function remove(
    assetKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .delete(`/asset/${assetKey}`, optionals)
        .then(({ body }) => body);
}

export async function removeFromScope(
    scope: AssetScope,
    optionals: RoutingOptions = {},
): Promise<void> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .delete(`/asset/in/${scopeBoundary}/${scopeKey}${uriComponent}`, optionals)
        .then(({ body }) => body);
}

export async function get(
    assetKey: string,
    optionals: RoutingOptions = {},
): Promise<Asset> {
    const { server, accountShortName, projectShortName } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/asset/${assetKey}`)
        .then(({ body }) => body);
}

export async function list(
    scope: AssetScope,
    optionals: {
        filter?: string,
    } & RoutingOptions = {},
): Promise<Asset[]> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const {
        filter,
        ...routingOptions
    } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/asset/in/${scopeBoundary}/${scopeKey}${uriComponent}/${filter ?? '*'}`, routingOptions)
        .then(({ body }) => body);
}

export async function getURL(
    assetKey: string,
    optionals: RoutingOptions = {},
): Promise<string> {
    return await new Router()
        .get(`/asset/url/${assetKey}`, optionals)
        .then(({ body }) => body);
}

export async function getURLWithScope(
    file: string,
    scope: AssetScope,
    optionals: RoutingOptions = {},
): Promise<string> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/asset/url/with/${scopeBoundary}/${scopeKey}${uriComponent}/${file}`, optionals)
        .then(({ body }) => body);
}

export async function download(
    assetKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .get(`/asset/download/${assetKey}`, optionals)
        .then(({ body }) => body);
}

export async function downloadWithScope(
    file: string,
    scope: AssetScope,
    optionals: RoutingOptions = {},
): Promise<void> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/asset/download/with/${scopeBoundary}/${scopeKey}${uriComponent}/${file}`, optionals)
        .then(({ body }) => body);
}

const CONFLICT = 409;
export async function store(
    file: File,
    scope: AssetScope,
    optionals: {
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: number,
        overwrite?: boolean,
        fileName?: string,
    } & RoutingOptions = {},
): Promise<void> {
    const { overwrite, fileName, ...remaining } = optionals;
    const name = fileName ?? file.name;
    let presignedUrl = '';
    try {
        const response = await create(name, scope, {inert: true, ...remaining});
        presignedUrl = response.url;
    } catch (error) {
        if (error instanceof Fault) {
            const shouldUpdate = error.status === CONFLICT && overwrite;
            if (!shouldUpdate) throw error;
            const response = await update(name, scope, remaining);
            presignedUrl = response.url;
        } else {
            throw error;
        }
    }
    await fetch(presignedUrl, { method: 'PUT', body: file });
    return;
}
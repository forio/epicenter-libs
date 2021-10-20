import type { RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';

import fetch from 'cross-fetch';
import { Fault, Router, ROLE } from '../utils';


interface Asset {
    file: string,
    address: {
        projectShortName: string,
        groupName: string,
        accountShortName: string,
        worldKey: string,
        episodeName: string,
    },
    scope: GenericScope,
}

interface AssetTicket {
    url: string,
}


export async function create(
    file: string,
    scope: GenericScope,
    optionals: {
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: number,
        userKey?: string,
    } & RoutingOptions = {}
): Promise<AssetTicket> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        userKey, readLock, writeLock, ttlSeconds,
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
    scope: GenericScope,
    optionals: {
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: number,
        userKey?: string,
    } & RoutingOptions = {}
): Promise<AssetTicket> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        userKey, readLock, writeLock, ttlSeconds,
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
    optionals: RoutingOptions = {}
): Promise<void> {
    return await new Router()
        .delete(`/asset/${assetKey}`, optionals)
        .then(({ body }) => body);
}

export async function removeFromScope(
    scope: GenericScope,
    optionals: { userKey?: string } & RoutingOptions = {}
): Promise<void> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        userKey,
        ...routingOptions
    } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .delete(`/asset/in/${scopeBoundary}/${scopeKey}${uriComponent}`, routingOptions)
        .then(({ body }) => body);
}

export async function get(
    assetKey: string,
    optionals: RoutingOptions = {}
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
    scope: GenericScope,
    optionals: {
        userKey?: string,
        filter?: string,
    } & RoutingOptions = {}
): Promise<Asset[]> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        userKey, filter,
        ...routingOptions
    } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/asset/in/${scopeBoundary}/${scopeKey}${uriComponent}/${filter ?? '*'}`, routingOptions)
        .then(({ body }) => body);
}

export async function getURL(
    assetKey: string,
    optionals: RoutingOptions = {}
): Promise<string> {
    return await new Router()
        .get(`/asset/url/${assetKey}`, optionals)
        .then(({ body }) => body);
}

export async function getURLWithScope(
    file: string,
    scope: GenericScope,
    optionals: { userKey?: string } & RoutingOptions = {}
): Promise<string> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        userKey,
        ...routingOptions
    } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .get(`/asset/url/with/${scopeBoundary}/${scopeKey}${uriComponent}/${file}`, routingOptions)
        .then(({ body }) => body);
}

const CONFLICT = 409;
export async function store(
    file: File,
    scope: GenericScope,
    optionals: {
        readLock?: keyof typeof ROLE,
        writeLock?: keyof typeof ROLE,
        ttlSeconds?: number,
        overwrite?: boolean,
        fileName?: string,
        userKey?: string,
    } & RoutingOptions = {}
): Promise<void> {
    const { overwrite, fileName, ...remaining } = optionals;
    const name = fileName ?? file.name;
    let presignedUrl = '';
    try {
        const response = await create(name, scope, remaining);
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
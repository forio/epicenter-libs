import fetch from 'cross-fetch';
import { Router } from 'utils/index';
import { ROLE, SCOPE_BOUNDARY } from 'utils/constants';

interface Scope extends GenericScope {
    scopeBoundary: keyof typeof SCOPE_BOUNDARY,
}

interface Asset {
    file: string,
    address: {
        projectShortName: string,
        groupName: string,
        accountShortName: string,
        worldKey: string,
        episodeName: string,
    },
    scope: Scope,
}

interface AssetTicket {
    url: string,
}


interface AssetOptions extends GenericAdapterOptions {
    userKey?: string,
}

interface ListOptions extends AssetOptions {
    filter?: string,
}

interface CreateOptions extends AssetOptions {
    readLock?: keyof typeof ROLE,
    writeLock?: keyof typeof ROLE,
    ttlSeconds?: number,
}

interface StoreOptions extends CreateOptions {
    overwrite?: boolean,
    fileName?: string,
}

export async function create(
    file: string,
    scope: Scope,
    optionals: CreateOptions = {}
): Promise<AssetTicket> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        server, accountShortName, projectShortName,
        userKey, readLock, writeLock, ttlSeconds,
    } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
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
        }).then(({ body }) => body);
}

export async function update(
    file: string,
    scope: Scope,
    optionals: CreateOptions = {}
): Promise<AssetTicket> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        server, accountShortName, projectShortName,
        userKey, readLock, writeLock, ttlSeconds,
    } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
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
        }).then(({ body }) => body);
}

export async function remove(
    assetKey: string,
    optionals: GenericAdapterOptions = {}
): Promise<void> {
    const { server, accountShortName, projectShortName } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/asset/${assetKey}`)
        .then(({ body }) => body);
}

export async function removeFromScope(
    scope: Scope,
    optionals: AssetOptions = {}
): Promise<void> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        server, accountShortName, projectShortName,
        userKey,
    } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/asset/in/${scopeBoundary}/${scopeKey}${uriComponent}`)
        .then(({ body }) => body);
}

export async function get(
    assetKey: string,
    optionals: GenericAdapterOptions = {}
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
    scope: Scope,
    optionals: ListOptions = {}
): Promise<Asset[]> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        server, accountShortName, projectShortName,
        userKey, filter,
    } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/asset/in/${scopeBoundary}/${scopeKey}${uriComponent}/${filter ?? '*'}`)
        .then(({ body }) => body);
}

export async function getURL(
    assetKey: string,
    optionals: GenericAdapterOptions = {}
): Promise<string> {
    const { server, accountShortName, projectShortName } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/asset/url/${assetKey}`)
        .then(({ body }) => body);
}

export async function getURLWithScope(
    file: string,
    scope: Scope,
    optionals: AssetOptions = {}
): Promise<string> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        server, accountShortName, projectShortName,
        userKey,
    } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/asset/url/with/${scopeBoundary}/${scopeKey}${uriComponent}/${file}`)
        .then(({ body }) => body);
}

const CONFLICT = 409;
export async function store(
    file: File,
    scope: Scope,
    optionals: StoreOptions = {}
): Promise<void> {
    const { overwrite, fileName, ...remaining } = optionals;
    const name = fileName ?? file.name;
    let presignedUrl = '';
    try {
        const response = await create(name, scope, remaining);
        presignedUrl = response.url;
    } catch (error) {
        const shouldUpdate = error.status === CONFLICT && overwrite;
        if (!shouldUpdate) throw error;
        const response = await update(name, scope, remaining);
        presignedUrl = response.url;
    }
    await fetch(presignedUrl, { method: 'PUT', body: file });
    return;
}
import type { RoutingOptions } from '../utils/router';
import type { GenericScope, Address } from '../utils/constants';

import fetch from 'cross-fetch';
import { Fault, Router, ROLE } from '../utils';

export interface AssetScope extends GenericScope {
    userKey?: string;
}

export interface Asset {
    file: string;
    address: Address;
    scope: AssetScope;
}

export interface AssetTicket {
    url: string;
}


/**
 * Creates a presigned URL for uploading a file to S3
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset`
 *
 * @example
 * import { assetAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const ticket = await assetAdapter.create('myfile.pdf', {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * });
 *
 * @param file                              File path/name for the asset
 * @param scope                             Scope associated with the asset
 * @param scope.scopeBoundary               Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                    Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]                   User key to further scope the asset to a specific user
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]              Role allowed to read; defaults to USER
 * @param [optionals.writeLock]             Role allowed to write; defaults to USER
 * @param [optionals.ttlSeconds]            Time to live in seconds for the asset
 * @param [optionals.tokenAccessSeconds]    How long the presigned URL is valid for in seconds
 * @returns promise that resolves to an asset ticket containing the presigned upload URL
 */
export async function create(
    file: string,
    scope: AssetScope,
    optionals: {
        readLock?: keyof typeof ROLE;
        writeLock?: keyof typeof ROLE;
        ttlSeconds?: number;
        tokenAccessSeconds?: number;
    } & RoutingOptions = {},
): Promise<AssetTicket> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const {
        readLock,
        writeLock,
        ttlSeconds,
        tokenAccessSeconds,
        ...routingOptions
    } = optionals;
    return await new Router()
        .withSearchParams({ tokenAccessSeconds })
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


/**
 * Updates an existing asset and returns a presigned URL for uploading the new file to S3
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset`
 *
 * @example
 * import { assetAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const ticket = await assetAdapter.update('myfile.pdf', {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * });
 *
 * @param file                              File path/name for the asset
 * @param scope                             Scope associated with the asset
 * @param scope.scopeBoundary               Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                    Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]                   User key to further scope the asset to a specific user
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]              Role allowed to read; defaults to USER
 * @param [optionals.writeLock]             Role allowed to write; defaults to USER
 * @param [optionals.ttlSeconds]            Time to live in seconds for the asset
 * @param [optionals.tokenAccessSeconds]    How long the presigned URL is valid for in seconds
 * @returns promise that resolves to an asset ticket containing the presigned upload URL
 */
export async function update(
    file: string,
    scope: AssetScope,
    optionals: {
        readLock?: keyof typeof ROLE;
        writeLock?: keyof typeof ROLE;
        ttlSeconds?: number;
        tokenAccessSeconds?: number;
    } & RoutingOptions = {},
): Promise<AssetTicket> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const {
        readLock,
        writeLock,
        ttlSeconds,
        tokenAccessSeconds,
        ...routingOptions
    } = optionals;
    return await new Router()
        .withSearchParams({ tokenAccessSeconds })
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


/**
 * Deletes an asset by asset key
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/{ASSET_KEY}`
 *
 * @example
 * import { assetAdapter } from 'epicenter-libs';
 * await assetAdapter.remove('0000017dd3bf540e5ada5b1e058f08f20461');
 *
 * @param assetKey      The unique key for the asset
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the asset is deleted
 */
export async function remove(
    assetKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .delete(`/asset/${assetKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Deletes all assets within a given scope
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/in/{SCOPE_BOUNDARY}/{SCOPE_KEY}` or DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/in/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{USER_KEY}`
 *
 * @example
 * import { assetAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * await assetAdapter.removeFromScope({
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * });
 *
 * @param scope                     Scope associated with the assets to delete
 * @param scope.scopeBoundary       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey            Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]           User key to further scope the deletion to a specific user
 * @param [optionals]               Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when all assets in the scope are deleted
 */
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


/**
 * Retrieves asset metadata by asset key
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/{ASSET_KEY}`
 *
 * @example
 * import { assetAdapter } from 'epicenter-libs';
 * const asset = await assetAdapter.get('0000017dd3bf540e5ada5b1e058f08f20461');
 *
 * @param assetKey      The unique key for the asset
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the asset metadata
 */
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


/**
 * Lists all assets within a given scope, optionally filtered by file pattern
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/in/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{FILTER}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/in/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{USER_KEY}/{FILTER}`
 *
 * @example
 * import { assetAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * // List all assets in the scope
 * const assets = await assetAdapter.list({
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * });
 * // List only PDF files
 * const pdfs = await assetAdapter.list({
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * }, { filter: '*.pdf' });
 *
 * @param scope                     Scope associated with the assets
 * @param scope.scopeBoundary       Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey            Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]           User key to further scope the list to a specific user
 * @param [optionals]               Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.filter]        File pattern to filter assets (e.g., '*.pdf' for PDF files); defaults to '*' (all files)
 * @returns promise that resolves to a list of assets
 */
export async function list(
    scope: AssetScope,
    optionals: {
        filter?: string;
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


/**
 * Generates a presigned URL for accessing an asset
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/url/{ASSET_KEY}`
 *
 * @example
 * import { assetAdapter } from 'epicenter-libs';
 * const url = await assetAdapter.getURL('0000017dd3bf540e5ada5b1e058f08f20461');
 * // Use the url to access the asset
 *
 * @param assetKey                          The unique key for the asset
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.tokenAccessSeconds]    How long the presigned URL is valid for in seconds
 * @returns promise that resolves to the presigned URL
 */
export async function getURL(
    assetKey: string,
    optionals: {
        tokenAccessSeconds?: number;
    } & RoutingOptions = {},
): Promise<string> {
    const { tokenAccessSeconds, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({ tokenAccessSeconds })
        .get(`/asset/url/${assetKey}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Generates a presigned URL for accessing an asset by scope and file name
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/url/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{FILE}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/url/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{USER_KEY}/{FILE}`
 *
 * @example
 * import { assetAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const url = await assetAdapter.getURLWithScope('myfile.pdf', {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * });
 *
 * @param file                              File path/name for the asset
 * @param scope                             Scope associated with the asset
 * @param scope.scopeBoundary               Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                    Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]                   User key to further scope the asset to a specific user
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.tokenAccessSeconds]    How long the presigned URL is valid for in seconds
 * @returns promise that resolves to the presigned URL
 */
export async function getURLWithScope(
    file: string,
    scope: AssetScope,
    optionals: {
        tokenAccessSeconds?: number;
    } & RoutingOptions = {},
): Promise<string> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const { tokenAccessSeconds, ...routingOptions } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .withSearchParams({ tokenAccessSeconds })
        .get(`/asset/url/with/${scopeBoundary}/${scopeKey}${uriComponent}/${file}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Downloads an asset by asset key
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/download/{ASSET_KEY}`
 *
 * @example
 * import { assetAdapter } from 'epicenter-libs';
 * await assetAdapter.download('0000017dd3bf540e5ada5b1e058f08f20461');
 *
 * @param assetKey                          The unique key for the asset
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.tokenAccessSeconds]    How long the presigned URL is valid for in seconds
 * @returns promise that resolves when the download is complete
 */
export async function download(
    assetKey: string,
    optionals: {
        tokenAccessSeconds?: number;
    } & RoutingOptions = {},
): Promise<void> {
    const { tokenAccessSeconds, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({ tokenAccessSeconds })
        .get(`/asset/download/${assetKey}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Downloads an asset by scope and file name
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/download/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{FILE}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/asset/download/with/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{USER_KEY}/{FILE}`
 *
 * @example
 * import { assetAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * await assetAdapter.downloadWithScope('myfile.pdf', {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * });
 *
 * @param file                              File path/name for the asset
 * @param scope                             Scope associated with the asset
 * @param scope.scopeBoundary               Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                    Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]                   User key to further scope the asset to a specific user
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.tokenAccessSeconds]    How long the presigned URL is valid for in seconds
 * @returns promise that resolves when the download is complete
 */
export async function downloadWithScope(
    file: string,
    scope: AssetScope,
    optionals: {
        tokenAccessSeconds?: number;
    } & RoutingOptions = {},
): Promise<void> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const { tokenAccessSeconds, ...routingOptions } = optionals;
    const uriComponent = userKey ? `/${userKey}` : '';
    return await new Router()
        .withSearchParams({ tokenAccessSeconds })
        .get(`/asset/download/with/${scopeBoundary}/${scopeKey}${uriComponent}/${file}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Convenience function to store a file directly to S3. This function obtains a presigned URL from the Epicenter server and uploads the file to S3. If the asset already exists and `overwrite` is true, it will update the existing asset.
 *
 * @example
 * import { assetAdapter, SCOPE_BOUNDARY, ROLE } from 'epicenter-libs';
 * const file = new File(['content'], 'myfile.pdf');
 * await assetAdapter.store(file, {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * }, {
 *     overwrite: true,
 *     readLock: ROLE.USER,
 * });
 *
 * @param file                              File object to store
 * @param scope                             Scope associated with the asset
 * @param scope.scopeBoundary               Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                    Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]                   User key to further scope the asset to a specific user
 * @param [optionals]                       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]              Role allowed to read; defaults to USER
 * @param [optionals.writeLock]             Role allowed to write; defaults to USER
 * @param [optionals.ttlSeconds]            Time to live in seconds for the asset
 * @param [optionals.overwrite]             If true, will update the asset if it already exists; if false, will throw an error if the asset exists
 * @param [optionals.fileName]              Optional file name to use instead of the file's name property
 * @param [optionals.tokenAccessSeconds]    How long the presigned URL is valid for in seconds
 * @returns promise that resolves when the file is stored
 */
const CONFLICT = 409;
export async function store(
    file: File,
    scope: AssetScope,
    optionals: {
        readLock?: keyof typeof ROLE;
        writeLock?: keyof typeof ROLE;
        ttlSeconds?: number;
        overwrite?: boolean;
        fileName?: string;
        tokenAccessSeconds?: number;
    } & RoutingOptions = {},
): Promise<void> {
    const { overwrite, fileName, ...remaining } = optionals;
    const name = fileName ?? file.name;
    let presignedUrl = '';
    try {
        const response = await create(name, scope, { inert: true, ...remaining });
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

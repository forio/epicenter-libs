import type { RoutingOptions } from '../utils/router';

import { Router } from '../utils';


export interface FileEntry {
    objectType: 'file';
    name?: string;
    lastModifiedTime?: string;
    size?: number;
    contentType?: string;
}

export interface DirectoryEntry {
    objectType: 'directory';
    name?: string;
    lastModifiedTime?: string;
    children?: FileSystemEntry[];
}

export type FileSystemEntry = FileEntry | DirectoryEntry;


/**
 * Lists files and directories at the project root or at a specific path.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file[/{filePath}]`
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * // List all files at root
 * const entries = await fileAdapter.list();
 * // List contents of a specific directory up to 2 levels deep
 * const entries = await fileAdapter.list('src', { depth: 2 });
 *
 * @param [filePath]        Path to a file or directory; omit to list the project root
 * @param [optionals]       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.depth] Maximum depth of directory traversal to include in the response
 * @returns promise that resolves to an array of file and directory entries
 */
export async function list(
    filePath?: string,
    optionals: {
        depth?: number;
    } & RoutingOptions = {},
): Promise<FileSystemEntry[]> {
    const { depth, ...routingOptions } = optionals;
    const uriComponent = filePath ? `/${filePath}` : '';
    return await new Router()
        .withSearchParams({ depth })
        .get(`/file${uriComponent}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Uploads and replaces files at the project root or at a specific path using multipart/form-data (PUT).
 * Use this when you want to overwrite existing files. For creating new files, use `create`.
 * Base URL: PUT `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file[/{filePath}]`
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * const formData = new FormData();
 * formData.append('file', myFile);
 * const uploaded = await fileAdapter.upload(formData, 'models/model.py');
 *
 * @param formData          Multipart form data containing the file(s) to upload
 * @param [filePath]        Destination path for the file(s); omit to upload to the project root
 * @param [optionals]       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an array of the uploaded file entries
 */
export async function upload(
    formData: FormData,
    filePath?: string,
    optionals: RoutingOptions = {},
): Promise<FileEntry[]> {
    const uriComponent = filePath ? `/${filePath}` : '';
    return await new Router()
        .put(`/file${uriComponent}`, {
            body: formData,
            ...optionals,
        }).then(({ body }) => body);
}


/**
 * Creates new files at the project root or at a specific path using multipart/form-data (POST).
 * Use this when creating new files. For overwriting existing files, use `upload`.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file[/{filePath}]`
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * const formData = new FormData();
 * formData.append('file', myFile);
 * const created = await fileAdapter.create(formData, 'models/model.py');
 *
 * @param formData          Multipart form data containing the file(s) to create
 * @param [filePath]        Destination path for the file(s); omit to create at the project root
 * @param [optionals]       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an array of the created file entries
 */
export async function create(
    formData: FormData,
    filePath?: string,
    optionals: RoutingOptions = {},
): Promise<FileEntry[]> {
    const uriComponent = filePath ? `/${filePath}` : '';
    return await new Router()
        .post(`/file${uriComponent}`, {
            body: formData,
            ...optionals,
        }).then(({ body }) => body);
}


/**
 * Deletes a file or directory at the project root or at a specific path.
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file[/{filePath}]`
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * // Delete a specific file
 * await fileAdapter.remove('models/old-model.py');
 * // Delete all files at the project root
 * await fileAdapter.remove();
 *
 * @param [filePath]    Path of the file or directory to delete; omit to delete all files at the project root
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the deletion is complete
 */
export async function remove(
    filePath?: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    const uriComponent = filePath ? `/${filePath}` : '';
    return await new Router()
        .delete(`/file${uriComponent}`, optionals)
        .then(({ body }) => body);
}


/**
 * Downloads the raw content of a file at the specified path.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file/download/{filePath}`
 *
 * NOTE: The backend streams the file with its detected content type (e.g. `application/zip`,
 * `text/plain`, `application/octet-stream`). The shared Router throws when the response
 * content-type is not `application/json`, so this call only succeeds for JSON files. To download
 * other file types, use the underlying fetch API directly against the constructed URL.
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * const content = await fileAdapter.download('config.json');
 *
 * @param filePath          Path to the file to download
 * @param [optionals]       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.depth] Currently unused on the backend; reserved for future expansion.
 * @returns promise that resolves to the raw file content
 */
export async function download(
    filePath: string,
    optionals: {
        depth?: number;
    } & RoutingOptions = {},
): Promise<unknown> {
    const { depth, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({ depth })
        .get(`/file/download/${filePath}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Lists files and directories matching a glob filter pattern, optionally scoped to a specific path.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file/filter/{filter}[/{filePath}]`
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * // List all Python files in the project
 * const pyFiles = await fileAdapter.listByFilter('*.py');
 * // List all Python files within the 'models' directory
 * const pyFiles = await fileAdapter.listByFilter('*.py', 'models');
 *
 * @param filter            Glob pattern to filter files by (e.g., '*.py', '*.json')
 * @param [filePath]        Directory path to scope the filter to; omit to search the entire project
 * @param [optionals]       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.depth] Maximum depth of directory traversal to include in the response
 * @returns promise that resolves to an array of matching file and directory entries
 */
export async function listByFilter(
    filter: string,
    filePath?: string,
    optionals: {
        depth?: number;
    } & RoutingOptions = {},
): Promise<FileSystemEntry[]> {
    const { depth, ...routingOptions } = optionals;
    const uriComponent = filePath ? `/${filePath}` : '';
    return await new Router()
        .withSearchParams({ depth })
        .get(`/file/filter/${filter}${uriComponent}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Compresses files into a ZIP archive at the project root or at a specific path.
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file/compress[/{filePath}]`
 *
 * NOTE: The backend streams the resulting archive with content-type `application/zip`. The
 * shared Router throws when the response content-type is not `application/json`, so this call
 * will not return the archive bytes through the normal flow. To retrieve the archive, use the
 * underlying fetch API directly against the constructed URL.
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * // Compress a specific file or directory
 * await fileAdapter.compress('models');
 * // Compress at root
 * await fileAdapter.compress();
 *
 * @param [filePath]    Path of the file or directory to compress; omit to compress at the project root
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the compression result
 */
export async function compress(
    filePath?: string,
    optionals: RoutingOptions = {},
): Promise<unknown> {
    const uriComponent = filePath ? `/${filePath}` : '';
    return await new Router()
        .patch(`/file/compress${uriComponent}`, optionals)
        .then(({ body }) => body);
}


/**
 * Extracts (explodes) a ZIP archive at the project root or at a specific path in place,
 * deleting the archive after extraction.
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file/explode[/{filePath}]`
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * // Extract a specific archive
 * await fileAdapter.explode('archive.zip');
 * // Explode at root
 * await fileAdapter.explode();
 *
 * @param [filePath]    Path of the archive to extract; omit to extract at the project root
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the extraction is complete
 */
export async function explode(
    filePath?: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    const uriComponent = filePath ? `/${filePath}` : '';
    return await new Router()
        .patch(`/file/explode${uriComponent}`, optionals)
        .then(({ body }) => body);
}


/**
 * Moves a file or directory from one path to another within the project.
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file/move`
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * await fileAdapter.move('models/old-name.py', 'models/new-name.py');
 * // Move and include the origin directory itself
 * await fileAdapter.move('old-dir', 'new-dir', { includeOrigin: true });
 *
 * @param origin                Origin path of the file or directory to move
 * @param destination           Destination path to move the file or directory to
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.includeOrigin] Whether to include the origin directory itself in the move
 * @returns promise that resolves when the move is complete
 */
export async function move(
    origin: string,
    destination: string,
    optionals: {
        includeOrigin?: boolean;
    } & RoutingOptions = {},
): Promise<void> {
    const { includeOrigin, ...routingOptions } = optionals;
    return await new Router()
        .patch('/file/move', {
            body: {
                origin,
                destination,
                includeOrigin,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Creates a new directory at the specified path.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/file/directory/{filePath}`
 *
 * @example
 * import { fileAdapter } from 'epicenter-libs';
 * const dir = await fileAdapter.createDirectory('models/new-folder');
 *
 * @param filePath      Path at which to create the new directory
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the created directory entry
 */
export async function createDirectory(
    filePath: string,
    optionals: RoutingOptions = {},
): Promise<DirectoryEntry> {
    return await new Router()
        .post(`/file/directory/${filePath}`, optionals)
        .then(({ body }) => body);
}

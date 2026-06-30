import type { RoutingOptions } from '../utils/router';

import Router from '../utils/router';

export type TranslatorFormat = 'ASCIIDOC' | 'ASCIIDOC_TO_HTML' | 'OPENAPI';

export interface DocumentedParameter {
    name: string;
    type: object;
    source: 'PATH' | 'HEADER' | 'QUERY' | 'MATRIX';
}

export interface DocumentedEndpoint {
    response: object;
    method: 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
    authorization: 'SYSTEM' | 'DASHBOARD' | 'OWNER' | 'AUTHOR' | 'SUPPORT' | 'REVIEWER' | 'FACILITATOR' | 'LEADER' | 'PARTICIPANT' | 'ANONYMOUS';
    path: string;
    summary?: string;
    paged?: boolean;
    notations?: ('POST_RATHER_THAN_GET')[];
    deprecated?: boolean;
    description?: string;
    body?: object;
    produces?: unknown[];
    parameters?: DocumentedParameter[];
    consumes?: unknown[];
}

export interface DocumentedResource {
    silenced?: boolean;
    endpoints?: DocumentedEndpoint[];
    definitions?: object;
}

export interface KnownService {
    name?: string;
    development?: boolean;
    trusted?: boolean;
    published?: boolean;
}


/**
 * Lists all known API services for a given version.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/encyclopedia/v{VERSION}`
 *
 * @example
 * import { encyclopediaAdapter } from 'epicenter-libs';
 * const services = await encyclopediaAdapter.list(1);
 *
 * @param version       The API version number
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a list of known services
 */
export async function list(
    version: number,
    optionals: RoutingOptions = {},
): Promise<KnownService[]> {
    return await new Router()
        .get(`/encyclopedia/v${version}`, optionals)
        .then(({ body }) => body);
}


/**
 * Gets documentation for a specific API.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/encyclopedia/v{VERSION}/{API}`
 *
 * @example
 * import { encyclopediaAdapter } from 'epicenter-libs';
 * const docs = await encyclopediaAdapter.get(1, 'run');
 *
 * @param version       The API version number
 * @param api           The API name to get documentation for
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the documented resource
 */
export async function get(
    version: number,
    api: string,
    optionals: RoutingOptions = {},
): Promise<DocumentedResource> {
    return await new Router()
        .get(`/encyclopedia/v${version}/${api}`, optionals)
        .then(({ body }) => body);
}


/**
 * Gets translated documentation for a specific API in a given format.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/encyclopedia/as/{TRANSLATOR}/v{VERSION}/{API}`
 *
 * @example
 * import { encyclopediaAdapter } from 'epicenter-libs';
 * await encyclopediaAdapter.translate(1, 'run', 'OPENAPI');
 *
 * @param version       The API version number
 * @param api           The API name to get documentation for
 * @param translator    The output format: 'ASCIIDOC', 'ASCIIDOC_TO_HTML', or 'OPENAPI'
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the translation is complete (204 no content)
 */
export async function translate(
    version: number,
    api: string,
    translator: TranslatorFormat,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .get(`/encyclopedia/as/${translator}/v${version}/${api}`, optionals)
        .then(({ body }) => body);
}

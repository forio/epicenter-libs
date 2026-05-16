import type { RoutingOptions } from '../utils/router';

import { Router } from '../utils';


export type EncyclopediaTranslator = 'ASCIIDOC' | 'ASCIIDOC_TO_HTML' | 'OPENAPI';

export type DocumentedEndpointMethod = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';

export type DocumentedEndpointAuthorization = 'SYSTEM' | 'DASHBOARD' | 'OWNER' | 'AUTHOR' | 'SUPPORT' | 'REVIEWER' | 'FACILITATOR' | 'LEADER' | 'PARTICIPANT' | 'ANONYMOUS';

export type DocumentedEndpointNotation = 'POST_RATHER_THAN_GET' | 'UNSUPPORTED_IGNORED';

export type DocumentedParameterSource = 'PATH' | 'HEADER' | 'QUERY' | 'MATRIX';

export interface DocumentedParameter {
    name?: string;
    source?: DocumentedParameterSource;
    type?: Record<string, unknown>;
}

export interface DocumentedEndpoint {
    method?: DocumentedEndpointMethod;
    path?: string;
    authorization?: DocumentedEndpointAuthorization;
    response?: Record<string, unknown>;
    summary?: string;
    description?: string;
    deprecated?: boolean;
    paged?: boolean;
    notations?: DocumentedEndpointNotation[];
    body?: Record<string, unknown>;
    parameters?: DocumentedParameter[];
    produces?: unknown[];
    consumes?: unknown[];
}

export interface DocumentedResource {
    silenced?: boolean;
    endpoints?: DocumentedEndpoint[];
    definitions?: Record<string, unknown>;
}

export interface KnownServiceReadOutView {
    name?: string;
    development?: boolean;
    trusted?: boolean;
    published?: boolean;
}


/**
 * Lists the known API services available for the given encyclopedia version.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/encyclopedia/v{version}`
 *
 * @example
 * import { encyclopediaAdapter } from 'epicenter-libs';
 * const services = await encyclopediaAdapter.listServices(1);
 *
 * @param version       Encyclopedia version number (minimum: 1)
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to an array of known service descriptors
 */
export async function listServices(
    version: number,
    optionals: RoutingOptions = {},
): Promise<KnownServiceReadOutView[]> {
    return await new Router()
        .get(`/encyclopedia/v${version}`, optionals)
        .then(({ body }) => body);
}


/**
 * Retrieves the documented resource (API documentation) for a specific service and encyclopedia version.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/encyclopedia/v{version}/{api}`
 *
 * @example
 * import { encyclopediaAdapter } from 'epicenter-libs';
 * const resource = await encyclopediaAdapter.getResource(1, 'run');
 *
 * @param version       Encyclopedia version number (minimum: 1)
 * @param api           Name of the API service to retrieve documentation for
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the documented resource containing endpoints and definitions
 */
export async function getResource(
    version: number,
    api: string,
    optionals: RoutingOptions = {},
): Promise<DocumentedResource> {
    return await new Router()
        .get(`/encyclopedia/v${version}/${api}`, optionals)
        .then(({ body }) => body);
}


/**
 * Retrieves a translated representation of the API documentation for a specific service and encyclopedia version.
 * Supported translators are ASCIIDOC, ASCIIDOC_TO_HTML, and OPENAPI.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/encyclopedia/as/{translator}/v{version}/{api}`
 *
 * NOTE: The backend returns the translated content with a translator-specific content-type
 * (e.g. `text/asciidoc`, `text/html`, `application/json`). The shared Router throws when the
 * response content-type is not `application/json`, so only the OPENAPI translator works here.
 * For ASCIIDOC and ASCIIDOC_TO_HTML, use the underlying fetch API directly against the
 * constructed URL.
 *
 * @example
 * import { encyclopediaAdapter } from 'epicenter-libs';
 * const openApiDoc = await encyclopediaAdapter.translate('OPENAPI', 3, 'run');
 *
 * @param translator    Output format for the documentation; one of 'ASCIIDOC', 'ASCIIDOC_TO_HTML', or 'OPENAPI'
 * @param version       Encyclopedia version number (minimum: 1)
 * @param api           Name of the API service to translate documentation for
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the translated documentation (only when translator is 'OPENAPI')
 */
export async function translate(
    translator: EncyclopediaTranslator,
    version: number,
    api: string,
    optionals: RoutingOptions = {},
): Promise<unknown> {
    return await new Router()
        .get(`/encyclopedia/as/${translator}/v${version}/${api}`, optionals)
        .then(({ body }) => body);
}

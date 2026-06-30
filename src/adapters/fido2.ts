import type { RoutingOptions } from '../utils/router';

import Router from '../utils/router';

export type PublicKeyCredentialRequestOptions = Record<string, unknown>;
export type PublicKeyCredentialCreationOptions = Record<string, unknown>;


/**
 * Gets options for a FIDO2 authentication (assertion) request.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/fido2/options/request`
 *
 * @example
 * import { fido2Adapter } from 'epicenter-libs';
 * const options = await fido2Adapter.getRequestOptions();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the public key credential request options
 */
export async function getRequestOptions(
    optionals: RoutingOptions = {},
): Promise<PublicKeyCredentialRequestOptions> {
    return await new Router()
        .get('/fido2/options/request', {
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Gets options for a FIDO2 registration (attestation) request.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/fido2/options/create`
 *
 * @example
 * import { fido2Adapter } from 'epicenter-libs';
 * const options = await fido2Adapter.getCreateOptions();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the public key credential creation options
 */
export async function getCreateOptions(
    optionals: RoutingOptions = {},
): Promise<PublicKeyCredentialCreationOptions> {
    return await new Router()
        .get('/fido2/options/create', {
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Registers a new FIDO2 credential.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/fido2/register`
 *
 * @example
 * import { fido2Adapter } from 'epicenter-libs';
 * await fido2Adapter.register(credential);
 *
 * @param credential    The attestation credential to register
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when registration is complete (204 no content)
 */
export async function register(
    credential: Record<string, unknown>,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .post('/fido2/register', {
            body: credential,
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Verifies a FIDO2 assertion (authenticates with a credential).
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/fido2/verify`
 *
 * @example
 * import { fido2Adapter } from 'epicenter-libs';
 * await fido2Adapter.verify(assertion);
 *
 * @param assertion     The assertion credential to verify
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when verification is complete (204 no content)
 */
export async function verify(
    assertion: Record<string, unknown>,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .post('/fido2/verify', {
            body: assertion,
            ...optionals,
        })
        .then(({ body }) => body);
}

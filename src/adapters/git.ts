import type { RoutingOptions } from '../utils/router';

import { Router } from '../utils';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type GitAlgorithm = 'rsa' | 'ed25519';
export type GitKeySpec = 'openssh' | 'pkcs8' | 'x509';

export interface GitStatusReadOutView {
    currentBranch?: string | null;
}

export interface GitIntegrationReadOutView {
    privateKeySpec?: GitKeySpec | null;
    publicKey?: string | null;
    uri?: string | null;
    publicKeySpec?: GitKeySpec | null;
    algorithm?: GitAlgorithm | null;
}

export interface GitIntegrationCreateInView {
    privateKey: string;
    privateKeySpec: GitKeySpec;
    publicKey: string;
    uri: string;
    publicKeySpec: GitKeySpec;
    algorithm: GitAlgorithm;
}

export interface GitIntegrationUpdateInView {
    privateKey?: string | null;
    privateKeySpec: GitKeySpec;
    publicKey?: string | null;
    uri?: string | null;
    publicKeySpec: GitKeySpec;
    algorithm: GitAlgorithm;
}


// ──────────────────────────────────────────────
// Functions
// ──────────────────────────────────────────────

/**
 * Retrieves the git integration configuration for the project.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/git`
 *
 * @example
 * import { gitAdapter } from 'epicenter-libs';
 * const integration = await gitAdapter.get();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the git integration configuration
 */
export async function get(
    optionals: RoutingOptions = {},
): Promise<GitIntegrationReadOutView> {
    return new Router()
        .get('/git', optionals)
        .then(({ body }) => body);
}


/**
 * Retrieves the current git status for the project.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/git/status`
 *
 * @example
 * import { gitAdapter } from 'epicenter-libs';
 * const status = await gitAdapter.getStatus();
 * console.log(status.currentBranch);
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the git status, including the current branch
 */
export async function getStatus(
    optionals: RoutingOptions = {},
): Promise<GitStatusReadOutView> {
    return new Router()
        .get('/git/status', optionals)
        .then(({ body }) => body);
}


/**
 * Checks out a branch in the project's git repository.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/git/checkout/{branch}`
 *
 * @example
 * import { gitAdapter } from 'epicenter-libs';
 * await gitAdapter.checkout('main');
 *
 * @param branch        Name of the branch to check out
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the checkout is complete
 */
export async function checkout(
    branch: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return new Router()
        .get(`/git/checkout/${branch}`, optionals)
        .then(({ body }) => body);
}


/**
 * Resets the project's git repository, optionally to a specific branch.
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/git/reset[/{branch}]`
 *
 * @example
 * import { gitAdapter } from 'epicenter-libs';
 * await gitAdapter.reset();                        // reset current branch
 * await gitAdapter.reset({ branch: 'main' });      // reset to 'main'
 *
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.branch]    Branch to reset to; if omitted, resets the current branch
 * @returns promise that resolves when the reset is complete
 */
export async function reset(
    optionals: { branch?: string } & RoutingOptions = {},
): Promise<void> {
    const { branch, ...routingOptions } = optionals;
    return new Router()
        .delete(`/git/reset${branch ? `/${branch}` : ''}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Creates a git integration for the project.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/git/integration`
 *
 * @example
 * import { gitAdapter } from 'epicenter-libs';
 * const integration = await gitAdapter.createIntegration({
 *     uri: 'git@github.com:myorg/myrepo.git',
 *     publicKey: '...',
 *     privateKey: '...',
 *     publicKeySpec: 'openssh',
 *     privateKeySpec: 'openssh',
 *     algorithm: 'ed25519',
 * });
 *
 * @param integration   Git integration configuration to create
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the created git integration
 */
export async function createIntegration(
    integration: GitIntegrationCreateInView,
    optionals: RoutingOptions = {},
): Promise<GitIntegrationReadOutView> {
    return new Router()
        .post('/git/integration', {
            body: integration,
            ...optionals,
        }).then(({ body }) => body);
}


/**
 * Updates the git integration for the project.
 * Base URL: PATCH `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/git/integration`
 *
 * @example
 * import { gitAdapter } from 'epicenter-libs';
 * const integration = await gitAdapter.updateIntegration({
 *     uri: 'git@github.com:myorg/newrepo.git',
 *     publicKeySpec: 'openssh',
 *     privateKeySpec: 'openssh',
 *     algorithm: 'ed25519',
 * });
 *
 * @param integration   Fields to update on the git integration
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the updated git integration
 */
export async function updateIntegration(
    integration: GitIntegrationUpdateInView,
    optionals: RoutingOptions = {},
): Promise<GitIntegrationReadOutView> {
    return new Router()
        .patch('/git/integration', {
            body: integration,
            ...optionals,
        }).then(({ body }) => body);
}


/**
 * Removes the git integration for the project.
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/git/integration`
 *
 * @example
 * import { gitAdapter } from 'epicenter-libs';
 * await gitAdapter.removeIntegration();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the integration is removed
 */
export async function removeIntegration(
    optionals: RoutingOptions = {},
): Promise<void> {
    return new Router()
        .delete('/git/integration', optionals)
        .then(({ body }) => body);
}


/**
 * Pushes local commits to the remote git repository.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/git/push`
 *
 * @example
 * import { gitAdapter } from 'epicenter-libs';
 * await gitAdapter.push({ message: 'Update simulation data' });
 *
 * @param optionals             Arguments object; also accepts network call option overrides.
 * @param optionals.message     Commit message (required)
 * @param [optionals.password]  Password for authentication
 * @param [optionals.force]     Force-push, bypassing non-fast-forward checks
 * @returns promise that resolves when the push is complete
 */
export async function push(
    optionals: {
        message: string;
        password?: string | null;
        force?: boolean | null;
    } & RoutingOptions,
): Promise<void> {
    const { message, password, force, ...routingOptions } = optionals;
    return new Router()
        .withSearchParams({ force })
        .post('/git/push', {
            body: { message, password },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Pulls changes from the remote git repository into the project.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/git/pull`
 *
 * @example
 * import { gitAdapter } from 'epicenter-libs';
 * await gitAdapter.pull({ force: true, confirm: true });
 *
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.password]  Password for authentication
 * @param [optionals.force]     Force the pull, overwriting local changes
 * @param [optionals.confirm]   Set the `X-Forio-Confirmation` header to confirm an overwrite
 * @returns promise that resolves when the pull is complete
 */
export async function pull(
    optionals: {
        password?: string | null;
        force?: boolean | null;
        confirm?: boolean | null;
    } & RoutingOptions = {},
): Promise<void> {
    const { password, force, confirm, headers: headersOverride, ...routingOptions } = optionals;
    const headers = Object.assign(
        {},
        headersOverride,
        confirm ? { 'X-Forio-Confirmation': true } : {},
    );
    return new Router()
        .withSearchParams({ force })
        .post('/git/pull', {
            body: { password },
            headers,
            ...routingOptions,
        }).then(({ body }) => body);
}

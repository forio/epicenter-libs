import type { RoutingOptions } from '../utils/router';

import { Router } from '../utils';


export interface CleanOperation {
    objectType: 'clean';
}

export interface CopyItem {
    location: unknown;
    from?: string;
    to?: string;
}

export interface CopyOperation {
    objectType: 'copy';
    items?: CopyItem[];
}

export interface GitOperation {
    objectType: 'git';
    password: string;
    force?: boolean;
    confirmed?: boolean;
}

export interface NPMOperation {
    objectType: 'npm';
    nodeVersion?: string;
    timeoutMinutes?: number;
    directory?: string;
    commands?: unknown[];
}

export type PipelineOperation = CleanOperation | CopyOperation | GitOperation | NPMOperation;


/**
 * Returns available NPM node images for use in pipeline NPM operations.
 * Requires `system` (admin) authorization.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/pipeline/npm/images`
 *
 * @example
 * import { pipelineAdapter } from 'epicenter-libs';
 * const images = await pipelineAdapter.getImages();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the list of available NPM images
 */
export async function getImages(
    optionals: RoutingOptions = {},
): Promise<unknown> {
    return await new Router()
        .get('/pipeline/npm/images', optionals)
        .then(({ body }) => body);
}


/**
 * Executes a build pipeline for the project. Runs a sequence of operations such as clean, copy, git, and npm steps.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/pipeline/execute`
 *
 * @example
 * import { pipelineAdapter } from 'epicenter-libs';
 * await pipelineAdapter.execute([
 *     { objectType: 'clean' },
 *     { objectType: 'git', password: 'mytoken' },
 *     { objectType: 'npm', nodeVersion: '18', commands: ['install', 'build'] },
 * ]);
 *
 * @param operations                        List of pipeline operations to execute in order
 * @param operations[].objectType           Type of operation: 'clean' | 'copy' | 'git' | 'npm'
 * @param [operations[].password]           (git only) Git authentication token or password
 * @param [operations[].force]              (git only) Force the git operation
 * @param [operations[].confirmed]          (git only) Confirmation flag for the git operation
 * @param [operations[].items]              (copy only) List of items to copy
 * @param [operations[].nodeVersion]        (npm only) Node.js version to use
 * @param [operations[].timeoutMinutes]     (npm only) Timeout in minutes for the npm operation
 * @param [operations[].directory]          (npm only) Working directory for the npm operation
 * @param [operations[].commands]           (npm only) NPM commands to run
 * @param [optionals]                       Optional arguments; pass network call options overrides here.
 * @param [optionals.log]                   Log identifier for the pipeline execution
 * @returns promise that resolves to the pipeline execution result
 */
export async function execute(
    operations: PipelineOperation[],
    optionals: {
        log?: string;
    } & RoutingOptions = {},
): Promise<unknown> {
    const { log, ...routingOptions } = optionals;
    return await new Router()
        .post('/pipeline/execute', {
            body: {
                operations,
                log,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

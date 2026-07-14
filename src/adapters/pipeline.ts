import type { Page, RoutingOptions } from '../utils/router';

import { Router } from '../utils';


export type PipelineExecutionStatus = 'RUNNING' | 'SUCCEEDED' | 'FAILED';

export interface PipelineAuditReadOutView {
    status?: PipelineExecutionStatus | null;
    started?: string | null;
    finished?: string | null;
    executionKey?: string | null;
    accountShortName?: string | null;
    projectShortName?: string | null;
    configName?: string | null;
    /* Virtual field: display name of the admin who triggered the execution. */
    creator?: string | null;
}


/**
 * Builds the NPM Docker images used by pipeline NPM operations.
 * Requires `system` (admin) authorization.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/pipeline/npm/images`
 *
 * @example
 * import { pipelineAdapter } from 'epicenter-libs';
 * const built = await pipelineAdapter.buildImages();
 *
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to `true` when the images were built successfully
 */
export async function buildImages(
    optionals: RoutingOptions = {},
): Promise<boolean> {
    return await new Router()
        .get('/pipeline/npm/images', optionals)
        .then(({ body }) => body);
}


/**
 * Executes a stored pipeline configuration. The operations to run are read server-side from the
 * named config file; only step inputs (such as credentials) are supplied here via `attributes`.
 * The execution runs asynchronously — the returned audit record starts in its `RUNNING` state and
 * is updated by the worker on completion (poll `getExecution` to observe progress).
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/pipeline/{configName}`
 *
 * @example
 * import { pipelineAdapter } from 'epicenter-libs';
 * // Pass the git credential the config's git step will consume, keyed by operation type
 * const audit = await pipelineAdapter.execute('deploy', { git: 'my-git-token' });
 *
 * @param configName        Name of the stored pipeline config to execute
 * @param [attributes]      Step inputs keyed by operation type (e.g. `{ git: '<token>' }`)
 * @param [optionals]       Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the newly created audit record in its initial RUNNING state
 */
export async function execute(
    configName: string,
    attributes: Record<string, unknown> = {},
    optionals: RoutingOptions = {},
): Promise<PipelineAuditReadOutView> {
    return await new Router()
        .post(`/pipeline/${encodeURIComponent(configName)}`, {
            body: { attributes },
            ...optionals,
        }).then(({ body }) => body);
}


/**
 * Retrieves a single pipeline audit record by its execution key.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/pipeline/{executionKey}`
 *
 * @example
 * import { pipelineAdapter } from 'epicenter-libs';
 * const audit = await pipelineAdapter.getExecution('<executionKey>');
 *
 * @param executionKey  Execution key of the audit record to retrieve
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the audit record
 */
export async function getExecution(
    executionKey: string,
    optionals: RoutingOptions = {},
): Promise<PipelineAuditReadOutView> {
    return await new Router()
        .get(`/pipeline/${encodeURIComponent(executionKey)}`, optionals)
        .then(({ body }) => body);
}


/**
 * Lists the audit history for a stored pipeline config.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/pipeline/with/{configName}`
 *
 * @example
 * import { pipelineAdapter } from 'epicenter-libs';
 * const page = await pipelineAdapter.listAudits('deploy', { first: 0, max: 20 });
 *
 * @param configName        Name of the stored pipeline config
 * @param [optionals]       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.first] Index of the first record to return (for pagination)
 * @param [optionals.max]   Maximum number of records to return (for pagination)
 * @returns promise that resolves to a page of audit records
 */
export async function listAudits(
    configName: string,
    optionals: {
        first?: number;
        max?: number;
    } & RoutingOptions = {},
): Promise<Page<PipelineAuditReadOutView>> {
    const { first = 0, max, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({ first, max })
        .get(`/pipeline/with/${encodeURIComponent(configName)}`, {
            paginated: true,
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Deletes a pipeline audit record by its execution key.
 * Requires `system` (admin) authorization.
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/pipeline/{executionKey}`
 *
 * @example
 * import { pipelineAdapter } from 'epicenter-libs';
 * await pipelineAdapter.deleteAudit('<executionKey>');
 *
 * @param executionKey  Execution key of the audit record to delete
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to `true` when the audit record was deleted
 */
export async function deleteAudit(
    executionKey: string,
    optionals: RoutingOptions = {},
): Promise<boolean> {
    return await new Router()
        .delete(`/pipeline/${encodeURIComponent(executionKey)}`, optionals)
        .then(({ body }) => body);
}

import type { RoutingOptions } from '../utils/router';
import type { ModelLanguage, Morphology } from '../utils/constants';

import { Router } from '../utils';

export interface StellaModelTool {
    objectType: 'stella';
    gameMode?: boolean | null;
}

export interface VensimModelTool {
    objectType: 'vensim';
    sensitivityMode?: boolean | null;
    cinFiles?: unknown[] | null;
}

export type ModelTool = StellaModelTool | VensimModelTool;

export interface V1ExecutionContext {
    version: unknown;
    presets?: Record<string, object> | null;
    mappedFiles?: Record<string, string> | null;
    tool?: ModelTool;
}

export interface ModelContext {
    [key: string]: unknown;
}


/**
 * Gets the model context for a given model file.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/context/{MODEL_FILE}`
 *
 * @example
 * import { contextAdapter } from 'epicenter-libs';
 * const context = await contextAdapter.get('model.vmf');
 *
 * @param modelFile         The model file name
 * @param [optionals]       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.morphology]  The morphology type for the model context
 * @returns promise that resolves to the model context
 */
export async function get(
    modelFile: string,
    optionals: {
        morphology?: Morphology;
    } & RoutingOptions = {},
): Promise<ModelContext> {
    const { morphology, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({ morphology })
        .get(`/context/${modelFile}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Upgrades the model context for a given model file.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/context/upgrade/{MODEL_FILE}`
 *
 * @example
 * import { contextAdapter } from 'epicenter-libs';
 * await contextAdapter.upgrade('model.vmf', { morphology: 'SINGULAR' });
 *
 * @param modelFile         The model file name
 * @param [optionals]       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.morphology]  The morphology type for the upgrade
 * @returns promise that resolves to void on success
 */
export async function upgrade(
    modelFile: string,
    optionals: {
        morphology?: Morphology;
    } & RoutingOptions = {},
): Promise<void> {
    const { morphology, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({ morphology })
        .post(`/context/upgrade/${modelFile}`, routingOptions)
        .then(({ body }) => body);
}


/**
 * Verifies a model context configuration.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/context/verify`
 *
 * @example
 * import { contextAdapter } from 'epicenter-libs';
 * await contextAdapter.verify('model.vmf', {
 *     modelLanguage: 'VENSIM',
 *     morphology: 'SINGULAR',
 * });
 *
 * @param modelFile                      The model file name
 * @param [optionals]                    Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.morphology]         The morphology type
 * @param [optionals.modelLanguage]      The model language
 * @param [optionals.executionContext]   The execution context configuration
 * @returns promise that resolves to void on success
 */
export async function verify(
    modelFile: string,
    optionals: {
        morphology?: Morphology;
        modelLanguage?: ModelLanguage;
        executionContext?: V1ExecutionContext;
    } & RoutingOptions = {},
): Promise<void> {
    const { morphology, modelLanguage, executionContext, ...routingOptions } = optionals;
    return await new Router()
        .post('/context/verify', {
            body: { modelFile, morphology, modelLanguage, executionContext },
            ...routingOptions,
        }).then(({ body }) => body);
}

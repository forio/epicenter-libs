import type { RoutingOptions } from '../utils/router';
import type { ModelLanguage, Morphology } from '../utils/constants';

import { Router } from '../utils';


/**
 * Checks if the build environment is ready for a given model language.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/forge/ready`
 *
 * @example
 * import { forgeAdapter } from 'epicenter-libs';
 * await forgeAdapter.ready('PYTHON_3');
 *
 * @param modelLanguage   The model language to check readiness for
 * @param [optionals]     Optional arguments; pass network call options overrides here.
 * @returns promise that resolves when the check is complete (204 no content)
 */
export async function ready(
    modelLanguage: ModelLanguage,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .post('/forge/ready', {
            body: { modelLanguage },
            ...optionals,
        })
        .then(({ body }) => body);
}


/**
 * Triggers a rebuild of all models in the project.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/forge/rebuild`
 *
 * @example
 * import { forgeAdapter } from 'epicenter-libs';
 * await forgeAdapter.rebuild();
 *
 * @param [optionals]             Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.noCache]     Whether to skip the build cache
 * @param [optionals.cleanUp]     Whether to clean up build artifacts
 * @returns promise that resolves when the rebuild is triggered (204 no content)
 */
export async function rebuild(
    optionals: {
        noCache?: boolean;
        cleanUp?: boolean;
    } & RoutingOptions = {},
): Promise<void> {
    const {
        noCache, cleanUp,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post('/forge/rebuild', {
            body: { noCache, cleanUp },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Sets the default build configuration for a specific model language.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/forge/default`
 *
 * @example
 * import { forgeAdapter } from 'epicenter-libs';
 * await forgeAdapter.setDefault('PYTHON_3', { modelMorphology: 'SINGULAR' });
 *
 * @param modelLanguage               The model language to set the default for
 * @param [optionals]                 Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.noCache]         Whether to skip the build cache
 * @param [optionals.cleanUp]         Whether to clean up build artifacts
 * @param [optionals.modelMorphology] The model morphology: 'MANY', 'PROXY', or 'SINGULAR'
 * @param [optionals.workerImage]     Custom worker image to use
 * @returns promise that resolves when the default is set (204 no content)
 */
export async function setDefault(
    modelLanguage: ModelLanguage,
    optionals: {
        noCache?: boolean;
        cleanUp?: boolean;
        modelMorphology?: Morphology;
        workerImage?: string;
    } & RoutingOptions = {},
): Promise<void> {
    const {
        noCache, cleanUp, modelMorphology, workerImage,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post('/forge/default', {
            body: { modelLanguage, noCache, cleanUp, modelMorphology, workerImage },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Sets default build configuration for all model languages.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/forge/default/all`
 *
 * @example
 * import { forgeAdapter } from 'epicenter-libs';
 * await forgeAdapter.setDefaultAll({ noCache: true });
 *
 * @param [optionals]             Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.noCache]     Whether to skip the build cache
 * @param [optionals.cleanUp]     Whether to clean up build artifacts
 * @returns promise that resolves when the defaults are set (204 no content)
 */
export async function setDefaultAll(
    optionals: {
        noCache?: boolean;
        cleanUp?: boolean;
    } & RoutingOptions = {},
): Promise<void> {
    const {
        noCache, cleanUp,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post('/forge/default/all', {
            body: { noCache, cleanUp },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Sets default build configuration for multiple model languages.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/forge/defaults`
 *
 * @example
 * import { forgeAdapter } from 'epicenter-libs';
 * await forgeAdapter.setDefaults(['PYTHON_3', 'JAVASCRIPT'], { modelMorphology: 'SINGULAR' });
 *
 * @param modelLanguages              Array of model languages to set defaults for
 * @param [optionals]                 Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.noCache]         Whether to skip the build cache
 * @param [optionals.cleanUp]         Whether to clean up build artifacts
 * @param [optionals.modelMorphology] The model morphology: 'MANY', 'PROXY', or 'SINGULAR'
 * @returns promise that resolves when the defaults are set (204 no content)
 */
export async function setDefaults(
    modelLanguages: ModelLanguage[],
    optionals: {
        noCache?: boolean;
        cleanUp?: boolean;
        modelMorphology?: Morphology;
    } & RoutingOptions = {},
): Promise<void> {
    const {
        noCache, cleanUp, modelMorphology,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post('/forge/defaults', {
            body: { modelLanguages, noCache, cleanUp, modelMorphology },
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Builds a specific model file.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/forge/build`
 *
 * @example
 * import { forgeAdapter } from 'epicenter-libs';
 * await forgeAdapter.build('model.py', { modelLanguage: 'PYTHON_3' });
 *
 * @param modelFile                   The model file to build
 * @param [optionals]                 Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.noCache]         Whether to skip the build cache
 * @param [optionals.cleanUp]         Whether to clean up build artifacts
 * @param [optionals.modelLanguage]   The model language
 * @param [optionals.modelMorphology] The model morphology: 'MANY', 'PROXY', or 'SINGULAR'
 * @returns promise that resolves when the build is triggered (204 no content)
 */
export async function build(
    modelFile: string,
    optionals: {
        noCache?: boolean;
        cleanUp?: boolean;
        modelLanguage?: ModelLanguage;
        modelMorphology?: Morphology;
    } & RoutingOptions = {},
): Promise<void> {
    const {
        noCache, cleanUp, modelLanguage, modelMorphology,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post('/forge/build', {
            body: { modelFile, noCache, cleanUp, modelLanguage, modelMorphology },
            ...routingOptions,
        })
        .then(({ body }) => body);
}

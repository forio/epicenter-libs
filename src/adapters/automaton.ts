import type { RoutingOptions } from '../utils/router';

import { Router } from '../utils';

export type Automata = 'ADD_USER_TO_ALL_GROUPS' | 'REMOVE_USER_FROM_ALL_GROUPS';

export type AutomatonStatus = 'EXECUTING' | 'COMPLETED' | 'FAILED';

export type AutomatonParameterType = 'string' | 'date' | 'long' | 'double';

export interface AutomatonParameter {
    objectType: AutomatonParameterType;
    value: string | number | null;
}

export interface AutomatonParameters {
    [key: string]: AutomatonParameter;
}

export interface AutomatedReadOutView {
    jobId: number | null;
    error: string | null;
    status: AutomatonStatus | null;
}


/**
 * Starts an automaton job for a given project.
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/automaton/{AUTOMATA}`
 *
 * @example
 * import { automatonAdapter } from 'epicenter-libs';
 * const job = await automatonAdapter.start('ADD_USER_TO_ALL_GROUPS', {
 *     userId: { objectType: 'string', value: 'user123' },
 * });
 *
 * @param automata          The automaton action to execute
 * @param parameters        Parameters for the automaton job, keyed by parameter name
 * @param [optionals]       Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.addNonce]  If true, adds a nonce to the request
 * @returns promise that resolves to the automaton job status
 */
export async function start(
    automata: Automata,
    parameters: AutomatonParameters,
    optionals: {
        addNonce?: boolean;
    } & RoutingOptions = {},
): Promise<AutomatedReadOutView> {
    const { addNonce, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({ addNonce })
        .post(`/automaton/${automata}`, {
            body: { parameters },
            ...routingOptions,
        }).then(({ body }) => body);
}


/**
 * Gets the status of an automaton job.
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/automaton/{JOB_ID}`
 *
 * @example
 * import { automatonAdapter } from 'epicenter-libs';
 * const status = await automatonAdapter.getStatus(12345);
 *
 * @param jobId         The job ID returned from starting an automaton
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to the automaton job status
 */
export async function getStatus(
    jobId: number,
    optionals: RoutingOptions = {},
): Promise<AutomatedReadOutView> {
    return await new Router()
        .get(`/automaton/${jobId}`, optionals)
        .then(({ body }) => body);
}

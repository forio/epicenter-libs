import { EpicenterError, Router, prefix, identification } from 'utils';
import { LOCK_TYPE, SCOPE_BOUNDARY, RITUAL } from 'utils/constants';

/**
 * Run API adapters -- use this to create, update, delete, and manage your runs
 * @namespace runAdapter
 */


/**
 * Create a run.
 *
 * By default, all runs are created with the user's ID (`userKey`) and user-only read-write permissions, except in the case of world-scoped runs. For more information on scopes,
 * @memberof runAdapter
 * @example
 *
 * const { runAdapter, SCOPE_BOUNDARY } = epicenter;
 * runAdapter.create('model.py', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: '000001713a246b0b34b5b5d274c057a5b2a7'
 * });
 * @param {string}  model               Name of your model file
 * @param {Object}  scope               Scope associated with your run
 * @param {string}  scope.scopeBoundary Scope boundary, defines the type of scope; See [SCOPE_BOUNDARY](#SCOPE_BOUNDARY) for all types
 * @param {string}  scope.scopeKey      Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @returns {Object}                    Something meaningful about returns
 */
export async function create(model, scope, optionals = {}) {
    const { scopeBoundary, scopeKey } = scope;
    const {
        accountShortName, projectShortName, readLock, writeLock, userKey,
        ephemeral, trackingKey, modelContext, executionContext,
    } = optionals;

    const { WORLD } = SCOPE_BOUNDARY;
    const { PARTICIPANT, USER } = LOCK_TYPE;
    const defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post('/run', {
            body: {
                scope: {
                    scopeBoundary,
                    scopeKey,
                    userKey: scopeBoundary === WORLD ?
                        undefined :
                        userKey ?? identification.session.userKey,
                },
                permit: {
                    readLock: readLock || defaultLock,
                    writeLock: writeLock || defaultLock,
                },
                morphology: 'MANY',
                trackingKey,
                modelFile: model,
                modelContext: modelContext || {/* Is not recorded for clone. Overrides model ctx2 file. */},
                executionContext: executionContext || {/* Affected by clone. Carries arguments for model file worker on model initialization */},
                ephemeral,
            },
        }).then(({ body }) => body);
}

/**
 * Clone a run
 * @memberof runAdapter
 *
 * @param {string}  runKey          Run's key
 * @param {Object}  [optionals={}]  Object for all optional fields
 * @returns {Object}                Response with the run in the "body"
 */
export async function clone(runKey, optionals = {}) {
    const {
        accountShortName, projectShortName, ephemeral,
        trackingKey, modelContext = {}, executionContext = {},
    } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/clone/${runKey}`, {
            body: {
                trackingKey,
                modelContext,
                executionContext,
                ephemeral,
            },
        }).then(({ body }) => body);
}

export async function restore(runKey, optionals = {}) {
    const {
        accountShortName, projectShortName, ephemeral,
        modelContext = {}, executionContext = {},
    } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/restore/${runKey}`, {
            body: {
                modelContext,
                executionContext,
                ephemeral,
            },
        }).then(({ body }) => body);
}

export async function rewind(runKey, steps, optionals = {}) {
    const {
        accountShortName, projectShortName,
        ephemeral, modelContext = {},
    } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/rewind/${runKey}`, {
            body: {
                rewindCount: steps,
                modelContext,
                ephemeral,
            },
        }).then(({ body }) => body);
}

export async function update(runKey, update, optionals = {}) {
    const { readLock, writeLock, trackingKey, marked, hidden, closed } = update;
    const { accountShortName, projectShortName } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(hasMultiple ? { runKey } : '')
        .patch(`/run${uriComponent}`, {
            body: {
                readLock,
                writeLock,
                trackingKey,
                marked,
                hidden,
                closed,
            },
        }).then(({ body }) => body);
}

export async function remove(runKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/run/${runKey}`)
        .then(({ body }) => body);

}

export async function get(runKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/${runKey}`)
        .then(({ body }) => body);
}


/**
 * Queries for runs. Use this to look u
 * @memberof runAdapter
 *
 * @param {string}  model               Name of your model file
 * @param {Object}  scope               Scope associated with your run
 * @param {string}  scope.scopeBoundary Scope boundary, defines the type of scope; See [SCOPE_BOUNDARY](#SCOPE_BOUNDARY) for all types
 * @param {string}  scope.scopeKey      Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {Object}  [optionals={}]      Something meaningful about optionals
 * @param {Filter}  [optionals.filter]  Filter Object
 * @returns {Object}                    Something meaningful about returns
 */
export async function query(model, scope, optionals = {}) {
    const { scopeBoundary, scopeKey } = scope;
    const {
        filter = {}, sort = [], first, max, timeout, projections = {},
        accountShortName, projectShortName,
    } = optionals;

    const searchParams = {
        filter: [
            ...(filter.variables || []).map((statement) => prefix('var.', statement)),
            ...(filter.metadata || []).map((statement) => prefix('meta.', statement)),
            ...(filter.attributes || []).map((statement) => prefix('run.', statement)),
        ].join(';'),
        sort: sort.join(';'),
        first, max, timeout,
        projections: [
            ...(projections.variables || []).map((name) => prefix('var.', name)),
            ...(projections.metadata || []).map((name) => prefix('meta.', name)),
            ...(projections.attr || []).map((name) => prefix('run.', name)),
        ].join(';'),
    };

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/run/${scopeBoundary}/${scopeKey}/${model}`, { paginate: true })
        .then(({ body }) => body);
}

export async function introspect(model, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/introspect/${model}`)
        .then(({ body }) => body);

}

export async function operation(runKey, name, args = [], optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .post(`/run/operation${uriComponent}`, {
            body: {
                name,
                arguments: args,
                objectType: 'execute', // TODO: remove this when platform fixes this so that it's not manually required
            },
        }).then(({ body }) => body);
}

export async function getVariables(runKey, variables, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const include = variables.join(';');
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout, include } : { ritual, timeout, include };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/run/variable${uriComponent}`)
        .then(({ body }) => body);

}

export async function getVariable(runKey, variable, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;

    if (Array.isArray(runKey) || Array.isArray(variable)) {
        const variables = Array.isArray(variable) ? variable : [variable];
        return getVariables(runKey, variables, optionals);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ timeout, ritual })
        .get(`/run/variable/${runKey}/${variable}`)
        .then(({ body }) => body);

}
/**
 * Updates model variables for the run
 * @memberof runAdapter
 *
 * @param {string}  runKey      Identifier for your run
 * @param {Object}  update      Object with the key-value pairs you would like to update in the model
 * @param {Object}  optionals   Something meaningful about optionals
 * @returns {Object}            Object with the variables & new values that were updated
 */
export async function updateVariables(runKey, update, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .patch(`/run/variable${uriComponent}`, { body: update })
        .then(({ body }) => body);

}

export async function getMetadata(runKey, variables, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const include = variables.join(';');
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout, include } : { ritual, timeout, include };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/run/meta${uriComponent}`)
        .then(({ body }) => body);

}

export async function updateMetadata(runKey, update, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .patch(`/run/meta${uriComponent}`, { body: update })
        .then(({ body }) => body);

}

export async function action(runKey, actionList, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .post(`/run/action${uriComponent}`, { body: actionList })
        .then(({ body }) => body);

}

async function serial(runKey, operations, optionals) {
    const normalizedOps = operations.map((item) => ({
        name: typeof item === 'string' ? item : item.name,
        params: item.params,
    }));

    //Perform all operations, sequentially
    return normalizedOps.reduce((promise, { name, params }) => {
        return promise.then(() => operation(runKey, name, params, optionals));
    }, Promise.resolve());
}

export async function getWithStrategy(strategy, model, scope, optionals = {}) {
    const { initOperations = [] } = optionals;
    if (strategy === 'reuse-across-sessions') {
        const runs = await query(model, scope, { ...optionals, sort: ['-created'] });
        if (runs.length) {
            return runs[0];
        }
        const newRun = await create(model, scope, optionals);
        await serial(newRun.runKey, initOperations, optionals);
        return newRun;
    } else if (strategy === 'reuse-never') {
        const newRun = await create(model, scope, optionals);
        await serial(newRun.runKey, initOperations, optionals);
        return newRun;
    } else if (strategy === 'reuse-by-tracking-key') {
        //TBD write out if needed
        //Platform plans to introduce run limits into episode scope, differing from v2's implementation of runLimit via 'reuse-by-tracking-key'
    } else if (strategy === 'multiplayer') {
        //TODO when multiplayer API is ready
        //check the current world for this end user, return the current run for that world (if there is none, create a run for the world)
    }
    throw new EpicenterError('Invalid run strategy.');
}

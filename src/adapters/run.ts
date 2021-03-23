import { EpicenterError, Router, identification } from 'utils/index';
import { ROLE, SCOPE_BOUNDARY, RITUAL } from 'utils/constants';

/**
 * Run API adapters -- use this to create, update, delete, and manage your runs
 * @namespace runAdapter
 */

interface ModelContext {

}
interface ExecutionContext {

}
interface CreateOptions extends GenericAdapterOptions {
    readLock?: keyof typeof ROLE,
    writeLock?: keyof typeof ROLE,
    userKey?: string,
    ephemeral?: boolean,
    trackingKey?: string,
    modelContext?: ModelContext,
    executionContext?: ExecutionContext,
}
interface GetOptions extends GenericAdapterOptions {
    timeout?: number,
    ritual?: keyof typeof RITUAL,
}
interface UpdateOptions {
    readLock?: string,
    writeLock?: string,
    trackingKey?: string,
    marked?: boolean, /* analogous to v2's 'saved' */
    hidden?: boolean, /* analogous to v2's 'trashed' */
    closed?: boolean, /* Closed is a flag that means do not restore, the run is done, no more play */
}
interface QueryOptions extends GenericAdapterQueryOptions {
    timeout?: number,
    variables?: string[],
    metadata?: string[],
}
interface ProcAction {
    name: string,
    arguments?: any[],
    objectType: 'execute',
}
interface GetAction {
    name: string,
    objectType: 'get',
}
interface SetAction {
    name: string,
    value: any,
    objectType: 'set',
}
type Action =
    | ProcAction
    | GetAction
    | SetAction;

/**
 * Creates a run. By default, all runs are created with the user's ID (`userKey`) and user-only read-write permissions, except in the case of world-scoped runs. For more information on scopes,
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run`
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter, SCOPE_BOUNDARY } from 'epicenter';
 * runAdapter.create('model.py', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: '000001713a246b0b34b5b5d274c057a5b2a7'
 * });
 * @param {string}  model                           Name of your model file
 * @param {object}  scope                           Scope associated with your run
 * @param {string}  scope.scopeBoundary             Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}  scope.scopeKey                  Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.readLock]            Role (character type)
 * @param {string}  [optionals.writeLock]           Role (chracter type)
 * @param {string}  [optionals.userKey]             Key of the user creating the run, should be `undefined` if it's a world run
 * @param {boolean} [optionals.ephemeral]           Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param {string}  [optionals.trackingKey]         Tracking key
 * @param {object}  [optionals.modelContext]        .ctx2 file overrides, this is not tracked by clone operations
 * @param {object}  [optionals.executionContext]    Carries arguments for model file worker on model initialization. This is tracked by clone operations.
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Newly created run
 */
export async function create(
    model: string,
    scope: GenericScope,
    optionals: CreateOptions = {}
):Promise<Run> {
    const { scopeBoundary, scopeKey } = scope;
    const {
        readLock, writeLock, userKey, ephemeral,
        trackingKey, modelContext, executionContext,
        accountShortName, projectShortName, server,
    } = optionals;

    const { WORLD } = SCOPE_BOUNDARY;
    const { PARTICIPANT, USER } = ROLE;
    const defaultLock = scopeBoundary === WORLD ? PARTICIPANT : USER;

    return await new Router()
        .withServer(server)
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
 * @param {object}  [optionals={}]  Object for all optional fields
 * @returns {object}                Response with the run in the "body"
 */
export async function clone(runKey: string, optionals: CreateOptions = {}):Promise<JSON> {
    const {
        ephemeral, trackingKey, modelContext = {}, executionContext = {},
        accountShortName, projectShortName, server,
    } = optionals;
    return await new Router()
        .withServer(server)
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

export async function restore(runKey: string, optionals: CreateOptions = {}) {
    const {
        ephemeral, modelContext = {}, executionContext = {},
        accountShortName, projectShortName, server,
    } = optionals;
    return await new Router()
        .withServer(server)
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

export async function rewind(
    runKey: string,
    steps: number,
    optionals: CreateOptions = {}
) {
    const {
        ephemeral, modelContext = {},
        accountShortName, projectShortName, server,
    } = optionals;
    return await new Router()
        .withServer(server)
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

export async function update(
    runKey: string,
    update: UpdateOptions,
    optionals: GenericAdapterOptions = {}
) {
    const { readLock, writeLock, trackingKey, marked, hidden, closed } = update;
    const { accountShortName, projectShortName, server } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;

    return await new Router()
        .withServer(server)
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


/**
 * *Does not actually delete the run*. The run is instead removed from memory. This can be used as a means of preserving server CPUs, and should be used when you do not expect to perform any addtional actions that would bring the run back into memory. (TODO: see David for details; is it just operations that bring the run into memory? what about clone... etc.)
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run/{RUN_KEY}`
 *
 * @memberof runAdapter
 * @example
 *
 * epicenter.runAdapter.remove(run.runKey);
 *
 * @param {string}  runKey                          Key associated with the run
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                TODO
 */
export async function remove(runKey: string, optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/run/${runKey}`)
        .then(({ body }) => body);
}

export async function get(runKey: string, optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/${runKey}`)
        .then(({ body }) => body);
}


/**
 * Queries for runs.
 *
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{MODEL_FILE}?filter={FILTER}&sort={SORT}&first={FIRST}&max={MAX}`
 *
 * `filters` take in an array of strings that are serialized as a JSON object on the backend using the JSONiq (JSON query language). See their docs for addtional info
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter } from 'epicenter';
 * runAdapter.query({
 *      filter: [
 *          'var.foo|=1|2|3',               // look for runs with a variable 'foo' with the values 1, 2, or 3
 *          'var.score>=24',                // looks for runs with a variable 'score' higher than or equal to 24
 *          'var.certified*=true'           // looks for runs where the variable 'certified' exists,
 *          'run.hidden=false',             // where the run's 'hidden' attribute is false
 *          'meta.classification~=bar-*'    // where the run metadata contains a 'classification' that begins with 'bar-',
 *          'meta.categorization~=*-baz'    // where the run metadata contains a 'categorization' that does not end with '-baz',
 *      ],
 *      sort: ['+run.created']              // sort all findings by the 'created' field
 *      variables: ['foo', 'baz'],          // include the run variables for 'foo' and 'baz' in the response
 *      metadata: ['classification']        // include the run metadata for 'classification' in the response
 * });
 *
 * @param {string}      model                           Name of your model file
 * @param {object}      scope                           Scope associated with your run
 * @param {string}      scope.scopeBoundary             Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}      scope.scopeKey                  Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}      [optionals={}]                  Optional parameters
 * @param {string[]}    [optionals.filter]              List of conditionals to filter for
 * @param {string[]}    [optionals.sort]                List of values to sort by
 * @param {string[]}    [optionals.variables]           List of variables to include with the runs found
 * @param {string[]}    [optionals.metadata]            List of metadata to include with the runs found
 * @param {number}      [optionals.first]               The index from which we collect our runs from
 * @param {number}      [optionals.max]                 The maximum number of runs to return (upper limit: 200)
 * @param {number}      [optionals.timeout]             Number of seconds we're willing to wait for the response from the server
 * @param {string}      [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}      [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                    TODO
 */
export async function query(
    model: string,
    scope: GenericScope,
    optionals: QueryOptions = {}
) {
    const { scopeBoundary, scopeKey } = scope;
    const {
        filter = [], sort = [], first, max, timeout, variables = [], metadata = [],
        accountShortName, projectShortName, server,
    } = optionals;

    const searchParams = {
        filter: filter.join(';') || undefined,
        sort: sort.join(';') || undefined,
        var: variables.join(';') || undefined,
        meta: metadata.join(';') || undefined,
        first, max, timeout,
    };

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/run/${scopeBoundary}/${scopeKey}/${model}`, {
            paginated: true,
            parsePage: (values: any[]) => {
                return values.map((run) => {
                    run.variables = variables.reduce((variableMap, key, index) => {
                        variableMap[key] = variables[index];
                        return variableMap;
                    }, {} as Record<string, any>);
                    return run;
                });
            },
        })
        .then(({ body }) => body);
}

// TODO -- add GET for run/in/groupName/episodeName/


export async function introspect(model: string, optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/introspect/${model}`)
        .then(({ body }) => body);
}

export async function operation(
    runKey: string | string[],
    name: string,
    args: any[] = [],
    optionals: GetOptions = {}
) {
    const {
        timeout, ritual,
        accountShortName, projectShortName, server,
    } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withServer(server)
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

export async function getVariables(
    runKey: string | string[],
    variables: string[],
    optionals: GetOptions = {}
): Promise<Record<string, unknown> | Record<string, unknown>[]> {
    const {
        timeout, ritual,
        accountShortName, projectShortName, server,
    } = optionals;
    const include = variables.join(';');
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout, include } : { ritual, timeout, include };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    const mappify = (values: unknown[]) => variables.reduce((variableMap, key, index) => {
        variableMap[key] = values[index];
        return variableMap;
    }, {} as Record<string, unknown>);

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/run/variable${uriComponent}`)
        .then(({ body }) => {
            return (!hasMultiple ?
                mappify(body) :
                Object.keys(body).map((runKey) => ({
                    runKey,
                    variables: mappify(body[runKey]),
                }))
            );
        });
}

export async function getVariable(
    runKey: string | string[],
    variable: string | string[],
    optionals: GetOptions = {}
) {
    const {
        timeout, ritual,
        accountShortName, projectShortName, server,
    } = optionals;

    if (Array.isArray(runKey) || Array.isArray(variable)) {
        const variables = Array.isArray(variable) ? variable : [variable];
        return getVariables(runKey, variables, optionals);
    }

    return await new Router()
        .withServer(server)
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
 * @param {object}  update      Object with the key-value pairs you would like to update in the model
 * @param {object}  optionals   Something meaningful about optionals
 * @returns {object}            Object with the variables & new values that were updated
 */
export async function updateVariables(
    runKey: string | string[],
    update: UpdateOptions ,
    optionals: GetOptions = {}
) {
    const {
        timeout, ritual,
        accountShortName, projectShortName, server,
    } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .patch(`/run/variable${uriComponent}`, { body: update })
        .then(({ body }) => body);

}

export async function getMetadata(
    runKey: string | string[],
    metadata: string[],
    optionals: GetOptions = {}
) {
    const {
        timeout, ritual,
        accountShortName, projectShortName, server,
    } = optionals;
    const include = metadata.join(';');
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout, include } : { ritual, timeout, include };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/run/meta${uriComponent}`)
        .then(({ body }) => body);
}

export async function updateMetadata(
    runKey: string | string[],
    update: Record<string, any>,
    optionals: GetOptions = {}
) {
    const {
        timeout, ritual,
        accountShortName, projectShortName, server,
    } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .patch(`/run/meta${uriComponent}`, { body: update })
        .then(({ body }) => body);
}

export async function action(
    runKey: string | string[],
    actionList: Action[],
    optionals: GetOptions = {}
) {
    const {
        timeout, ritual,
        accountShortName, projectShortName, server,
    } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .post(`/run/action${uriComponent}`, { body: actionList })
        .then(({ body }) => body);

}

/**
 * Returns the run associated with the given world key; brings the run into memory, if the run does not exist, it will create it.
 *
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run/world/{WORLD_KEY}`
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter, authAdapter } from 'epicenter';
 * const worldKey = authAdapter.getLocalSession().worldKey
 * const run = await runAdapter.retrieveFromWorld(worldKey, 'model.py');
 *
 *
 * @param {object}  worldKey                        Key associated with the world you'd like a run from
 * @param {string}  model                           Name of model file you'd use to create the run if needed
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.readLock]            Role (character type)
 * @param {string}  [optionals.writeLock]           Role (chracter type)
 * @param {boolean} [optionals.ephemeral]           Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param {string}  [optionals.trackingKey]         Tracking key
 * @param {object}  [optionals.modelContext]        .ctx2 file overrides, this is not tracked by clone operations
 * @param {object}  [optionals.executionContext]    Carries arguments for model file worker on model initialization. This is tracked by clone operations.
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Run retrieved from the world
 */
export async function retrieveFromWorld(
    worldKey: string,
    model: string,
    optionals: CreateOptions = {}
): Promise<unknown> {
    const {
        readLock, writeLock, ephemeral, trackingKey,
        modelContext, executionContext,
        accountShortName, projectShortName, server,
    } = optionals;
    const { PARTICIPANT } = ROLE;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/world/${worldKey}`, {
            body: {
                permit: {
                    readLock: readLock || PARTICIPANT,
                    writeLock: writeLock || PARTICIPANT,
                },
                morphology: 'MANY',
                trackingKey,
                modelFile: model,
                modelContext: modelContext || {},
                executionContext: executionContext || {},
                ephemeral,
            },
        })
        .then(({ body }) => body);
}

/**
 * Deletes the run associated with the given world key
 *
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/run/world/{WORLD_KEY}`
 *
 * @memberof runAdapter
 * @example
 *
 * import { runAdapter, authAdapter } from 'epicenter';
 * const worldKey = authAdapter.getLocalSession().worldKey
 * const run = await runAdapter.removeFromWorld(worldKey);
 *
 *
 * @param {object}  worldKey                        Key associated with the world
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {object}                                Run retrieved from the world
 */
export async function removeFromWorld(worldKey: string, optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;

    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/run/world/${worldKey}`)
        .then(({ body }) => body);
}

// TODO -- revisit the code below when considering reimplmenting v2 run strategies
// async function serial(runKey: string, operations, optionals = {}) {
//     const normalizedOps = operations.map((item) => ({
//         name: typeof item === 'string' ? item : item.name,
//         params: item.params,
//     }));

//     //Perform all operations, sequentially
//     return normalizedOps.reduce((promise, { name, params }) => {
//         return promise.then(() => operation(runKey, name, params, optionals = {}));
//     }, Promise.resolve());
// }

// export async function getWithStrategy(strategy, model, scope, optionals = {}) {
//     const { initOperations = [] } = optionals;
//     if (strategy === 'reuse-across-sessions') {
//         const runs = await query(model, scope, { ...optionals, sort: ['-created'] });
//         if (runs.length) {
//             return runs[0];
//         }
//         const newRun = await create(model, scope, optionals = {});
//         await serial(newRun.runKey, initOperations, optionals = {});
//         return newRun;
//     } else if (strategy === 'reuse-never') {
//         const newRun = await create(model, scope, optionals = {});
//         await serial(newRun.runKey, initOperations, optionals = {});
//         return newRun;
//     } else if (strategy === 'reuse-by-tracking-key') {
//         //TBD write out if needed
//         //Platform plans to introduce run limits into episode scope, differing from v2's implementation of runLimit via 'reuse-by-tracking-key'
//     } else if (strategy === 'multiplayer') {
//         //TODO when multiplayer API is ready
//         //check the current world for this end user, return the current run for that world (if there is none, create a run for the world)
//     }
//     throw new EpicenterError('Invalid run strategy.');
// }
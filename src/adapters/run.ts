import type { UserSession } from '../utils/identification';
import type { GenericScope, GenericSearchOptions, Permit, Address } from '../utils/constants';
import type { RoutingOptions, Page } from '../utils/router';
import type { PseudonymReadOutView } from './user';

import {
    Router,
    identification,
    ROLE,
    SCOPE_BOUNDARY,
    RITUAL,
    EpicenterError,
    parseFilterInput,
} from 'utils';

// Generic type parameters for Run variables and metadata
export type RunVariables = Record<string, unknown>;
export type RunMetadata = Record<string, unknown>;

export interface V2ModelContext {
    variables?: Record<string, VariableOptions>;
    externalFunctions?: Record<string, WireExternalFunction>;
    modelVersion?: number;
    mappedFiles?: Record<string, string>;
    control?: ExcelModelControl | JavaModelControl | PowersimModelControl | VensimModelControl;
    language?: string;
    protections?: Protections;
    restorations?: Restorations;
    version: string;
    workerImage?: string;
    dependencies?: (AptExternalDependency | CranExternalDependency | GitExternalDependency | JuliaExternalDependency | NpmExternalDependency | PypiExternalDependency | ShellExternalDependency)[];
    operations?: Record<string, OperationOptions>;
    defaults?: ModelContextDefaults;
    enableStateCache?: boolean;
    redirectStandardOut?: boolean;
    startDebugger?: boolean;
    inceptionGracePeriodSeconds?: number;
    minimumLogLevel?: string;
    events?: Record<string, EventOptions>;
}

export interface ModelContext extends V2ModelContext {}

export interface VariableOptions {
    resetDecision?: boolean;
    dialect?: string;
    save?: boolean;
    reportPer?: number;
    sensitivity?: boolean;
    reportOffset?: number;
}

export interface WireExternalFunction {
    route?: Route;
    arguments?: string;
    objectType: 'wire';
}

export interface Route {
    service?: string;
    version?: number;
}

export interface ExcelModelControl {
    autoRecalculate?: boolean;
    objectType: 'excel';
}

export interface JavaModelControl {
    executable?: string;
    objectType: 'java';
}

export interface PowersimModelControl {
    minimizeMemoryFootprint?: boolean;
    objectType: 'powersim';
}

export interface VensimModelControl {
    sensitivityControl?: 'SensitivityControl';
    extensionModule?: string;
    objectType: 'vensim';
}

export interface Protections {
    guards: (InputGuard | OverwriteGuard | PrivilegeGuard | RelativeGuard | RoleGuard)[];
}

export interface InputGuard {
    regex: string;
    operand?: string;
    operator?: string;
    objectType: 'input';
}

export interface OverwriteGuard {
    regex: string;
    dialect?: string;
    initial: string;
    objectType: 'overwrite';
}

export interface PrivilegeGuard {
    regex: string;
    read: string;
    domain: string;
    grant: string;
    write: string;
    execute: string;
    objectType: 'privilege';
}

export interface RelativeGuard {
    regex: string;
    dialect?: string;
    value: string;
    operator: string;
    key: string;
    objectType: 'relative';
}

export interface RoleGuard {
    regex: string;
    role: string;
    domain: string;
    grant: string;
    objectType: 'role';
}

export interface Restorations {
    rewind?: RewindMarker;
    log?: string;
    assembly?: (ReplayRestoration | SnapshotRestoration)[];
}

export interface RewindMarker {
    name?: string;
    destructible?: boolean;
    arguments?: Record<string, unknown>;
}

export interface ReplayRestoration {
    replay: {
        operations?: ReplayOperation[];
    };
}

export interface ReplayOperation {
    targetType: string;
    operationType: string;
    targetKey: string;
}

export interface SnapshotRestoration {
    variables?: string[];
    objectType: 'snapshot';
}

export interface AptExternalDependency {
    package?: string;
    repository?: string;
    version?: string;
    objectType: 'apt';
}

export interface CranExternalDependency {
    package?: string;
    version?: string;
    objectType: 'cran';
}

export interface GitExternalDependency {
    url?: string;
    script?: string;
    objectType: 'git';
}

export interface JuliaExternalDependency {
    package?: string;
    version?: string;
    objectType: 'julia';
}

export interface NpmExternalDependency {
    package?: string;
    version?: string;
    objectType: 'npm';
}

export interface PypiExternalDependency {
    package?: string;
    version?: string;
    objectType: 'pypi';
}

export interface ShellExternalDependency {
    script?: string;
    objectType: 'shell';
}

export interface OperationOptions {
    timeoutSeconds?: number;
    inert?: boolean;
}

export interface ModelContextDefaults {
    variables?: VariableOptions;
    operations?: OperationOptions;
    events?: EventOptions;
}

export interface EventOptions {
    timeoutSeconds?: number;
}

export interface V1ExecutionContext {
    presets?: Record<string, Record<string, unknown>>;
    mappedFiles?: Record<string, string>;
    version: string;
    tool?: StellaModelTool | VensimModelTool;
};

export interface ExecutionContext extends V1ExecutionContext {}

export interface StellaModelTool {
    objectType: 'stella';
    gameMode?: boolean;
}

export interface VensimModelTool {
    objectType: 'vensim';
    sensitivityMode?: boolean;
    cinFiles?: string[];
}

export enum MORPHOLOGY {
    MANY = 'MANY',
    PROXY = 'PROXY',
    SINGULAR = 'SINGULAR',
}

export interface ProcActionable {
    name: string;
    arguments?: unknown[];
    objectType: 'execute';
}

export interface GetActionable {
    name: string;
    objectType: 'get';
}

export interface SetActionable {
    name: string;
    value: unknown;
    objectType: 'set';
}

export type Actionable =
    | ProcActionable
    | GetActionable
    | SetActionable;


export type RunReadOutView<
    V extends RunVariables = RunVariables,
    M extends RunMetadata = RunMetadata,
> = {
    cluster?: string;
    hidden?: boolean;
    modelVersion?: number;
    lastOperated?: string;
    modelLanguage?: string;
    perpetual?: boolean;
    cloud?: string;
    metaData?: M;
    grammar?: string;
    trackingKey?: string;
    scope: { userKey?: string } & GenericScope;
    executionContext?: V1ExecutionContext;
    allowChannel?: boolean;
    marked?: boolean;
    variables?: V;
    address?: Address;
    tombstone?: string;
    morphology?: string;
    modelFile?: string;
    created?: string;
    runKey: string;
    permit?: Permit;
    closed?: boolean;
    lastModified?: string;
    runState?: string;
    user?: PseudonymReadOutView;
};

export type RunCreateOptions = {
    readLock?: keyof typeof ROLE;
    writeLock?: keyof typeof ROLE;
    ephemeral?: boolean;
    trackingKey?: string;
    modelContext?: ModelContext;
    executionContext?: ExecutionContext;
    allowChannel?: boolean;
} & RoutingOptions;

export type RunStrategy =
    | 'reuse-across-sessions'
    | 'reuse-never'
    | 'reuse-by-tracking-key'
    | 'multiplayer';

/**
 * Creates a run. By default, all runs are created with the user's ID (`userKey`), except in the case of world-scoped runs.
 * If no permit is specified, platform will assign a default determined by the session user type and the scope boundary.
 * For a participant creating a run, the default readLock/writeLock is `USER/USER`, unless that run is scoped to a world,
 * in which case `PARTICIPANT/FACILITATOR` is the default. Admins and facilitators/reviewers have their own defaults.
 * @example
 * import { runAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * runAdapter.create('model.py', {
 *      scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *      scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461'
 * });
 * @param model                         Name of your model file
 * @param scope                         Scope associated with your run
 * @param scope.scopeBoundary           Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]          Read permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.writeLock]         Write permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.ephemeral]         Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param [optionals.trackingKey]       Tracking key
 * @param [optionals.modelContext]      .ctx2 file overrides, this is not tracked by clone operations
 * @param [optionals.executionContext]  Carries arguments for model file worker on model initialization. This is tracked by clone operations.
 * @param [optionals.allowChannel]      Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @returns promise that resolves to the newly created run
 */
export async function create<
    V extends RunVariables = RunVariables,
    M extends RunMetadata = RunMetadata,
>(
    model: string,
    scope: { userKey?: string } & GenericScope,
    optionals: RunCreateOptions = {},
): Promise<RunReadOutView<V, M>> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const {
        readLock,
        writeLock,
        ephemeral,
        trackingKey,
        modelContext,
        executionContext,
        allowChannel,
        ...routingOptions
    } = optionals;

    const { WORLD } = SCOPE_BOUNDARY;
    const session = identification.session as UserSession;

    const hasPermit = readLock || writeLock;
    const headers = Object.assign(
        {},
        routingOptions.headers,
        hasPermit ? { 'X-Forio-Confirmation': true } : {},
    );
    const permit = hasPermit ? { readLock, writeLock } : undefined;

    return await new Router()
        .post('/run', {
            body: {
                scope: {
                    scopeBoundary,
                    scopeKey,
                    userKey: scopeBoundary === WORLD ?
                        undefined :
                        userKey ?? session?.userKey,
                },
                permit,
                morphology: 'MANY',
                trackingKey,
                modelFile: model,
                modelContext: modelContext || {/* Is not recorded for clone. Overrides model ctx2 file. */},
                executionContext: executionContext || {/* Affected by clone. Carries arguments for model file worker on model initialization */},
                ephemeral,
                allowChannel,
            },
            ...routingOptions,
            headers,
        }).then(({ body }) => body);
}

/**
 * Creates a project scoped run
 * @example
 * import { runAdapter } from 'epicenter-libs';
 * runAdapter.createSingular('model.py');
 * NOTE permit default behavior based on who starts the run:
 * * Admin: read/write Author, User with World: read PARTICPANT, write FACILITATOR, User with Group: read/write USER,
 * @param model                         Name of your model file
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]          Read permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.writeLock]         Write permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.ephemeral]         Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param [optionals.modelContext]      .ctx2 file overrides, this is not tracked by clone operations
 * @param [optionals.executionContext]  Carries arguments for model file worker on model initialization. This is tracked by clone operations.
 * @returns promise that resolves to the newly created run
 */
export async function createSingular<
    V extends RunVariables = RunVariables,
    M extends RunMetadata = RunMetadata,
>(
    model: string,
    optionals: RunCreateOptions = {},
): Promise<RunReadOutView<V, M>> {
    const {
        readLock, writeLock, ephemeral,
        modelContext, executionContext,
        ...routingOptions
    } = optionals;

    const hasPermit = readLock || writeLock;
    const headers = Object.assign(
        {},
        routingOptions.headers,
        hasPermit ? { 'X-Forio-Confirmation': true } : {},
    );
    const permit = hasPermit ? { readLock, writeLock } : undefined;

    return await new Router()
        .post('/run/singular', {
            body: {
                modelFile: model,
                permit,
                modelContext: modelContext || {/* Is not recorded for clone. Overrides model ctx2 file. */},
                executionContext: executionContext || {/* Affected by clone. Carries arguments for model file worker on model initialization */},
                ephemeral,
            },
            ...routingOptions,
            headers,
        }).then(({ body }) => body);
}

/**
 * Gets the singular run's runKey
 * @example
 * import { runAdapter } from 'epicenter-libs';
 * runAdapter.getSingularRunKey();
 * @returns promise that resolves to a runKey
 */
export async function getSingularRunKey(
    optionals: RoutingOptions = {},
): Promise<number> {
    return await new Router()
        .get('/run/singular/key', optionals)
        .then(({ body }) => body);
}

/**
 * Clone a run
 * @param runKey                        RunReadOutView key for the run you want to clone
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.ephemeral]         Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param [optionals.trackingKey]       Tracking key
 * @param [optionals.modelContext]      .ctx2 file overrides, this is not tracked by clone operations
 * @param [optionals.executionContext]  Carries arguments for model file worker on model initialization. This is tracked by clone operations.
 * @returns promise that resolves to the cloned run
 */
export async function clone(
    runKey: string,
    optionals: {
        ephemeral?: boolean;
        trackingKey?: string;
        modelContext?: ModelContext;
        executionContext?: ExecutionContext;
    } & RoutingOptions = {},
): Promise<RunReadOutView> {
    const {
        ephemeral, trackingKey, modelContext = {}, executionContext = {},
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/run/clone/${runKey}`, {
            body: {
                trackingKey,
                modelContext,
                executionContext,
                ephemeral,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

export async function restore(
    runKey: string,
    optionals: {
        ephemeral?: boolean;
        modelContext?: ModelContext;
        executionContext?: ExecutionContext;
    } & RoutingOptions = {},
): Promise<RunReadOutView> {
    const {
        ephemeral, modelContext = {}, executionContext = {},
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/run/restore/${runKey}`, {
            body: {
                modelContext,
                executionContext,
                ephemeral,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

export async function rewind(
    runKey: string,
    steps: number,
    optionals: {
        ephemeral?: boolean;
        modelContext?: ModelContext;
    } & RoutingOptions = {},
): Promise<RunReadOutView> {
    const {
        ephemeral, modelContext = {},
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/run/rewind/${runKey}`, {
            body: {
                rewindCount: steps,
                modelContext,
                ephemeral,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

export async function update(
    runKey: string,
    update: {
        readLock?: keyof typeof ROLE;
        writeLock?: keyof typeof ROLE;
        trackingKey?: string;
        marked?: boolean; /* analogous to v2's 'saved' */
        hidden?: boolean; /* analogous to v2's 'trashed' */
        closed?: boolean; /* Closed is a flag that means do not restore, the run is done, no more play */
        allowChannel?: boolean; /* Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT */
    },
    optionals: RoutingOptions = {},
): Promise<RunReadOutView> {
    const {
        readLock,
        writeLock,
        trackingKey,
        marked,
        hidden,
        closed,
        allowChannel,
    } = update;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const permit = (readLock || writeLock) ? { readLock, writeLock } : undefined;

    return await new Router()
        .withSearchParams(hasMultiple ? { runKey } : '')
        .patch(`/run${uriComponent}`, {
            body: {
                permit,
                trackingKey,
                marked,
                hidden,
                closed,
                allowChannel,
            },
            ...optionals,
        }).then(({ body }) => body);
}


/**
 * *Does not actually delete the run*. The run is instead removed from memory. This can be used as a means of preserving server CPUs, and should be used when you do not expect to perform any addtional actions that would bring the run back into memory. (TODO: see David for details; is it just operations that bring the run into memory? what about clone... etc.)
 * @example
 * epicenter.runAdapter.remove('00000173078afb05b4ae4c726637167a1a9e');
 * @param runKey        Key associated with the run
 * @param [optionals]   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @returns promise that resolve to undefined if successful
 */
export async function remove(
    runKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .delete(`/run/${runKey}`, optionals)
        .then(({ body }) => body);
}

export async function get<
    V extends RunVariables = RunVariables,
    M extends RunMetadata = RunMetadata,
>(
    runKey: string,
    optionals: RoutingOptions = {},
): Promise<RunReadOutView<V, M>> {
    return await new Router()
        .get(`/run/${runKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Queries for runs.
 * @example
 * import { runAdapter } from 'epicenter-libs';
 * runAdapter.query('model.xlsx', {
 *      filter: [
 *          'var.foo|=1|2|3',               // look for runs with a variable 'foo' with the values 1, 2, or 3
 *          'var.score>=24',                // looks for runs with a variable 'score' higher than or equal to 24
 *          'var.certified*=true'           // looks for runs where the variable 'certified' exists,
 *          'run.hidden=false',             // where the run's 'hidden' attribute is false
 *          'meta.classification~=bar-*'    // where the run metadata contains a 'classification' that begins with 'bar-',
 *          'meta.categorization~=*-baz'    // where the run metadata contains a 'categorization' that does not end with '-baz',
 *      ],
 *      sort: ['+run.created']              // sort all findings by the 'created' field (ascending)
 *      variables: ['foo', 'baz'],          // include the run variables for 'foo' and 'baz' in the response
 *      metadata: ['classification']        // include the run metadata for 'classification' in the response
 * });
 * @param model                                 Name of your model file
 * @param searchOptions                         Search options
 * @param [searchOptions.scope.scopeBoundary]   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param [searchOptions.scope.scopeKey]        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [searchOptions.scope.userKey]         User attached to scope if necessary
 * @param [searchOptions.filter]                List of conditionals to filter for
 * @param [searchOptions.sort]                  List of values to sort by (applies only to run attributes)
 * @param [searchOptions.variables]             List of variables to include with the runs found
 * @param [searchOptions.metadata]              List of metadata to include with the runs found
 * @param [searchOptions.first]                 The index from which we collect our runs from
 * @param [searchOptions.max]                   The maximum number of runs to return (upper limit: 200)
 * @param [searchOptions.timeout]               Number of seconds we're willing to wait for the response from the server
 * @param [searchOptions.includeEpisodes]       Only used for the `run/in/groupName` endpoint
 * @param [optionals]                           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a page of runs
 */
export async function query<
    V extends RunVariables = RunVariables,
    M extends RunMetadata = RunMetadata,
>(
    model: string,
    searchOptions: {
        timeout?: number;
        variables?: (keyof V)[];
        metadata?: (keyof M)[];
        scope?: { userKey?: string } & GenericScope;
        groupName?: string;
        episodeName?: string;
        includeEpisodes?: boolean;
    } & GenericSearchOptions,
    optionals: RoutingOptions = {},
): Promise<Page<RunReadOutView<V, M>>> {
    const {
        filter, sort = [], first, max, timeout, variables = [], metadata = [],
        scope, groupName, episodeName, includeEpisodes,
    } = searchOptions;
    const session = identification.session as UserSession;
    const uriComponent = scope ?
        `${scope.scopeBoundary}/${scope.scopeKey}` :
        `in/${groupName ?? session?.groupName}${episodeName ? `/${episodeName}` : ''}`;

    // Handle additional filters that need to be added programmatically
    let finalFilter = filter;
    if (scope?.userKey) {
        const userKeyFilter = `run.userKey=${scope.userKey}`;
        if (Array.isArray(filter)) {
            finalFilter = [...filter, userKeyFilter];
        } else if (typeof filter === 'string') {
            finalFilter = filter ? `${filter};${userKeyFilter}` : userKeyFilter;
        } else if (filter && typeof filter === 'object') {
            // For FilterGroup objects, wrap the existing filter and the userKey filter in an AND group
            finalFilter = {
                type: 'and' as const,
                filters: [filter, userKeyFilter],
            };
        } else {
            finalFilter = [userKeyFilter];
        }
    }

    const searchParams = {
        filter: parseFilterInput(finalFilter),
        sort: sort.join(';') || undefined,
        var: (variables as string[]).join(';') || undefined,
        meta: (metadata as string[]).join(';') || undefined,
        first, max, timeout, includeEpisodes,
    };

    return await new Router()
        .withSearchParams(searchParams)
        .get(`/run/${uriComponent}/${model}`, {
            paginated: true,
            parsePage: (values: RunReadOutView[]) => {
                return values.map((run) => {
                    run.variables = variables.reduce((variableMap, key, index) => {
                        // TODO -- add a test case to run.spec that makes sure it does not error if it receives run w/o 'variables'
                        variableMap[key as keyof V] = run.variables?.[index] as V[keyof V];
                        return variableMap;
                    }, {} as Pick<V, keyof V>);
                    return run;
                });
            },
            ...optionals,
        })
        .then(({ body }) => body);
}

export async function introspect(
    model: string,
    optionals: RoutingOptions = {},
): Promise<Record<string, unknown>> {
    return await new Router()
        .get(`/run/introspect/model/${model}`, optionals)
        .then(({ body }) => body);
}

export async function introspectWithRunKey(
    runKey: string,
    optionals: RoutingOptions = {},
): Promise<Record<string, unknown>> {
    return await new Router()
        .get(`/run/introspect/${runKey}`, optionals)
        .then(({ body }) => body);
}

export async function operation(
    runKey: string | string[],
    name: string,
    args: unknown[] = [],
    optionals: {
        timeout?: number;
        ritual?: keyof typeof RITUAL;
    } & RoutingOptions = {},
): Promise<unknown> {
    const {
        timeout, ritual,
        ...routingOptions
    } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withSearchParams(searchParams)
        .post(`/run/operation${uriComponent}`, {
            body: {
                name,
                arguments: args,
                objectType: 'execute', // TODO: remove this when platform fixes this so that it's not manually required
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

export async function getVariables<V extends RunVariables = RunVariables>(
    runKey: string | string[],
    variables: (keyof V)[],
    optionals: {
        timeout?: number;
        ritual?: keyof typeof RITUAL;
        ignorable?: boolean;
    } & RoutingOptions = {},
): Promise<
    | Pick<V, keyof V>
    | { runKey: string; variables: Pick<V, keyof V> }[]
> {
    const {
        timeout, ritual, ignorable,
        ...routingOptions
    } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    const mappify = (values: unknown[]): Pick<V, keyof V> => variables.reduce((variableMap, key, index) => {
        variableMap[key as keyof V] = values[index] as V[keyof V];
        return variableMap;
    }, {} as Pick<V, keyof V>);

    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const include = (variables as string[]).join(';');
    const body = hasMultiple ? { runKey, include, timeout } : { ritual, include, timeout };
    const additional = ignorable ? { ignorable } : {};
    return await new Router()
        .post(`/run/variable${uriComponent}`, {
            body: {
                ...body,
                ...additional,
            },
            ...routingOptions,
        })
        .then(({ body }) => {
            if (hasMultiple) {
                return Object.keys(body).map((runKey) => ({
                    runKey,
                    variables: mappify(body[runKey]),
                }));
            }
            return mappify(body);
        });
}

export async function getVariable<V extends RunVariables = RunVariables>(
    runKey: string | string[],
    variable: keyof V | (keyof V)[],
    optionals: {
        timeout?: number;
        ritual?: keyof typeof RITUAL;
    } & RoutingOptions = {},
): Promise<
    | V[keyof V]
    | Pick<V, keyof V>
    | { runKey: string; variables: Pick<V, keyof V> }[]
> {
    const { timeout, ritual, ...routingOptions } = optionals;

    if (Array.isArray(runKey) || Array.isArray(variable)) {
        const variables = Array.isArray(variable) ? variable : [variable];
        return getVariables(runKey, variables, optionals);
    }

    return await new Router()
        .withSearchParams({ timeout, ritual })
        .get(`/run/variable/${runKey}/${String(variable)}`, routingOptions)
        .then(({ body }) => body);
}
/**
 * Updates model variables for the run
 * @param runKey                Identifier for your run
 * @param update                Object with the key-value pairs you would like to update in the model
 * @param [optionals]           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.timeout]   TODO -- this does something, it's just that the frontend devs don't know what yet
 * @param [optionals.ritual]    TODO -- this does something, it's just that the frontend devs don't know what yet
 * @returns promise that resolve to an object with the variables & new values that were updated
 */
export async function updateVariables<V extends RunVariables = RunVariables>(
    runKey: string | string[],
    update: Partial<V>,
    optionals: {
        timeout?: number;
        ritual?: keyof typeof RITUAL;
    } & RoutingOptions = {},
): Promise<Partial<V>> {
    const {
        timeout, ritual,
        ...routingOptions
    } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withSearchParams(searchParams)
        .patch(`/run/variable${uriComponent}`, {
            body: update,
            ...routingOptions,
        })
        .then(({ body }) => body);
}

export async function getMetadata<M extends RunMetadata = RunMetadata>(
    runKey: string | string[],
    metadata: (keyof M)[],
    optionals: {
        timeout?: number;
    } & RoutingOptions = {},
): Promise<
    | Pick<M, keyof M>
    | { runKey: string; data: Pick<M, keyof M> }[]
> {
    const {
        ...routingOptions
    } = optionals;
    const include = (metadata as string[]).join(';');
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;

    const runKeyArg = Array.isArray(runKey) ? runKey : [runKey];
    return await new Router()
        .post('/run/meta', {
            body: {
                include,
                runKey: runKeyArg,
            },
            ...routingOptions,
        })
        .then(({ body }) => {
            const bodyAsArray = Object.keys(body).map((runKey) => ({
                runKey,
                data: body[runKey],
            }));
            return (
                hasMultiple ? bodyAsArray : bodyAsArray?.[0]?.data
            );
        });
}

export async function updateMetadata<M extends RunMetadata = RunMetadata>(
    runKey: string | string[],
    update: Partial<M>,
    optionals: {
        timeout?: number;
    } & RoutingOptions = {},
): Promise<Partial<M>> {
    const {
        timeout,
        ...routingOptions
    } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { timeout };

    return await new Router()
        .withSearchParams(searchParams)
        .patch(`/run/meta${uriComponent}`, {
            body: update,
            ...routingOptions,
        })
        .then(({ body }) => body);
}

export async function action(
    runKey: string | string[],
    actionList: Actionable[],
    optionals: {
        timeout?: number;
        ritual?: keyof typeof RITUAL;
    } & RoutingOptions = {},
): Promise<Record<string, unknown>> {
    const {
        timeout, ritual,
        ...routingOptions
    } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUAL.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withSearchParams(searchParams)
        .post(`/run/action${uriComponent}`, {
            body: actionList,
            ...routingOptions,
        })
        .then(({ body }) => body);
}

/**
 * Returns the run associated with the given world key; brings the run into memory, if the run does not exist, it will create it.
 * See `runAdapter.create` for more information about platform-determined default permits.
 * @example
 * import { runAdapter } from 'epicenter-libs';
 * const run = await runAdapter.retrieveFromWorld('0000017a445032dc38cb2cecd5fc13708314', 'model.py');
 * @param worldKey                      Key associated with the world you'd like a run from
 * @param model                         Name of model file you'd use to create the run if needed
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]          Read permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.writeLock]         Write permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.ephemeral]         Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param [optionals.trackingKey]       Tracking key
 * @param [optionals.modelContext]      .ctx2 file overrides, this is not tracked by clone operations
 * @param [optionals.executionContext]  Carries arguments for model file worker on model initialization. This is tracked by clone operations.
 * @param [optionals.allowChannel]      Opt into push notifications for this resource. Applicable to projects with phylogeny >= SILENT
 * @returns promise that resolves to the run retrieved from, or created for the world
 */
export async function retrieveFromWorld(
    worldKey: string,
    model: string,
    optionals: {
        readLock?: keyof typeof ROLE;
        writeLock?: keyof typeof ROLE;
        ephemeral?: boolean;
        trackingKey?: string;
        modelContext?: ModelContext;
        executionContext?: ExecutionContext;
        allowChannel?: boolean;
    } & RoutingOptions = {},
): Promise<RunReadOutView> {
    const {
        readLock,
        writeLock,
        ephemeral,
        trackingKey,
        modelContext,
        executionContext,
        allowChannel,
        ...routingOptions
    } = optionals;

    const hasPermit = readLock || writeLock;
    const headers = Object.assign(
        {},
        routingOptions.headers,
        hasPermit ? { 'X-Forio-Confirmation': true } : {},
    );
    const permit = hasPermit ? { readLock, writeLock } : undefined;

    return await new Router()
        .post(`/run/world/${worldKey}`, {
            body: {
                permit,
                morphology: 'MANY',
                trackingKey,
                modelFile: model,
                modelContext: modelContext || {},
                executionContext: executionContext || {},
                ephemeral,
                allowChannel,
            },
            ...routingOptions,
            headers,
        })
        .then(({ body }) => body);
}

/**
 * Removes the run associated with the given world key
 * @example
 * epicenter.runAdapter.removeFromWorld('0000017a445032dc38cb2cecd5fc13708314');
 * @param worldKey      Key associated with the world
 * @param [optionals]   Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to undefined when successful
 */
export async function removeFromWorld(
    worldKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .delete(`/run/world/${worldKey}`, optionals)
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

/**
 * Queries for and/or creates a run, depending on the strategy provided.
 *
 * 'reuse-across-sessions' -- will get the most recent run for the given scope, creating it if it does not exist
 * 'reuse-never' -- will create a new run every time
 *
 * @example
 *
 * import { runAdapter } from 'epicenter-libs';
 * runAdapter.getWithStrategy(
 *     'reuse-across-sessions',
 *     'model.py',
 *     {
 *         scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *         scopeKey: '123456789',
 *     },
 * );
 *
 * @param strategy                      Strategy to use when retrieving the run
 * @param model                         Name of your model file
 * @param scope                         Scope associated with your run
 * @param scope.scopeBoundary           Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.readLock]          Read permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.writeLock]         Write permission role; one of the strings defined in epicenter.ROLE
 * @param [optionals.ephemeral]         Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param [optionals.trackingKey]       Tracking key
 * @param [optionals.modelContext]      .ctx2 file overrides, this is not tracked by clone operations
 * @param [optionals.executionContext]  Carries arguments for model file worker on model initialization. This is tracked by clone operations.
 * @returns promise that resolves to a run
 */

export async function getWithStrategy<
    V extends RunVariables = RunVariables,
    M extends RunMetadata = RunMetadata,
>(
    strategy: RunStrategy,
    model: string,
    scope: GenericScope,
    optionals: {
        // initOperations?: Array<string | { name: string, params?: unknown[]}>,
    } & RunCreateOptions = {},
): Promise<RunReadOutView<V, M>> {
    // const { initOperations = [] } = optionals;
    if (strategy === 'reuse-across-sessions') {
        const searchOptions = {
            scope,
            sort: ['-run.created'],
            max: 1,
        };
        const { values: [lastRun] } = await query<V, M>(model, searchOptions);
        if (!lastRun) {
            const newRun = await create<V, M>(model, scope, optionals);
            // await serial(newRun.runKey, initOperations, optionals = {});
            return newRun;
        }
        return lastRun;
    } else if (strategy === 'reuse-never') {
        const newRun = await create<V, M>(model, scope, optionals);
        // await serial(newRun.runKey, initOperations, optionals = {});
        return newRun;
    } else if (strategy === 'reuse-by-tracking-key') {
        // TBD write out if needed
        // Platform plans to introduce run limits into episode scope, differing from v2's implementation of runLimit via 'reuse-by-tracking-key'
    } else if (strategy === 'multiplayer') {
        // TODO when multiplayer API is ready
        // check the current world for this end user, return the current run for that world (if there is none, create a run for the world)
    }
    throw new EpicenterError('Invalid run strategy.');
}

/**
 * Clone a run into a novel episode scope
 * @param runKey                        Source run key for the run you want to copy and migrate
 * @param episodeKey                    Destination episode key for the run's new episode scope
 * @param [optionals]                   Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.ephemeral]         Used for testing. If true, the run will only exist so long as its in memory; makes it so that nothing is written to the database, history, or variables.
 * @param [optionals.trackingKey]       Tracking key
 * @param [optionals.modelContext]      .ctx2 file overrides, this is not tracked by migrate operations
 * @param [optionals.executionContext]  Carries arguments for model file worker on model initialization. This is tracked by migrate operations.
 * @returns promise that resolves to the migrated run
 */
export async function migrate<
    V extends RunVariables = RunVariables,
    M extends RunMetadata = RunMetadata,
>(
    runKey: string,
    episodeKey: string,
    optionals: {
        ephemeral?: boolean;
        trackingKey?: string;
        modelContext?: ModelContext;
        executionContext?: ExecutionContext;
    } & RoutingOptions = {},
): Promise<RunReadOutView<V, M>> {
    const {
        ephemeral, trackingKey, modelContext = {}, executionContext = {},
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(`/run/migrate/to/${episodeKey}/${runKey}`, {
            body: {
                trackingKey,
                modelContext,
                executionContext,
                ephemeral,
            },
            ...routingOptions,
        }).then(({ body }) => body);
}

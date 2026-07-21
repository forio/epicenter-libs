import type { Address, GenericScope, GenericSearchOptions } from '../utils/constants';
import type { Page, RoutingOptions } from '../utils/router';

import { parseFilterInput } from '../utils/filter-parser';
import Router from '../utils/router';

export enum RETRY_POLICY {
    DO_NOTHING = 'DO_NOTHING', // If the task fails, do nothing (this is the default)
    FIRE_ON_FAIL_SAFE = 'FIRE_ON_FAIL_SAFE', // Retry within the task's fail-safe execution window
}

// Generic type aliases for task adapter
export type TaskPayloadBody = Record<string, unknown>;
export type TaskPayloadHeaders = Record<string, string>;
export type TaskHttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE';
export type TaskRetryPolicyReadOutView = 'do_nothing' | 'fire_on_fail_safe';
export type TaskStatusReadOutView =
    | 'initialized'
    | 'triggered'
    | 'succeeded'
    | 'failed'
    | 'cancelled'
    | 'terminated';
export type TaskAddressReadOutView = Partial<Address>;

export interface TaskScopeReadOutView extends GenericScope {
    userKey?: string;
}

// Status type for group status tasks
export interface StatusReadOutView {
    code?: string;
    message?: string;
}

export interface StatusCreateInView {
    code: string;
    message: string;
}

// Trigger type definitions for creating tasks
export interface CronTaskTriggerCreateInView {
    objectType: 'cron';
    value: string;
}

export interface DateTaskTriggerCreateInView {
    objectType: 'date';
    value: string;
}

export interface OffsetTaskTriggerCreateInView {
    objectType: 'offset';
    minutes?: number;
    hours?: number;
    days?: number;
}

export type TaskTriggerCreateInView =
    | CronTaskTriggerCreateInView
    | DateTaskTriggerCreateInView
    | OffsetTaskTriggerCreateInView;

// Payload type definitions for creating tasks
export interface HttpTaskPayloadCreateInView<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
> {
    objectType: 'http';
    method: TaskHttpMethod;
    url: string;
    target?: 'APPLICATION' | 'PROXY';
    body: B;
    headers?: H;
    timeoutSeconds?: number;
}

export interface GroupStatusTaskPayloadCreateInView {
    objectType: 'groupStatus';
    groupKey: string;
    status: StatusCreateInView;
}

export type TaskPayloadCreateInView<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
> =
    | HttpTaskPayloadCreateInView<B, H>
    | GroupStatusTaskPayloadCreateInView;

export type HttpTaskPayloadCreateInput<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
> = Omit<HttpTaskPayloadCreateInView<B, H>, 'objectType'> & {
    objectType?: 'http';
};

export type TaskPayloadCreateInput<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
> = HttpTaskPayloadCreateInput<B, H> | GroupStatusTaskPayloadCreateInView;

// Payload type definitions for reading tasks
export interface HttpTaskPayloadReadOutView<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
> {
    objectType: 'http';
    method?: TaskHttpMethod;
    url?: string;
    target?: 'application' | 'proxy';
    body?: B;
    headers?: H;
    timeoutSeconds?: number;
}

export interface GroupStatusTaskPayloadReadOutView {
    objectType: 'groupStatus';
    groupKey?: string;
    status?: StatusReadOutView;
}

export type TaskPayloadReadOutView<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
> =
    | HttpTaskPayloadReadOutView<B, H>
    | GroupStatusTaskPayloadReadOutView;

// Task response structure
export interface TaskReadOutView<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
> {
    taskKey?: string;
    name?: string;
    status?: TaskStatusReadOutView;
    cron?: string;
    mutationKey?: string;
    failures?: number;
    successes?: number;
    address?: TaskAddressReadOutView;
    payload?: TaskPayloadReadOutView<B, H>;
    scope?: TaskScopeReadOutView;
    retryPolicy?: TaskRetryPolicyReadOutView;
    failSafeTermination?: string;
    ttlSeconds?: number;
}

export interface TaskHistoryReadOutView {
    result?: string;
    execution?: number;
    response?: number;
    success?: boolean;
    taskId?: number;
}

export interface TaskPageOptions {
    first?: number;
    max?: number;
}

export interface TaskScopePageOptions extends TaskPageOptions {
    sort?: string[];
}

/**
 * Creates a task; requires facilitator (or higher) privileges
 * Base URL: POST `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task`
 *
 * @example
 * import { taskAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const scope = {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: session.groupKey,
 * };
 * const name = 'task-1-send-emails';
 * const payload = {
 *     method: 'POST',
 *     url: '/send-out-emails',
 *     target: 'PROXY', // fire at the project's proxy server; omit to fire at the app
 *     body: {},
 * };
 * const trigger = {
 *     value: '0 7 15 * * ?', // triggers on day 15 7am of each month
 *     objectType: 'cron',
 * };
 * await taskAdapter.create(scope, name, payload, trigger);
 *
 * @param scope                                 Scope associated with the task
 * @param scope.scopeBoundary                   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]                       Key associated with the user
 * @param name                                  Name of the task
 * @param payload                               An HTTP request or group-status change to execute when the task is triggered
 * @param payload.method                        Type of method to use with the HTTP request (e.g., 'GET', 'POST')
 * @param payload.url                           Relative URL the HTTP request will be sent to; the task runner builds the full URL as `{host}{targetPath}/{account}/{project}{url}`
 * @param [payload.target]                      Where the task fires: 'APPLICATION' (the project app, `/app`, the default) or 'PROXY' (the project's proxy server, `/proxy`)
 * @param payload.body                          The JSON body of the HTTP request
 * @param [payload.headers]                     Headers to send along with the HTTP request; must be non-empty when provided — omit rather than pass an empty object
 * @param [payload.timeoutSeconds]               Request timeout in seconds (1–30)
 * @param trigger                               Object that determines when to run the task (cron, offset, or date)
 * @param [trigger.value]                       For cron: cron expression (e.g., '0 7 * * * ?'). For date: ISO-8601 date-time string
 * @param [trigger.objectType]                  Type of trigger: 'cron', 'offset', or 'date'
 * @param [trigger.minutes]                     For offset triggers: number of minutes until the task triggers
 * @param [trigger.hours]                       For offset triggers: number of hours until the task triggers
 * @param [trigger.days]                        For offset triggers: number of days until the task triggers
 * @param [optionals]                           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @param [optionals.retryPolicy]               Specifies what to do should the task fail; see RETRY_POLICY
 * @param [optionals.failSafeTermination]       ISO-8601 deadline after which the task terminates; the server defaults and caps this at one year from creation
 * @param [optionals.ttlSeconds]                Execution fail-safe window in seconds; the server applies its configured minimum
 * @returns promise that resolves to the task object including the taskKey
 */
export async function create<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
>(
    scope: { userKey?: string } & GenericScope,
    name: string,
    payload: TaskPayloadCreateInput<B, H>,
    trigger: TaskTriggerCreateInView,
    optionals: {
        retryPolicy?: keyof typeof RETRY_POLICY;
        failSafeTermination?: string;
        ttlSeconds?: number;
    } & RoutingOptions = {},
): Promise<TaskReadOutView<B, H>> {
    const {
        retryPolicy,
        failSafeTermination,
        ttlSeconds,
        ...routingOptions
    } = optionals;
    const normalizedPayload: TaskPayloadCreateInView<B, H> =
        payload.objectType === 'groupStatus' ?
            payload :
            { ...payload, objectType: 'http' };
    return await new Router()
        .post(
            '/task',
            {
                body: {
                    payload: normalizedPayload,
                    trigger,
                    retryPolicy,
                    failSafeTermination,
                    ttlSeconds,
                    scope,
                    name,
                },
                ...routingOptions,
            },
        )
        .then(({ body }) => body);
}


/**
 * Deletes a task (changes status to cancelled); requires facilitator (or higher) privileges
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/{TASK_KEY}`
 *
 * @example
 * import { taskAdapter } from 'epicenter-libs';
 * const taskKey = '0000017dd3bf540e5ada5b1e058f08f20461';
 * await taskAdapter.destroy(taskKey);
 *
 * @param taskKey                               Unique key associated with a task
 * @param [optionals]                           Optional arguments; pass network call options overrides here.
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @returns promise that resolves to undefined when successful
 */
export async function destroy(
    taskKey: string,
    optionals: RoutingOptions = {},
): Promise<void> {
    return await new Router()
        .delete(`/task/${taskKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Gets a task by taskKey; requires facilitator (or higher) privileges
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/{TASK_KEY}`
 *
 * @example
 * import { taskAdapter } from 'epicenter-libs';
 * const taskKey = '0000017dd3bf540e5ada5b1e058f08f20461';
 * const task = await taskAdapter.get(taskKey);
 *
 * @param taskKey                               Unique key associated with a task
 * @param [optionals]                           Optional arguments; pass network call options overrides here.
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @returns promise that resolves to the task object
 */
export async function get<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
>(taskKey: string, optionals: RoutingOptions = {}): Promise<TaskReadOutView<B, H>> {
    return await new Router()
        .get(`/task/${taskKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Gets the history (100 most recent times it has triggered) of a task by taskKey; requires facilitator (or higher) privileges
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/history/{TASK_KEY}`
 *
 * @example
 * import { taskAdapter } from 'epicenter-libs';
 * const taskKey = '0000017dd3bf540e5ada5b1e058f08f20461';
 * const history = await taskAdapter.getHistory(taskKey);
 *
 * @param taskKey                               Unique key associated with a task
 * @param [optionals]                           Pagination and network options
 * @param [optionals.first]                     Zero-based index of the first history record; defaults to 0
 * @param [optionals.max]                       Maximum history records to return; defaults to 100 and cannot exceed 100
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @returns promise that resolves to a page of task history objects
 */
export async function getHistory(
    taskKey: string,
    optionals: TaskPageOptions & RoutingOptions = {},
): Promise<Page<TaskHistoryReadOutView>> {
    const { first, max, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({ first, max })
        .get(`/task/history/${taskKey}`, {
            paginated: true,
            ...routingOptions,
        })
        .then(({ body }) => body);
}


/**
 * Gets most recent 100 tasks related to the selected scope; requires facilitator (or higher) privileges
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/in/{SCOPE_BOUNDARY}/{SCOPE_KEY}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/in/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{USER_KEY}`
 *
 * Note: Will retrieve all tasks that were CREATED in the specified scope. If something was created with episode scope, it will not be retrievable through group scoping.
 *
 * @example
 * import { taskAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const scope = {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: '0000017dd3bf540e5ada5b1e058f08f20461',
 * };
 * const tasks = await taskAdapter.getTaskIn(scope);
 *
 * @param scope                                 Scope associated with the tasks
 * @param scope.scopeBoundary                   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]                       Key associated with the user; will retrieve tasks in the scope that were made by the specified user
 * @param [optionals]                           Pagination, sorting, and network options
 * @param [optionals.sort]                      Task fields to sort by
 * @param [optionals.first]                     Zero-based index of the first task; defaults to 0
 * @param [optionals.max]                       Maximum tasks to return; defaults to 100 and cannot exceed 100
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @returns promise that resolves to a page of task objects
 */
export async function getTaskIn<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
>(
    scope: { userKey?: string } & GenericScope,
    optionals: TaskScopePageOptions & RoutingOptions = {},
): Promise<Page<TaskReadOutView<B, H>>> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    const { sort = [], first, max, ...routingOptions } = optionals;
    return await new Router()
        .withSearchParams({
            sort: sort.join(';') || undefined,
            first,
            max,
        })
        .get(
            `/task/in/${scopeBoundary}/${scopeKey}${
                userKey ? `/${userKey}` : ''
            }`,
            {
                paginated: true,
                ...routingOptions,
            },
        )
        .then(({ body }) => body);
}


/**
 * Queries for tasks
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/search`
 *
 * No authentication is required; results use facilitator-level row visibility.
 * Filterable/sortable fields include
 * `task.taskKey`, `task.name`, `task.status`, `task.scopeBoundary`, `task.scopeKey`,
 * `task.userKey`, `task.groupName`, `task.episodeName`, `task.nextExecution`,
 * `task.failSafeExecution`, and `task.created`.
 *
 * @example
 * import { taskAdapter } from 'epicenter-libs';
 * const page = await taskAdapter.query({
 *     filter: [
 *         'task.scopeKey=0000017dd3bf540e5ada5b1e058f08f20461',    // tasks scoped to this group
 *         'task.status=INITIALIZED',                               // that have not yet fired
 *     ],
 *     sort: ['-task.created'],    // newest first
 *     max: 10,                    // page should only include the first 10 items
 * });
 *
 * @param searchOptions                         Search options for the query
 * @param [searchOptions.filter]                Filters for searching
 * @param [searchOptions.sort]                  Sorting criteria
 * @param [searchOptions.first]                 The starting index of the page returned
 * @param [searchOptions.max]                   The number of entries per page
 * @param [optionals]                           Optional arguments; pass network call options overrides here.
 * @returns promise that resolves to a page of tasks
 */
export async function query<
    B extends object = TaskPayloadBody,
    H extends object = TaskPayloadHeaders,
>(
    searchOptions: GenericSearchOptions,
    optionals: RoutingOptions = {},
): Promise<Page<TaskReadOutView<B, H>>> {
    const { filter, sort = [], first, max } = searchOptions;

    const searchParams = {
        filter: parseFilterInput(filter),
        sort: sort.join(';') || undefined,
        first, max,
    };

    return await new Router()
        .withSearchParams(searchParams)
        .get('/task/search', {
            paginated: true,
            ...optionals,
        })
        .then(({ body }) => body);
}

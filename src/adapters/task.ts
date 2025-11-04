import type { RoutingOptions } from '../utils/router';
import type { GenericScope, Address } from '../utils/constants';

import Router from '../utils/router';

export enum RETRY_POLICY {
    DO_NOTHING = 'DO_NOTHING', // If the task fails, do nothing (this is the default)
    RESCHEDULE = 'RESCHEDULE', // If the task fails retry at the next scheduled time point
    FIRE_ON_FAIL_SAFE = 'FIRE_ON_FAIL_SAFE', // Will re-execute the task after it fails; how long until this occurs is equal to ttlSeconds
}

// Generic type aliases for task adapter
export type TaskPayloadBody = Record<string, unknown>;
export type TaskPayloadHeaders = Record<string, string>;

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
export interface HttpTaskPayloadCreateInView<B extends TaskPayloadBody = TaskPayloadBody, H extends TaskPayloadHeaders = TaskPayloadHeaders> {
    objectType: 'http';
    method: string;
    url: string;
    body: B;
    headers?: H;
}

export interface GroupStatusTaskPayloadCreateInView {
    objectType: 'groupStatus';
    groupKey: string;
    status: StatusCreateInView;
}

export type TaskPayloadCreateInView<B extends TaskPayloadBody = TaskPayloadBody, H extends TaskPayloadHeaders = TaskPayloadHeaders> =
    | HttpTaskPayloadCreateInView<B, H>
    | GroupStatusTaskPayloadCreateInView;

// Payload type definitions for reading tasks
export interface HttpTaskPayloadReadOutView<B extends TaskPayloadBody = TaskPayloadBody, H extends TaskPayloadHeaders = TaskPayloadHeaders> {
    objectType: 'http';
    method?: string;
    url?: string;
    body?: B;
    headers?: H;
}

export interface GroupStatusTaskPayloadReadOutView {
    objectType: 'groupStatus';
    groupKey?: string;
    status?: StatusReadOutView;
}

export type TaskPayloadReadOutView<B extends TaskPayloadBody = TaskPayloadBody, H extends TaskPayloadHeaders = TaskPayloadHeaders> =
    | HttpTaskPayloadReadOutView<B, H>
    | GroupStatusTaskPayloadReadOutView;

// Task response structure
export interface TaskReadOutView<B extends TaskPayloadBody = TaskPayloadBody, H extends TaskPayloadHeaders = TaskPayloadHeaders> {
    taskKey?: string;
    name?: string;
    status?: string;
    cron?: string;
    mutationKey?: string;
    failures?: number;
    successes?: number;
    address?: Address;
    payload?: TaskPayloadReadOutView<B, H>;
    scope?: GenericScope;
    retryPolicy?: string;
    failSafeTermination?: string;
    ttlSeconds?: number;
}


/**
 * Creates a task; requires support level authentication
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
 *     url: 'https://forio.com/app/forio-dev/test-project/send-out-emails',
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
 * @param payload                               An HTTP task object that will be executed when the task is triggered
 * @param payload.method                        Type of method to use with the HTTP request (e.g., 'GET', 'POST', 'PATCH')
 * @param payload.url                           The URL the HTTP request will be sent to
 * @param [payload.body]                        The body of the HTTP request
 * @param [payload.headers]                     Headers to send along with the HTTP request
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
 * @param [optionals.failSafeTermination]       The ISO-8601 date-time when the task will be deleted regardless of any triggers; defaults to null
 * @param [optionals.ttlSeconds]                Max life expectancy of the task; used to determine if retrying the task is necessary
 * @returns promise that resolves to the task object including the taskKey
 */
export async function create<
    B extends TaskPayloadBody = TaskPayloadBody,
    H extends TaskPayloadHeaders = TaskPayloadHeaders,
>(
    scope: { userKey?: string } & GenericScope,
    name: string,
    payload: {
        method: string;
        url: string;
        body?: B;
        headers?: H;
    },
    trigger: TaskTriggerCreateInView,
    optionals: {
        retryPolicy?: keyof typeof RETRY_POLICY;
        failSafeTermination?: number;
        ttlSeconds?: number;
    } & RoutingOptions = {},
): Promise<TaskReadOutView<B, H>> {
    const {
        retryPolicy,
        failSafeTermination,
        ttlSeconds,
        ...routingOptions
    } = optionals;
    return await new Router()
        .post(
            '/task',
            {
                body: {
                    payload: { objectType: 'http' as const, ...payload },
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
 * Deletes a task (changes status to cancelled); requires support level authentication
 * Base URL: DELETE `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/{TASK_KEY}`
 *
 * @example
 * import { taskAdapter } from 'epicenter-libs';
 * await taskAdapter.destroy(taskKey);
 *
 * @param taskKey                               Unique key associated with a task
 * @param [optionals]                           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @returns promise that resolves to undefined when successful
 */
export async function destroy(taskKey: string, optionals: RoutingOptions = {}): Promise<void> {
    return await new Router()
        .delete(`/task/${taskKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Gets a task by taskKey; requires support level authentication
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/{TASK_KEY}`
 *
 * @example
 * import { taskAdapter } from 'epicenter-libs';
 * const task = await taskAdapter.get(taskKey);
 *
 * @param taskKey                               Unique key associated with a task
 * @param [optionals]                           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @returns promise that resolves to the task object
 */
export async function get<
    B extends TaskPayloadBody = TaskPayloadBody,
    H extends TaskPayloadHeaders = TaskPayloadHeaders,
>(taskKey: string, optionals: RoutingOptions = {}): Promise<TaskReadOutView<B, H>> {
    return await new Router()
        .get(`/task/${taskKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Gets the history (100 most recent times it has triggered) of a task by taskKey; requires support level authentication
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/history/{TASK_KEY}`
 *
 * @example
 * import { taskAdapter } from 'epicenter-libs';
 * const history = await taskAdapter.getHistory(taskKey);
 *
 * @param taskKey                               Unique key associated with a task
 * @param [optionals]                           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @returns promise that resolves to an array of task history objects
 */
export async function getHistory<
    B extends TaskPayloadBody = TaskPayloadBody,
    H extends TaskPayloadHeaders = TaskPayloadHeaders,
>(
    taskKey: string,
    optionals: RoutingOptions = {},
): Promise<TaskReadOutView<B, H>[]> {
    return await new Router()
        .get(`/task/history/${taskKey}`, optionals)
        .then(({ body }) => body);
}


/**
 * Gets most recent 100 tasks related to the selected scope; requires support level authentication
 * Base URL: GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/in/{SCOPE_BOUNDARY}/{SCOPE_KEY}` or GET `https://forio.com/api/v3/{ACCOUNT}/{PROJECT}/task/in/{SCOPE_BOUNDARY}/{SCOPE_KEY}/{USER_KEY}`
 *
 * Note: Will retrieve all tasks that were CREATED in the specified scope. If something was created with episode scope, it will not be retrievable through group scoping.
 *
 * @example
 * import { taskAdapter, SCOPE_BOUNDARY } from 'epicenter-libs';
 * const scope = {
 *     scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *     scopeKey: session.groupKey,
 * };
 * const tasks = await taskAdapter.getTaskIn(scope);
 *
 * @param scope                                 Scope associated with the tasks
 * @param scope.scopeBoundary                   Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param scope.scopeKey                        Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param [scope.userKey]                       Key associated with the user; will retrieve tasks in the scope that were made by the specified user
 * @param [optionals]                           Optional arguments; pass network call options overrides here. Special arguments specific to this method are listed below if they exist.
 * @param [optionals.accountShortName]          Name of account (by default will be the account associated with the session)
 * @param [optionals.projectShortName]          Name of project (by default will be the project associated with the session)
 * @returns promise that resolves to an array of task objects
 */
export async function getTaskIn<
    B extends TaskPayloadBody = TaskPayloadBody,
    H extends TaskPayloadHeaders = TaskPayloadHeaders,
>(
    scope: { userKey?: string } & GenericScope,
    optionals: RoutingOptions = {},
): Promise<TaskReadOutView<B, H>[]> {
    const { scopeBoundary, scopeKey, userKey } = scope;
    return await new Router()
        .get(
            `/task/in/${scopeBoundary}/${scopeKey}${
                userKey ? `/${userKey}` : ''
            }`,
            optionals,
        )
        .then(({ body }) => body);
}

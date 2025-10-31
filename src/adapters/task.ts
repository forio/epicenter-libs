import type { RoutingOptions } from 'utils/router';
import type { GenericScope, Address } from 'utils/constants';
import { Router } from 'utils/index';

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
 *
 * Base URL: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task`
 * Base URL with pseudonym: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/{scopeBoundary}/{scopeKey}/{userKey}/{name}`
 *
 * @example
 * const scope = {
 *   scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *   scopeKey: session.groupKey,
 * };
 * const name = 'task-1-send-emails'
 * const payload = {
 *   method: 'POST',
 *   url: 'https://forio.com/app/forio-dev/test-project/send-out-emails',
 * }
 * const trigger = {
 *   value: '0 7 15 * * ?', //triggers on day 15 7am of each month
 *   objectType: 'cron',
 * }
 *
 * epicenter.taskAdapter.create(scope, name, payload, trigger);
 *
 * @param {object}  scope                           Scope associated with your run
 * @param {string}  scope.scopeBoundary             Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}  scope.scopeKey                  Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {string}  scope.userKey                   Key associated with the user. Optional
 * @param {object}  payload                         An HTTP task object that will be executed when the task is triggered
 * @param {string}  [payload.method]                Type of method to use with the HTTP request (i.e. 'GET', 'POST', 'PATCH', etc.)
 * @param {string}  [payload.url]                   The url the HTTP request will be sent to; Will follow format <host>/app/<account>/<project>/url. host, account, and project are automatically entered
 * @param {object}  [payload.body]                  The body of the HTTP request. This is optional
 * @param {object}  [payload.headers]               Headers to send along with the HTTP request. Write as key-value pairs like you would with fetch. This is optional
 *
 * @param {object}  trigger                         One of three types of objects that determine when to run the task
 *
 * trigger option 1, Cron Object:                   Specifies a task that will execute once a set amount of time passes. This is the ONLY trigger that can be repeated
 * @param {string}  [trigger.value]                 Cron order for the task. Should include only time specifications (i.e. '0 7 * * * ?' => trigger at 7am UTC everyday) https://en.wikipedia.org/wiki/Cron
 * @param {string}  [trigger.objectType]            Specifies object being used. Should be a constant value of 'cron'
 *
 * trigger option 2, Offset Object:                 Specifies a task that will execute ONCE after the specified offset time has passed
 * @param {number}  [trigger.minutes]               Number of minutes until the task triggers
 * @param {number}  [trigger.hours]                 Number of hours until the task triggers
 * @param {number}  [trigger.days]                  Number of days until the task triggers
 * @param {string}  [trigger.objectType]            Specifies object being used. Should be a constant value of 'offset'
 *
 * trigger option 3, Date Object:                   Specifies a singular date for the task to be carried out; will execute ONCE
 * @param {string}  [trigger.value]                 A string in ISO-8601 date-time format (i.e. 2023-11-05T08:15:30-04:00 => November 5, 2023, 8:15:30 am, US EDT)
 * @param {string}  [trigger.objectType]            Specifies object being used. Should be a constant value of 'date'
 *
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @param {string}  [optionals.retryPolicy]         Specifies what to do should the task fail; see RETRY_POLICY
 * @param {string}  [optionals.failSafeTermination] The ISO-8601 date-time when the task will be deleted regardless of any tiggers; defaults to null
 * @param {number}  [optionals.ttlSeconds]          Max life expectancy of the task; used to determine if retrying the task is necessary
 * @returns {taskObject}                            Returns a promise that resolves to the task object including the taskKey
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
 * Sends a 204 on successful deletion
 * Base URL: DELETE `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/{taskKey}`
 *
 * @memberof taskAdapter
 * @example
 *
 * epicenter.taskAdapter.destroy(taskKey);
 *
 * @param {string}  taskKey                         Unique key associated with a task
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {undefined}
 */
export async function destroy(taskKey: string, optionals: RoutingOptions = {}): Promise<void> {
    return await new Router()
        .delete(`/task/${taskKey}`, optionals)
        .then(({ body }) => body);
}

/**
 * Gets a task by taskKey; requires support level authentication
 * Base URL: GET `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/{taskKey}`
 *
 * @memberof taskAdapter
 * @example
 *
 * epicenter.taskAdapter.get(taskKey);
 *
 * @param {string}  taskKey                         Unique key associated with a task
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {taskObject}                            Returns a promise that resolves to the task object including the taskKey
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
 * Gets a the history (100 most recent times it has triggered) of a task by taskKey; requires support level authentication
 * Base URL: GET `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/history/{taskKey}`
 *
 * @memberof taskAdapter
 * @example
 *
 * epicenter.taskAdapter.getHistory(taskKey);
 *
 * @param {string}  taskKey                         Unique key associated with a task
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @returns {taskObject}                            Returns a promise that resolves to the task object including the taskKey
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
 * TODO: fix this; this call seems to be paginated, but isn't somehow?
 *
 * Gets most recent 100 tasks related to the selected scope; requires support level authentication
 * Base URL: GET `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/in/{scopeBoundary}/{scopeKey}`
 * Base URL with userKey: GET `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/in/{scopeBoundary}/{scopeKey}/{userKey}`
 * Will retrieve all tasks that were CREATED in the specified scope. If something was created with episode scope, it will not be retrievable through group scoping
 * @memberof taskAdapter
 * @example
 *
 * const scope = {
 *   scopeBoundary: SCOPE_BOUNDARY.GROUP,
 *   scopeKey: session.groupKey,
 * };
 * epicenter.taskAdapter.getTaskIn(scope);
 *
 * @param {object}  scope                           Scope associated with your run
 * @param {string}  scope.scopeBoundary             Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}  scope.scopeKey                  Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @param {string}  [optionals.userKey]             Key associated with the user; Will retrieve tasks in the scope that were made by the specified user
 * @returns {taskObject}                            Returns a promise that resolves to the task object including the taskKey
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

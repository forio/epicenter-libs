import { Router } from 'utils/index';
import type { RoutingOptions } from '../utils/router';
import type { GenericScope } from '../utils/constants';
import { SCOPE_BOUNDARY } from 'utils/constants';

enum RETRY_POLICY {
    DO_NOTHING = 'DO_NOTHING', //If the task fails, do nothing (this is the default)
    RESCHEDULE = 'RESCHEDULE', //If the task fails retry at the next scheduled time point
    FIRE_ON_FAIL_SAFE = 'FIRE_ON_FAIL_SAFE', //Will re-execute the task after it fails; how long until this occurs is equal to ttlSeconds
}
/**
 * Creates a task; requires support level authentication
 *
 * Base URL: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task`
 * Base URL with pseudonym: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/{scopeBoundary}/{scopeKey}/{userKey}/{name}`
 *
 * @memberof taskAdapter
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
 * @returns {taskObject}                            Returns a task object including the taskKey
 */
export async function create(
    scope: { scopeBoundary: keyof typeof SCOPE_BOUNDARY, userKey?: string } & GenericScope,
    name: string,
    payload: {
        method: string;
        url: string;
        body?: Record<string, unknown>;
        headers?: Record<string, unknown>;
    },
    trigger: Record<string, unknown>,
    optionals: {
        retryPolicy?: keyof typeof RETRY_POLICY;
        failSafeTermination?: number;
        ttlSeconds?: number;
    } & RoutingOptions = {}
): Promise<Record<string, unknown>> {
    const {
        accountShortName,
        projectShortName,
        server,
        retryPolicy,
        failSafeTermination,
        ttlSeconds,
    } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(
            '/task/',
            {
                body: {
                    payload: { objectType: 'http', ...payload },
                    trigger,
                    retryPolicy,
                    failSafeTermination,
                    ttlSeconds,
                    scope,
                    name,
                },
            }
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
export async function destroy(taskKey: string, optionals: RoutingOptions = {}):Promise<void> {
    const { accountShortName, projectShortName, server } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/task/${taskKey}`)
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
 * @returns {taskObject}                            Returns a task object including the taskKey
 */
export async function get(taskKey: string, optionals: RoutingOptions = {}): Promise<Record<string, unknown>> {
    const { accountShortName, projectShortName, server } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/task/${taskKey}`)
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
 * @returns {taskObject}                            Returns a task object including the taskKey
 */
export async function getHistory(
    taskKey: string,
    optionals: RoutingOptions = {}
): Promise<Record<string, unknown>> {
    const { accountShortName, projectShortName, server } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/task/history/${taskKey}`)
        .then(({ body }) => body);
}

/**
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
 * @param {string}  [optionals.userKey]        Key associated with the user; Will retrieve tasks in the scope that were made by the specified user
 * @returns {taskObject}                            Returns a task object including the taskKey
 */
export async function getTaskIn(
    scope: { scopeBoundary: keyof typeof SCOPE_BOUNDARY } & GenericScope,
    optionals: { userKey?: string } & RoutingOptions = {}
): Promise<Record<string, unknown>> {
    const { accountShortName, projectShortName, server, userKey } = optionals;
    const { scopeBoundary, scopeKey } = scope;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(
            `/task/in/${scopeBoundary}/${scopeKey}${
                userKey ? `/${userKey}` : ''
            }`
        )
        .then(({ body }) => body);
}

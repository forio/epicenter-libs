import { Router } from 'utils/index';
import { SCOPE_BOUNDARY } from 'utils/constants';

enum RETRY_POLICY {
    DO_NOTHING = 'DO_NOTHING',
    RESCHEDULE = 'RESCHEDULE',
    FIRE_ON_FAIL_SAFE = 'FIRE_ON_FAIL_SAFE',
}
/**
 * Creates a task; requires support level authentication
 *
 * Base URL: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/{scopeBoundary}/{scopeKey}/{name}`
 * Base URL with pseudonym: POST `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/{scopeBoundary}/{scopeKey}/{pseudonymKey}/{name}`
 * 
 * @memberof taskAdapter
 * @example
 *
 * epicenter.taskAdapter.create(scope, pseudonymKey, name, payload, trigger);
 *
 * @param {object}  scope                           Scope associated with your run
 * @param {string}  scope.scopeBoundary             Scope boundary, defines the type of scope; See [scope boundary](#SCOPE_BOUNDARY) for all types
 * @param {string}  scope.scopeKey                  Scope key, a unique identifier tied to the scope. E.g., if your `scopeBoundary` is `GROUP`, your `scopeKey` will be your `groupKey`; for `EPISODE`, `episodeKey`, etc.
 * @param {object}  payload                         An HTTP task object that will be executed when the task is triggered
 * @param {string}  [payload.method]                Type of method to use with the HTTP request (i.e. 'GET', 'POST', 'PATCH', etc.)
 * @param {string}  [payload.url]                   The url the HTTP request will be sent to
 * @param {object}  [payload.body]                  The body of the HTTP request. This is optional
 * @param {object}  [payload.headers]               Headers to send along with the HTTP request. Write as key-value pairs like you would with fetch. This is optional
 * 
 * @param {object}  trigger                         One of three types of objects that determine when to run the task
 * 
 * trigger option 1, Cron Object:                   Specifies a task that will repeat as a set amount of time passes
 * @param {string}  [trigger.value]                 Cron order for the task. Should include only time specifications (not command file path) https://phoenixnap.com/kb/set-up-cron-job-linux
 * @param {string}  [trigger.objectType]            Specifies object being used. Should be a constant value of 'cron'
 * 
 * trigger option 2, Offset Object:                 Specifies a task that will repeat as a set amount of time passes (clarify whether this is correct)
 * @param {number}  [trigger.minutes]               Number of minutes between task triggers
 * @param {number}  [trigger.hours]                 Number of hours between task triggers
 * @param {number}  [trigger.days]                  Number of days between task triggers
 * @param {string}  [trigger.objectType]            Specifies object being used. Should be a constant value of 'offset'
 * 
 * trigger option 3, Date Object:                   Specifies a singular date for the task to be carried out
 * @param {string}  [trigger.value]                 A string in date-time format
 * @param {string}  [trigger.objectType]            Specifies object being used. Should be a constant value of 'date'
 * 
 * @param {object}  [optionals={}]                  Optional parameters
 * @param {string}  [optionals.accountShortName]    Name of account (by default will be the account associated with the session)
 * @param {string}  [optionals.projectShortName]    Name of project (by default will be the project associated with the session)
 * @param {string}  [optionals.pseudonymKey]        Key associated with the user
 * @param {string}  [optionals.retryPolicy]         Name of project (by default will be the project associated with the session)
 * @param {number}  [optionals.failSafeTermination] Name of project (by default will be the project associated with the session)
 * @param {number}  [optionals.ttlSeconds]          Name of project (by default will be the project associated with the session)
 * @returns {object}                                Returns a task object including the taskKey
 */
export async function create(
    scope: {scopeBoundary: keyof typeof SCOPE_BOUNDARY} & GenericScope, 
    name: string,
    payload: object,
    trigger: object,
    optionals: {retryPolicy?: keyof typeof RETRY_POLICY, failSafeTermination?: number, ttlSeconds?: number, pseudonymKey?: string} & GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server,
        retryPolicy, failSafeTermination, ttlSeconds, pseudonymKey } = optionals;
    const { scopeBoundary, scopeKey } = scope;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/task/${scopeBoundary}/${scopeKey}${pseudonymKey ? `/${pseudonymKey}` : ''}/${name}`, {
            body: {
                payload: {objectType: 'http', ...payload},
                trigger,
                retryPolicy,
                failSafeTermination,
                ttlSeconds,
            },
        })
        .then(({ body }) => body);
}

/**
 * Deletes a task; requires support level authentication
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
export async function destroy(
    taskKey: string, 
    optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/task/${taskKey}`)
        .then(({ body }) => body);
}

/**
 * Gets a task by taskId; requires support level authentication
 * Base URL: GET `https://forio.com/api/v3/{accountShortName}/{projectShortName}/task/{taskKey}`
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
export async function get(
    taskKey: string, 
    optionals: GenericAdapterOptions = {}) {
    const { accountShortName, projectShortName, server } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/task/${taskKey}`)
        .then(({ body }) => body);
}
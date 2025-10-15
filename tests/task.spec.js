import {
    it,
    expect,
    describe,
    afterAll,
    beforeAll,
    beforeEach,
} from 'vitest';
import {
    ACCOUNT,
    PROJECT,
    SESSION,
    GENERIC_OPTIONS,
    createFetchMock,
    getAuthHeader,
    testedMethods,
    config,
    authAdapter,
    taskAdapter,
    SCOPE_BOUNDARY,
} from './common';

describe('taskAdapter', () => {
    let capturedRequests = [];
    let mockSetup;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    beforeAll(() => {
        mockSetup = createFetchMock();
        capturedRequests = mockSetup.capturedRequests;
    });

    beforeEach(() => {
        capturedRequests.length = 0;
        authAdapter.setLocalSession(SESSION);
    });

    afterAll(() => {
        mockSetup.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('taskAdapter.create', () => {
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: 'GROUP_KEY',
        };
        const name = 'my-task';
        const payload = {
            method: 'POST',
            url: '/send-out-emails',
        };
        const trigger = {
            value: '0 7 15 * * ?',
            objectType: 'cron',
        };

        it('Should do a POST', async () => {
            await taskAdapter.create(scope, name, payload, trigger);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await taskAdapter.create(scope, name, payload, trigger);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the task URL', async () => {
            await taskAdapter.create(scope, name, payload, trigger);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/task`);
        });

        it('Should support generic URL options', async () => {
            await taskAdapter.create(scope, name, payload, trigger, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/task`);
        });

        it('Should pass scope, name, payload, and trigger to the request body', async () => {
            await taskAdapter.create(scope, name, payload, trigger);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('scope');
            expect(body.scope.scopeBoundary).toBe(scope.scopeBoundary);
            expect(body.scope.scopeKey).toBe(scope.scopeKey);
            expect(body).toHaveProperty('name', name);
            expect(body).toHaveProperty('payload');
            expect(body.payload.objectType).toBe('http');
            expect(body.payload.method).toBe(payload.method);
            expect(body.payload.url).toBe(payload.url);
            expect(body).toHaveProperty('trigger');
            expect(body.trigger.value).toBe(trigger.value);
            expect(body.trigger.objectType).toBe(trigger.objectType);
        });

        it('Should pass optional parameters to the request body', async () => {
            const optionals = {
                retryPolicy: 'RESCHEDULE',
                failSafeTermination: 1234567890,
                ttlSeconds: 3600,
            };
            await taskAdapter.create(scope, name, payload, trigger, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('retryPolicy', optionals.retryPolicy);
            expect(body).toHaveProperty('failSafeTermination', optionals.failSafeTermination);
            expect(body).toHaveProperty('ttlSeconds', optionals.ttlSeconds);
        });

        it('Should include userKey in scope if provided', async () => {
            const scopeWithUser = {
                ...scope,
                userKey: 'USER_KEY',
            };
            await taskAdapter.create(scopeWithUser, name, payload, trigger);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.scope).toHaveProperty('userKey');
            expect(body.scope.userKey).toBe('USER_KEY');
        });

        testedMethods.push('create');
    });

    describe('taskAdapter.destroy', () => {
        const taskKey = 'TASK_KEY';

        it('Should do a DELETE', async () => {
            await taskAdapter.destroy(taskKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await taskAdapter.destroy(taskKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the task URL with taskKey', async () => {
            await taskAdapter.destroy(taskKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/task/${taskKey}`);
        });

        it('Should support generic URL options', async () => {
            await taskAdapter.destroy(taskKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/task/${taskKey}`);
        });

        testedMethods.push('destroy');
    });

    describe('taskAdapter.get', () => {
        const taskKey = 'TASK_KEY';

        it('Should do a GET', async () => {
            await taskAdapter.get(taskKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await taskAdapter.get(taskKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the task URL with taskKey', async () => {
            await taskAdapter.get(taskKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/task/${taskKey}`);
        });

        it('Should support generic URL options', async () => {
            await taskAdapter.get(taskKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/task/${taskKey}`);
        });

        testedMethods.push('get');
    });

    describe('taskAdapter.getHistory', () => {
        const taskKey = 'TASK_KEY';

        it('Should do a GET', async () => {
            await taskAdapter.getHistory(taskKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await taskAdapter.getHistory(taskKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the task/history URL with taskKey', async () => {
            await taskAdapter.getHistory(taskKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/task/history/${taskKey}`);
        });

        it('Should support generic URL options', async () => {
            await taskAdapter.getHistory(taskKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/task/history/${taskKey}`);
        });

        testedMethods.push('getHistory');
    });

    describe('taskAdapter.getTaskIn', () => {
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: 'GROUP_KEY',
        };

        it('Should do a GET', async () => {
            await taskAdapter.getTaskIn(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await taskAdapter.getTaskIn(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the task/in URL with scope', async () => {
            await taskAdapter.getTaskIn(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/task/in/${scope.scopeBoundary}/${scope.scopeKey}`);
        });

        it('Should include userKey in URL if provided', async () => {
            const scopeWithUser = {
                ...scope,
                userKey: 'USER_KEY',
            };
            await taskAdapter.getTaskIn(scopeWithUser);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/task/in/${scope.scopeBoundary}/${scope.scopeKey}/USER_KEY`);
        });

        it('Should support generic URL options', async () => {
            await taskAdapter.getTaskIn(scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/task/in/${scope.scopeBoundary}/${scope.scopeKey}`);
        });

        testedMethods.push('getTaskIn');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(taskAdapter).filter(key => typeof taskAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

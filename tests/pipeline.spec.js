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
    createFetchMock,
    GENERIC_OPTIONS,
    testedMethods,
    config,
    authAdapter,
    pipelineAdapter,
    getAuthHeader,
    getFunctionKeys,
} from './common';

describe('pipelineAdapter', () => {
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

    describe('pipelineAdapter.buildImages', () => {
        it('Should do a GET', async () => {
            await pipelineAdapter.buildImages();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await pipelineAdapter.buildImages();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /pipeline/npm/images URL', async () => {
            await pipelineAdapter.buildImages();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/pipeline/npm/images`);
        });

        it('Should support generic URL options', async () => {
            await pipelineAdapter.buildImages(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/pipeline/npm/images`);
        });

        testedMethods.add('buildImages');
    });

    describe('pipelineAdapter.execute', () => {
        const CONFIG_NAME = 'deploy';
        const ATTRIBUTES = { git: 'my-git-token' };

        it('Should do a POST', async () => {
            await pipelineAdapter.execute(CONFIG_NAME, ATTRIBUTES);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await pipelineAdapter.execute(CONFIG_NAME, ATTRIBUTES);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /pipeline/{configName} URL', async () => {
            await pipelineAdapter.execute(CONFIG_NAME, ATTRIBUTES);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/pipeline/${CONFIG_NAME}`);
        });

        it('Should URL-encode the config name', async () => {
            await pipelineAdapter.execute('my config', ATTRIBUTES);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/pipeline/my%20config`);
        });

        it('Should wrap the inputs in an attributes envelope in the request body', async () => {
            await pipelineAdapter.execute(CONFIG_NAME, ATTRIBUTES);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual({ attributes: ATTRIBUTES });
        });

        it('Should default attributes to an empty object', async () => {
            await pipelineAdapter.execute(CONFIG_NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual({ attributes: {} });
        });

        it('Should support generic URL options', async () => {
            await pipelineAdapter.execute(CONFIG_NAME, ATTRIBUTES, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/pipeline/${CONFIG_NAME}`);
        });

        testedMethods.add('execute');
    });

    describe('pipelineAdapter.getExecution', () => {
        const EXECUTION_KEY = 'myexecutionkey';

        it('Should do a GET', async () => {
            await pipelineAdapter.getExecution(EXECUTION_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await pipelineAdapter.getExecution(EXECUTION_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /pipeline/{executionKey} URL', async () => {
            await pipelineAdapter.getExecution(EXECUTION_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/pipeline/${EXECUTION_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await pipelineAdapter.getExecution(EXECUTION_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/pipeline/${EXECUTION_KEY}`);
        });

        testedMethods.add('getExecution');
    });

    describe('pipelineAdapter.listAudits', () => {
        const CONFIG_NAME = 'deploy';

        it('Should do a GET', async () => {
            await pipelineAdapter.listAudits(CONFIG_NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await pipelineAdapter.listAudits(CONFIG_NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /pipeline/with/{configName} URL', async () => {
            await pipelineAdapter.listAudits(CONFIG_NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/pipeline/with/${CONFIG_NAME}`);
        });

        it('Should pass first and max as query parameters', async () => {
            await pipelineAdapter.listAudits(CONFIG_NAME, { first: 20, max: 10 });
            const req = capturedRequests[capturedRequests.length - 1];
            const searchParams = new URLSearchParams(req.url.split('?')[1]);
            expect(searchParams.get('first')).toBe('20');
            expect(searchParams.get('max')).toBe('10');
        });

        it('Should default first to 0', async () => {
            await pipelineAdapter.listAudits(CONFIG_NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            const searchParams = new URLSearchParams(req.url.split('?')[1]);
            expect(searchParams.get('first')).toBe('0');
        });

        it('Should support generic URL options', async () => {
            await pipelineAdapter.listAudits(CONFIG_NAME, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            const url = req.url.split('?')[0];
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/pipeline/with/${CONFIG_NAME}`);
        });

        testedMethods.add('listAudits');
    });

    describe('pipelineAdapter.deleteAudit', () => {
        const EXECUTION_KEY = 'myexecutionkey';

        it('Should do a DELETE', async () => {
            await pipelineAdapter.deleteAudit(EXECUTION_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await pipelineAdapter.deleteAudit(EXECUTION_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /pipeline/{executionKey} URL', async () => {
            await pipelineAdapter.deleteAudit(EXECUTION_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/pipeline/${EXECUTION_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await pipelineAdapter.deleteAudit(EXECUTION_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/pipeline/${EXECUTION_KEY}`);
        });

        testedMethods.add('deleteAudit');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(pipelineAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

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
    testedMethods,
    getAuthHeader,
    authAdapter,
    contextAdapter,
    config,
    getFunctionKeys,
} from './common';

describe('contextAdapter', () => {
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

    describe('contextAdapter.get', () => {
        const modelFile = 'model.vmf';

        it('Should do a GET', async () => {
            await contextAdapter.get(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await contextAdapter.get(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the context URL with modelFile', async () => {
            await contextAdapter.get(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/context/${modelFile}`);
        });

        it('Should support generic URL options', async () => {
            await contextAdapter.get(modelFile, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/context/${modelFile}`);
        });

        it('Should pass morphology as a query parameter', async () => {
            await contextAdapter.get(modelFile, { morphology: 'SINGULAR' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('morphology=SINGULAR');
        });

        testedMethods.add('get');
    });

    describe('contextAdapter.upgrade', () => {
        const modelFile = 'model.vmf';

        it('Should do a POST', async () => {
            await contextAdapter.upgrade(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await contextAdapter.upgrade(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the context/upgrade URL with modelFile', async () => {
            await contextAdapter.upgrade(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/context/upgrade/${modelFile}`);
        });

        it('Should support generic URL options', async () => {
            await contextAdapter.upgrade(modelFile, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/context/upgrade/${modelFile}`);
        });

        it('Should pass morphology as a query parameter', async () => {
            await contextAdapter.upgrade(modelFile, { morphology: 'MANY' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('morphology=MANY');
        });

        testedMethods.add('upgrade');
    });

    describe('contextAdapter.verify', () => {
        const modelFile = 'model.vmf';

        it('Should do a POST', async () => {
            await contextAdapter.verify(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await contextAdapter.verify(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the context/verify URL', async () => {
            await contextAdapter.verify(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/context/verify`);
        });

        it('Should support generic URL options', async () => {
            await contextAdapter.verify(modelFile, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/context/verify`);
        });

        it('Should pass modelFile in the request body', async () => {
            await contextAdapter.verify(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('modelFile', modelFile);
        });

        it('Should pass optional parameters in the request body', async () => {
            await contextAdapter.verify(modelFile, {
                morphology: 'SINGULAR',
                modelLanguage: 'VENSIM',
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('morphology', 'SINGULAR');
            expect(body).toHaveProperty('modelLanguage', 'VENSIM');
        });

        it('Should pass executionContext in the request body', async () => {
            const executionContext = {
                version: 1,
                tool: { objectType: 'vensim', sensitivityMode: true },
            };
            await contextAdapter.verify(modelFile, { executionContext });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('executionContext');
            expect(body.executionContext).toEqual(executionContext);
        });

        testedMethods.add('verify');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(contextAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

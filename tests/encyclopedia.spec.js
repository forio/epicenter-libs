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
    encyclopediaAdapter,
    config,
    getFunctionKeys,
} from './common';

describe('encyclopediaAdapter', () => {
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

    describe('encyclopediaAdapter.list', () => {
        const version = 1;

        it('Should do a GET', async () => {
            await encyclopediaAdapter.list(version);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await encyclopediaAdapter.list(version);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the encyclopedia URL with version', async () => {
            await encyclopediaAdapter.list(version);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/encyclopedia/v${version}`);
        });

        it('Should support generic URL options', async () => {
            await encyclopediaAdapter.list(version, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/encyclopedia/v${version}`);
        });

        testedMethods.add('list');
    });

    describe('encyclopediaAdapter.get', () => {
        const version = 1;
        const api = 'run';

        it('Should do a GET', async () => {
            await encyclopediaAdapter.get(version, api);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await encyclopediaAdapter.get(version, api);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the encyclopedia URL with version and api', async () => {
            await encyclopediaAdapter.get(version, api);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/encyclopedia/v${version}/${api}`);
        });

        it('Should support generic URL options', async () => {
            await encyclopediaAdapter.get(version, api, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/encyclopedia/v${version}/${api}`);
        });

        testedMethods.add('get');
    });

    describe('encyclopediaAdapter.translate', () => {
        const version = 1;
        const api = 'run';
        const translator = 'OPENAPI';

        it('Should do a GET', async () => {
            await encyclopediaAdapter.translate(version, api, translator);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await encyclopediaAdapter.translate(version, api, translator);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the encyclopedia URL with translator, version, and api', async () => {
            await encyclopediaAdapter.translate(version, api, translator);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/encyclopedia/as/${translator}/v${version}/${api}`);
        });

        it('Should support generic URL options', async () => {
            await encyclopediaAdapter.translate(version, api, translator, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/encyclopedia/as/${translator}/v${version}/${api}`);
        });

        testedMethods.add('translate');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(encyclopediaAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

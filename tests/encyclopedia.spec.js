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
    encyclopediaAdapter,
    getAuthHeader,
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

    describe('encyclopediaAdapter.listServices', () => {
        const VERSION = 1;

        it('Should do a GET', async () => {
            await encyclopediaAdapter.listServices(VERSION);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await encyclopediaAdapter.listServices(VERSION);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /encyclopedia/v{version} URL', async () => {
            await encyclopediaAdapter.listServices(VERSION);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/encyclopedia/v${VERSION}`);
        });

        it('Should support generic URL options', async () => {
            await encyclopediaAdapter.listServices(VERSION, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/encyclopedia/v${VERSION}`);
        });

        testedMethods.add('listServices');
    });

    describe('encyclopediaAdapter.getResource', () => {
        const VERSION = 1;
        const API = 'run';

        it('Should do a GET', async () => {
            await encyclopediaAdapter.getResource(VERSION, API);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await encyclopediaAdapter.getResource(VERSION, API);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /encyclopedia/v{version}/{api} URL', async () => {
            await encyclopediaAdapter.getResource(VERSION, API);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/encyclopedia/v${VERSION}/${API}`);
        });

        it('Should support generic URL options', async () => {
            await encyclopediaAdapter.getResource(VERSION, API, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/encyclopedia/v${VERSION}/${API}`);
        });

        testedMethods.add('getResource');
    });

    describe('encyclopediaAdapter.translate', () => {
        const TRANSLATOR = 'OPENAPI';
        const VERSION = 1;
        const API = 'run';

        it('Should do a GET', async () => {
            await encyclopediaAdapter.translate(TRANSLATOR, VERSION, API);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await encyclopediaAdapter.translate(TRANSLATOR, VERSION, API);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /encyclopedia/as/{translator}/v{version}/{api} URL', async () => {
            await encyclopediaAdapter.translate(TRANSLATOR, VERSION, API);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/encyclopedia/as/${TRANSLATOR}/v${VERSION}/${API}`);
        });

        it('Should support generic URL options', async () => {
            await encyclopediaAdapter.translate(TRANSLATOR, VERSION, API, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/encyclopedia/as/${TRANSLATOR}/v${VERSION}/${API}`);
        });

        it('Should support all translator formats', async () => {
            const translators = ['ASCIIDOC', 'ASCIIDOC_TO_HTML', 'OPENAPI'];
            for (const translator of translators) {
                await encyclopediaAdapter.translate(translator, VERSION, API);
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toContain(`/encyclopedia/as/${translator}/`);
            }
        });

        testedMethods.add('translate');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(encyclopediaAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

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
    forgeAdapter,
    config,
    getFunctionKeys,
} from './common';

describe('forgeAdapter', () => {
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

    describe('forgeAdapter.ready', () => {
        const modelLanguage = 'PYTHON_3';

        it('Should do a POST', async () => {
            await forgeAdapter.ready(modelLanguage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await forgeAdapter.ready(modelLanguage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the forge/ready URL', async () => {
            await forgeAdapter.ready(modelLanguage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/forge/ready`);
        });

        it('Should send modelLanguage in the body', async () => {
            await forgeAdapter.ready(modelLanguage);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.modelLanguage).toBe(modelLanguage);
        });

        it('Should support generic URL options', async () => {
            await forgeAdapter.ready(modelLanguage, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/forge/ready`);
        });

        testedMethods.add('ready');
    });

    describe('forgeAdapter.rebuild', () => {
        it('Should do a POST', async () => {
            await forgeAdapter.rebuild();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await forgeAdapter.rebuild();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the forge/rebuild URL', async () => {
            await forgeAdapter.rebuild();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/forge/rebuild`);
        });

        it('Should pass optional parameters to the request body', async () => {
            await forgeAdapter.rebuild({ noCache: true, cleanUp: true });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.noCache).toBe(true);
            expect(body.cleanUp).toBe(true);
        });

        it('Should support generic URL options', async () => {
            await forgeAdapter.rebuild(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/forge/rebuild`);
        });

        testedMethods.add('rebuild');
    });

    describe('forgeAdapter.setDefault', () => {
        const modelLanguage = 'JAVASCRIPT';

        it('Should do a POST', async () => {
            await forgeAdapter.setDefault(modelLanguage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await forgeAdapter.setDefault(modelLanguage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the forge/default URL', async () => {
            await forgeAdapter.setDefault(modelLanguage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/forge/default`);
        });

        it('Should send modelLanguage in the body', async () => {
            await forgeAdapter.setDefault(modelLanguage);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.modelLanguage).toBe(modelLanguage);
        });

        it('Should pass optional parameters to the request body', async () => {
            await forgeAdapter.setDefault(modelLanguage, {
                noCache: true,
                modelMorphology: 'SINGULAR',
                workerImage: 'custom-image',
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.noCache).toBe(true);
            expect(body.modelMorphology).toBe('SINGULAR');
            expect(body.workerImage).toBe('custom-image');
        });

        it('Should support generic URL options', async () => {
            await forgeAdapter.setDefault(modelLanguage, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/forge/default`);
        });

        testedMethods.add('setDefault');
    });

    describe('forgeAdapter.setDefaultAll', () => {
        it('Should do a POST', async () => {
            await forgeAdapter.setDefaultAll();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await forgeAdapter.setDefaultAll();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the forge/default/all URL', async () => {
            await forgeAdapter.setDefaultAll();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/forge/default/all`);
        });

        it('Should pass optional parameters to the request body', async () => {
            await forgeAdapter.setDefaultAll({ noCache: true, cleanUp: false });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.noCache).toBe(true);
            expect(body.cleanUp).toBe(false);
        });

        it('Should support generic URL options', async () => {
            await forgeAdapter.setDefaultAll(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/forge/default/all`);
        });

        testedMethods.add('setDefaultAll');
    });

    describe('forgeAdapter.setDefaults', () => {
        const modelLanguages = ['PYTHON_3', 'JAVASCRIPT'];

        it('Should do a POST', async () => {
            await forgeAdapter.setDefaults(modelLanguages);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await forgeAdapter.setDefaults(modelLanguages);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the forge/defaults URL', async () => {
            await forgeAdapter.setDefaults(modelLanguages);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/forge/defaults`);
        });

        it('Should send modelLanguages in the body', async () => {
            await forgeAdapter.setDefaults(modelLanguages);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.modelLanguages).toEqual(modelLanguages);
        });

        it('Should pass optional parameters to the request body', async () => {
            await forgeAdapter.setDefaults(modelLanguages, { modelMorphology: 'MANY' });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.modelMorphology).toBe('MANY');
        });

        it('Should support generic URL options', async () => {
            await forgeAdapter.setDefaults(modelLanguages, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/forge/defaults`);
        });

        testedMethods.add('setDefaults');
    });

    describe('forgeAdapter.build', () => {
        const modelFile = 'model.py';

        it('Should do a POST', async () => {
            await forgeAdapter.build(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await forgeAdapter.build(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the forge/build URL', async () => {
            await forgeAdapter.build(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/forge/build`);
        });

        it('Should send modelFile in the body', async () => {
            await forgeAdapter.build(modelFile);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.modelFile).toBe(modelFile);
        });

        it('Should pass optional parameters to the request body', async () => {
            await forgeAdapter.build(modelFile, {
                noCache: true,
                modelLanguage: 'PYTHON_3',
                modelMorphology: 'SINGULAR',
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.noCache).toBe(true);
            expect(body.modelLanguage).toBe('PYTHON_3');
            expect(body.modelMorphology).toBe('SINGULAR');
        });

        it('Should support generic URL options', async () => {
            await forgeAdapter.build(modelFile, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/forge/build`);
        });

        testedMethods.add('build');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(forgeAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

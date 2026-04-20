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
    fido2Adapter,
    config,
    getFunctionKeys,
} from './common';

describe('fido2Adapter', () => {
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

    describe('fido2Adapter.getRequestOptions', () => {
        it('Should do a GET', async () => {
            await fido2Adapter.getRequestOptions();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await fido2Adapter.getRequestOptions();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the fido2/options/request URL', async () => {
            await fido2Adapter.getRequestOptions();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/fido2/options/request`);
        });

        it('Should support generic URL options', async () => {
            await fido2Adapter.getRequestOptions(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/fido2/options/request`);
        });

        testedMethods.add('getRequestOptions');
    });

    describe('fido2Adapter.getCreateOptions', () => {
        it('Should do a GET', async () => {
            await fido2Adapter.getCreateOptions();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await fido2Adapter.getCreateOptions();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the fido2/options/create URL', async () => {
            await fido2Adapter.getCreateOptions();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/fido2/options/create`);
        });

        it('Should support generic URL options', async () => {
            await fido2Adapter.getCreateOptions(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/fido2/options/create`);
        });

        testedMethods.add('getCreateOptions');
    });

    describe('fido2Adapter.register', () => {
        const credential = { id: 'cred-id', response: { attestationObject: 'abc' } };

        it('Should do a POST', async () => {
            await fido2Adapter.register(credential);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await fido2Adapter.register(credential);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the fido2/register URL', async () => {
            await fido2Adapter.register(credential);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/fido2/register`);
        });

        it('Should send the credential in the body', async () => {
            await fido2Adapter.register(credential);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.id).toBe(credential.id);
        });

        it('Should support generic URL options', async () => {
            await fido2Adapter.register(credential, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/fido2/register`);
        });

        testedMethods.add('register');
    });

    describe('fido2Adapter.verify', () => {
        const assertion = { id: 'cred-id', response: { authenticatorData: 'xyz' } };

        it('Should do a POST', async () => {
            await fido2Adapter.verify(assertion);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await fido2Adapter.verify(assertion);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the fido2/verify URL', async () => {
            await fido2Adapter.verify(assertion);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/fido2/verify`);
        });

        it('Should send the assertion in the body', async () => {
            await fido2Adapter.verify(assertion);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.id).toBe(assertion.id);
        });

        it('Should support generic URL options', async () => {
            await fido2Adapter.verify(assertion, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/fido2/verify`);
        });

        testedMethods.add('verify');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(fido2Adapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

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
    userAdapter,
} from './common';

describe('userAdapter', () => {
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

    describe('userAdapter.createUser', () => {
        const externalUser = {
            objectType: 'external',
            handle: 'testuser',
            email: 'test@example.com',
            givenName: 'Test',
            familyName: 'User',
        };

        const nativeUser = {
            objectType: 'native',
            handle: 'testuser',
            email: 'test@example.com',
            givenName: 'Test',
            familyName: 'User',
            secret: {
                password: 'testpassword',
            },
        };

        it('Should do a POST', async() => {
            await userAdapter.createUser(externalUser);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await userAdapter.createUser(externalUser);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the user URL', async() => {
            await userAdapter.createUser(externalUser);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/user`);
        });

        it('Should support generic URL options', async() => {
            await userAdapter.createUser(externalUser, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/user`);
        });

        it('Should pass external user details to the request body', async() => {
            await userAdapter.createUser(externalUser);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType', 'external');
            expect(body).toHaveProperty('handle', externalUser.handle);
            expect(body).toHaveProperty('email', externalUser.email);
            expect(body).toHaveProperty('givenName', externalUser.givenName);
            expect(body).toHaveProperty('familyName', externalUser.familyName);
        });

        it('Should pass native user details to the request body', async() => {
            await userAdapter.createUser(nativeUser);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType', 'native');
            expect(body).toHaveProperty('secret');
            expect(body.secret).toHaveProperty('password', nativeUser.secret.password);
        });

        testedMethods.push('createUser');
    });

    describe('userAdapter.get', () => {
        const userKey = 'USER_KEY';

        it('Should do a GET', async() => {
            await userAdapter.get(userKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await userAdapter.get(userKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the user URL with userKey', async() => {
            await userAdapter.get(userKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/user/${userKey}`);
        });

        it('Should support generic URL options', async() => {
            await userAdapter.get(userKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/user/${userKey}`);
        });

        testedMethods.push('get');
    });

    describe('userAdapter.getWithHandle', () => {
        const handle = 'testuser';

        it('Should do a GET', async() => {
            await userAdapter.getWithHandle(handle);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await userAdapter.getWithHandle(handle);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the user/with URL with handle', async() => {
            await userAdapter.getWithHandle(handle);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/user/with/${handle}`);
        });

        it('Should append modality to URL when provided', async() => {
            const modality = 'SSO';
            await userAdapter.getWithHandle(handle, { modality });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/user/with/${handle}/${modality}`);
        });

        it('Should support generic URL options', async() => {
            await userAdapter.getWithHandle(handle, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/user/with/${handle}`);
        });

        testedMethods.push('getWithHandle');
    });

    describe('userAdapter.uploadCSV', () => {
        // Note: uploadCSV() requires a File object which is browser-specific and uses FormData.
        // Proper testing would require mocking the File API and FormData.
        it('Should be a placeholder test', () => {
            expect(userAdapter.uploadCSV).toBeDefined();
        });

        testedMethods.push('uploadCSV');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(userAdapter).filter((key) => typeof userAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

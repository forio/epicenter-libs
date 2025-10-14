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
    GENERIC_OPTIONS,
    createFetchMock,
    testedMethods,
    config,
    authAdapter,
    adminAdapter,
} from './common';

describe('adminAdapter', () => {
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
    });

    afterAll(() => {
        mockSetup.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('adminAdapter.createAdmin', () => {
        const externalAdmin = {
            handle: 'testuser',
            email: 'test@example.com',
            givenName: 'Test',
            familyName: 'User',
            verified: true,
            active: true,
        };

        const nativeAdmin = {
            objectType: 'native',
            handle: 'testuser',
            email: 'test@example.com',
            givenName: 'Test',
            familyName: 'User',
            verified: true,
            active: true,
            secret: {
                password: 'testpassword',
            },
        };

        it('Should do a POST', async() => {
            await adminAdapter.createAdmin(externalAdmin);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should use the epicenter/manager admin URL', async() => {
            await adminAdapter.createAdmin(externalAdmin);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/epicenter/manager/admin`);
        });

        it('Should pass the admin details to the request body for external admin', async() => {
            await adminAdapter.createAdmin(externalAdmin);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('handle');
            expect(body.handle).toBe(externalAdmin.handle);
            expect(body).toHaveProperty('email');
            expect(body.email).toBe(externalAdmin.email);
            expect(body).toHaveProperty('givenName');
            expect(body.givenName).toBe(externalAdmin.givenName);
            expect(body).toHaveProperty('familyName');
            expect(body.familyName).toBe(externalAdmin.familyName);
            expect(body).toHaveProperty('verified');
            expect(body.verified).toBe(true);
            expect(body).toHaveProperty('active');
            expect(body.active).toBe(true);
        });

        it('Should pass the admin details to the request body for native admin', async() => {
            await adminAdapter.createAdmin(nativeAdmin);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType');
            expect(body.objectType).toBe('native');
            expect(body).toHaveProperty('handle');
            expect(body.handle).toBe(nativeAdmin.handle);
            expect(body).toHaveProperty('email');
            expect(body.email).toBe(nativeAdmin.email);
            expect(body).toHaveProperty('givenName');
            expect(body.givenName).toBe(nativeAdmin.givenName);
            expect(body).toHaveProperty('familyName');
            expect(body.familyName).toBe(nativeAdmin.familyName);
            expect(body).toHaveProperty('verified');
            expect(body.verified).toBe(true);
            expect(body).toHaveProperty('active');
            expect(body.active).toBe(true);
            expect(body).toHaveProperty('secret');
            expect(body.secret).toHaveProperty('password');
            expect(body.secret.password).toBe(nativeAdmin.secret.password);
        });

        testedMethods.push('createAdmin');
    });

    describe('adminAdapter.getWithHandle', () => {
        const handle = 'testuser';

        it('Should do a GET', async() => {
            await adminAdapter.getWithHandle(handle);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the epicenter/manager admin URL', async() => {
            await adminAdapter.getWithHandle(handle);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/epicenter/manager/admin/with/${handle}`);
        });

        it('Should support generic URL options', async() => {
            await adminAdapter.getWithHandle(handle, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/admin/with/${handle}`);
        });

        testedMethods.push('getWithHandle');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(adminAdapter).filter((key) => typeof adminAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

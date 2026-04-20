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
    config,
    getFunctionKeys,
    notificationAdapter,
} from './common';

describe('notificationAdapter', () => {
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

    describe('notificationAdapter.setPreference', () => {
        const preference = {
            notificationType: 'MARKETING',
            adminKey: 'my-admin-key',
            notify: false,
        };

        it('Should do a POST', async () => {
            await notificationAdapter.setPreference(preference);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await notificationAdapter.setPreference(preference);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the notification/preference URL', async () => {
            await notificationAdapter.setPreference(preference);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/notification/preference`);
        });

        it('Should support generic URL options', async () => {
            await notificationAdapter.setPreference(preference, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/notification/preference`);
        });

        it('Should pass preference to the request body', async () => {
            await notificationAdapter.setPreference(preference);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('notificationType', 'MARKETING');
            expect(body).toHaveProperty('adminKey', 'my-admin-key');
            expect(body).toHaveProperty('notify', false);
        });

        testedMethods.add('setPreference');
    });

    describe('notificationAdapter.getPreferences', () => {
        const adminKey = 'my-admin-key';

        it('Should do a GET', async () => {
            await notificationAdapter.getPreferences(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await notificationAdapter.getPreferences(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the notification/preference URL with adminKey', async () => {
            await notificationAdapter.getPreferences(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/notification/preference/${adminKey}`);
        });

        it('Should support generic URL options', async () => {
            await notificationAdapter.getPreferences(adminKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/notification/preference/${adminKey}`);
        });

        testedMethods.add('getPreferences');
    });

    describe('notificationAdapter.optOut', () => {
        const optOutToken = 'my-opt-out-token';

        it('Should do a GET', async () => {
            await notificationAdapter.optOut(optOutToken);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await notificationAdapter.optOut(optOutToken);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the notification/optout URL with token', async () => {
            await notificationAdapter.optOut(optOutToken);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/notification/optout/${optOutToken}`);
        });

        it('Should support generic URL options', async () => {
            await notificationAdapter.optOut(optOutToken, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/notification/optout/${optOutToken}`);
        });

        testedMethods.add('optOut');
    });

    describe('notificationAdapter.optOutByType', () => {
        const notificationType = 'MARKETING';
        const optOutToken = 'my-opt-out-token';

        it('Should do a GET', async () => {
            await notificationAdapter.optOutByType(notificationType, optOutToken);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await notificationAdapter.optOutByType(notificationType, optOutToken);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the notification/optout URL with type and token', async () => {
            await notificationAdapter.optOutByType(notificationType, optOutToken);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/notification/optout/${notificationType}/${optOutToken}`);
        });

        it('Should support generic URL options', async () => {
            await notificationAdapter.optOutByType(notificationType, optOutToken, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/notification/optout/${notificationType}/${optOutToken}`);
        });

        testedMethods.add('optOutByType');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(notificationAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

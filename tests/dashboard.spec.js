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
    dashboardAdapter,
    config,
    getFunctionKeys,
} from './common';

describe('dashboardAdapter', () => {
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

    describe('dashboardAdapter.get', () => {
        const adminKey = 'my-admin-key';

        it('Should do a GET', async () => {
            await dashboardAdapter.get(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await dashboardAdapter.get(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the dashboard preference URL with version and adminKey', async () => {
            await dashboardAdapter.get(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/dashboard/preference/V1/${adminKey}`);
        });

        it('Should support generic URL options', async () => {
            await dashboardAdapter.get(adminKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/dashboard/preference/V1/${adminKey}`);
        });

        testedMethods.add('get');
    });

    describe('dashboardAdapter.create', () => {
        const adminKey = 'my-admin-key';

        it('Should do a POST', async () => {
            await dashboardAdapter.create(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await dashboardAdapter.create(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the dashboard preference URL with version and adminKey', async () => {
            await dashboardAdapter.create(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/dashboard/preference/V1/${adminKey}`);
        });

        it('Should support generic URL options', async () => {
            await dashboardAdapter.create(adminKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/dashboard/preference/V1/${adminKey}`);
        });

        it('Should pass items in the request body', async () => {
            const items = { set: { theme: { dark: true } } };
            await dashboardAdapter.create(adminKey, { items });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('items');
            expect(body.items).toEqual(items);
        });

        testedMethods.add('create');
    });

    describe('dashboardAdapter.update', () => {
        const adminKey = 'my-admin-key';
        const items = { set: { theme: { dark: true } } };

        it('Should do a PUT', async () => {
            await dashboardAdapter.update(adminKey, items);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PUT');
        });

        it('Should have authorization', async () => {
            await dashboardAdapter.update(adminKey, items);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the dashboard preference URL with version and adminKey', async () => {
            await dashboardAdapter.update(adminKey, items);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/dashboard/preference/V1/${adminKey}`);
        });

        it('Should support generic URL options', async () => {
            await dashboardAdapter.update(adminKey, items, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/dashboard/preference/V1/${adminKey}`);
        });

        it('Should pass items in the request body', async () => {
            await dashboardAdapter.update(adminKey, items);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(items);
        });

        testedMethods.add('update');
    });

    describe('dashboardAdapter.remove', () => {
        const adminKey = 'my-admin-key';

        it('Should do a DELETE', async () => {
            await dashboardAdapter.remove(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await dashboardAdapter.remove(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the dashboard preference URL with version and adminKey', async () => {
            await dashboardAdapter.remove(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/dashboard/preference/V1/${adminKey}`);
        });

        it('Should support generic URL options', async () => {
            await dashboardAdapter.remove(adminKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/dashboard/preference/V1/${adminKey}`);
        });

        testedMethods.add('remove');
    });

    describe('dashboardAdapter.getAll', () => {
        it('Should do a GET', async () => {
            await dashboardAdapter.getAll();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await dashboardAdapter.getAll();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the dashboard preference URL with version', async () => {
            await dashboardAdapter.getAll();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/dashboard/preference/V1`);
        });

        it('Should support generic URL options', async () => {
            await dashboardAdapter.getAll(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/dashboard/preference/V1`);
        });

        testedMethods.add('getAll');
    });

    describe('dashboardAdapter.createDefault', () => {
        it('Should do a POST', async () => {
            await dashboardAdapter.createDefault();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await dashboardAdapter.createDefault();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the dashboard preference URL with version', async () => {
            await dashboardAdapter.createDefault();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/dashboard/preference/V1`);
        });

        it('Should support generic URL options', async () => {
            await dashboardAdapter.createDefault(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/dashboard/preference/V1`);
        });

        it('Should pass items in the request body', async () => {
            const items = { set: { theme: { dark: true } } };
            await dashboardAdapter.createDefault({ items });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('items');
            expect(body.items).toEqual(items);
        });

        testedMethods.add('createDefault');
    });

    describe('dashboardAdapter.updateAll', () => {
        const items = { set: { theme: { dark: true } } };

        it('Should do a PUT', async () => {
            await dashboardAdapter.updateAll(items);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PUT');
        });

        it('Should have authorization', async () => {
            await dashboardAdapter.updateAll(items);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the dashboard preference URL with version', async () => {
            await dashboardAdapter.updateAll(items);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/dashboard/preference/V1`);
        });

        it('Should support generic URL options', async () => {
            await dashboardAdapter.updateAll(items, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/dashboard/preference/V1`);
        });

        it('Should pass items in the request body', async () => {
            await dashboardAdapter.updateAll(items);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(items);
        });

        testedMethods.add('updateAll');
    });

    describe('dashboardAdapter.removeAll', () => {
        it('Should do a DELETE', async () => {
            await dashboardAdapter.removeAll();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await dashboardAdapter.removeAll();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the dashboard preference URL with version', async () => {
            await dashboardAdapter.removeAll();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/dashboard/preference/V1`);
        });

        it('Should support generic URL options', async () => {
            await dashboardAdapter.removeAll(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/dashboard/preference/V1`);
        });

        testedMethods.add('removeAll');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(dashboardAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

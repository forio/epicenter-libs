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
    createFetchMock,
    GENERIC_OPTIONS,
    testedMethods,
    config,
    authAdapter,
    accountAdapter,
} from './common';

describe('accountAdapter', () => {
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

    describe('accountAdapter.getAccount', () => {
        const accountShortName = 'test-account';

        it('Should do a GET', async() => {
            await accountAdapter.getAccount(accountShortName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the account URL', async() => {
            await accountAdapter.getAccount(accountShortName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${accountShortName}/${config.projectShortName}/account`);
        });

        testedMethods.push('getAccount');
    });

    describe('accountAdapter.createAccount', () => {
        const personalView = {
            objectType: 'personal',
            adminKey: 'ADMIN_KEY',
            name: 'Test Account',
            shortName: 'test-account',
        };

        const teamView = {
            objectType: 'team',
            adminKey: 'ADMIN_KEY',
            name: 'Test Team',
            shortName: 'test-team',
            billingInterval: 'monthly',
            subscriptionPlan: 'standard',
        };

        it('Should do a POST', async() => {
            await accountAdapter.createAccount(personalView);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should use the epicenter/manager account URL', async() => {
            await accountAdapter.createAccount(personalView);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/epicenter/manager/account`);
        });

        it('Should pass the account details to the request body for personal account', async() => {
            await accountAdapter.createAccount(personalView);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType');
            expect(body.objectType).toBe('personal');
            expect(body).toHaveProperty('adminKey');
            expect(body.adminKey).toBe(personalView.adminKey);
            expect(body).toHaveProperty('name');
            expect(body.name).toBe(personalView.name);
            expect(body).toHaveProperty('shortName');
            expect(body.shortName).toBe(personalView.shortName);
        });

        it('Should pass the account details to the request body for team account', async() => {
            await accountAdapter.createAccount(teamView);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType');
            expect(body.objectType).toBe('team');
            expect(body).toHaveProperty('adminKey');
            expect(body.adminKey).toBe(teamView.adminKey);
            expect(body).toHaveProperty('name');
            expect(body.name).toBe(teamView.name);
            expect(body).toHaveProperty('shortName');
            expect(body.shortName).toBe(teamView.shortName);
            expect(body).toHaveProperty('billingInterval');
            expect(body.billingInterval).toBe(teamView.billingInterval);
            expect(body).toHaveProperty('subscriptionPlan');
            expect(body.subscriptionPlan).toBe(teamView.subscriptionPlan);
        });

        testedMethods.push('createAccount');
    });

    describe('accountAdapter.updateAccount', () => {
        const personalView = {
            objectType: 'personal',
            name: 'Updated Account',
        };

        const teamView = {
            objectType: 'team',
            name: 'Updated Team',
            billingInterval: 'yearly',
        };

        it('Should do a PATCH', async() => {
            await accountAdapter.updateAccount(personalView);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should use the account URL', async() => {
            await accountAdapter.updateAccount(personalView);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/account`);
        });

        it('Should support generic URL options', async() => {
            await accountAdapter.updateAccount(personalView, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/account`);
        });

        it('Should pass the account details to the request body for personal account', async() => {
            await accountAdapter.updateAccount(personalView);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType');
            expect(body.objectType).toBe('personal');
            expect(body).toHaveProperty('name');
            expect(body.name).toBe(personalView.name);
        });

        it('Should pass the account details to the request body for team account', async() => {
            await accountAdapter.updateAccount(teamView);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType');
            expect(body.objectType).toBe('team');
            expect(body).toHaveProperty('billingInterval');
            expect(body.billingInterval).toBe(teamView.billingInterval);
        });

        testedMethods.push('updateAccount');
    });

    describe('accountAdapter.removeAccount', () => {
        const accountShortName = 'test-account';

        it('Should do a DELETE', async() => {
            await accountAdapter.removeAccount(accountShortName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should use the account URL', async() => {
            await accountAdapter.removeAccount(accountShortName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${accountShortName}/${config.projectShortName}/account`);
        });

        testedMethods.push('removeAccount');
    });

    describe('accountAdapter.teamForAdmin', () => {
        const adminKey = 'ADMIN_KEY';

        it('Should do a GET', async() => {
            await accountAdapter.teamForAdmin(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the epicenter/manager account URL', async() => {
            await accountAdapter.teamForAdmin(adminKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/epicenter/manager/account/team/for/${adminKey}`);
        });

        it('Should support generic URL options', async() => {
            await accountAdapter.teamForAdmin(adminKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/account/team/for/${adminKey}`);
        });

        it('Should pass query parameters', async() => {
            const optionals = {
                includeAllMembers: true,
                filter: 'test',
                first: 0,
                max: 10,
            };
            await accountAdapter.teamForAdmin(adminKey, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('includeAllMembers')).toBe(optionals.includeAllMembers.toString());
            expect(searchParams.get('filter')).toBe(optionals.filter);
            expect(searchParams.get('first')).toBe(optionals.first.toString());
            expect(searchParams.get('max')).toBe(optionals.max.toString());
        });

        testedMethods.push('teamForAdmin');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(accountAdapter).filter((key) => typeof accountAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

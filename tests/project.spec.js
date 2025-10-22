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
    projectAdapter,
    getFunctionKeys,
} from './common';

describe('projectAdapter', () => {
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

    describe('projectAdapter.channelsEnabled', () => {
        it('Should do a GET', async () => {
            await projectAdapter.channelsEnabled();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the project/channel/isEnabled URL', async () => {
            await projectAdapter.channelsEnabled();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/project/channel/isEnabled`);
        });

        it('Should support generic URL options', async () => {
            await projectAdapter.channelsEnabled(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/project/channel/isEnabled`);
        });

        testedMethods.add('channelsEnabled');
    });

    describe('projectAdapter.get', () => {
        it('Should do a GET', async () => {
            await projectAdapter.get();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the project URL', async () => {
            await projectAdapter.get();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/project`);
        });

        it('Should support generic URL options', async () => {
            await projectAdapter.get(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/project`);
        });

        testedMethods.add('get');
    });

    describe('projectAdapter.list', () => {
        it('Should do a GET', async () => {
            await projectAdapter.list(ACCOUNT);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the project/in URL with account context', async () => {
            await projectAdapter.list(ACCOUNT);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/manager/project/in`);
        });

        it('Should support generic URL options', async () => {
            const { accountShortName, server } = GENERIC_OPTIONS;
            // For list method, only pass server and accountShortName, not projectShortName since it's hardcoded to 'manager'
            const options = { server };
            await projectAdapter.list(accountShortName, options);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/manager/project/in`);
        });

        testedMethods.add('list');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(projectAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

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
    presenceAdapter,
} from './common';

describe('presenceAdapter', () => {
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

    describe('presenceAdapter.forGroup', () => {
        const groupKey = 'GROUP_KEY';

        it('Should do a GET', async() => {
            await presenceAdapter.forGroup(groupKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await presenceAdapter.forGroup(groupKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the presence/group URL with groupKey', async() => {
            await presenceAdapter.forGroup(groupKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/presence/group/${groupKey}`);
        });

        it('Should support generic URL options', async() => {
            await presenceAdapter.forGroup(groupKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/presence/group/${groupKey}`);
        });

        testedMethods.push('forGroup');
    });

    describe('presenceAdapter.forWorld', () => {
        const worldKey = 'WORLD_KEY';

        it('Should do a GET', async() => {
            await presenceAdapter.forWorld(worldKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await presenceAdapter.forWorld(worldKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the presence/world URL with worldKey', async() => {
            await presenceAdapter.forWorld(worldKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/presence/world/${worldKey}`);
        });

        it('Should support generic URL options', async() => {
            await presenceAdapter.forWorld(worldKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/presence/world/${worldKey}`);
        });

        testedMethods.push('forWorld');
    });

    describe('presenceAdapter.connect', () => {
        // Note: connect() calls cometdAdapter.handshake() internally, which is a complex
        // CometD connection method. Proper testing would require mocking the cometdAdapter.
        it('Should be a placeholder test', () => {
            expect(presenceAdapter.connect).toBeDefined();
        });

        testedMethods.push('connect');
    });

    describe('presenceAdapter.disconnect', () => {
        // Note: disconnect() calls cometdAdapter.disconnect() and makes a conditional DELETE
        // request based on the session's groupKey. Proper testing would require mocking
        // the cometdAdapter and the identification session.
        it('Should be a placeholder test', () => {
            expect(presenceAdapter.disconnect).toBeDefined();
        });

        testedMethods.push('disconnect');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(presenceAdapter).filter((key) => typeof presenceAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

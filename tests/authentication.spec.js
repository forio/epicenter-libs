import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { SESSION, ACCOUNT, PROJECT, GENERIC_OPTIONS, createFetchMock } from './common';

describe('Authentication', () => {
    const { config, authAdapter } = epicenter;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    let capturedRequests = [];
    let mockSetup;

    beforeAll(() => {
        mockSetup = createFetchMock();
        capturedRequests = mockSetup.capturedRequests;
    });

    beforeEach(() => {
        capturedRequests.length = 0;
    });

    afterAll(() => {
        mockSetup.restore();
        authAdapter.removeLocalSession();
    });

    describe('authAdapter.login', () => {
        const CREDENTIALS = { handle: 'joe', password: 'pass', groupKey: 'groupkey' };

        it('Should do a POST', async() => {
            await authAdapter.login(CREDENTIALS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should use the authentication URL', async() => {
            await authAdapter.login(CREDENTIALS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/authentication`);
        });

        it('Should support generic URL options', async() => {
            await authAdapter.login(CREDENTIALS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/authentication`);
        });

        it('Should pass login credentials to the request body', async() => {
            await authAdapter.login(CREDENTIALS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toMatchObject(CREDENTIALS);
        });

        it('Should store the payload as the current session', async() => {
            await authAdapter.login(CREDENTIALS);
            expect(authAdapter.getLocalSession()).toEqual(SESSION);
        });

        it('Should set objectType as user when one is not provided', async() => {
            await authAdapter.login(CREDENTIALS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType', 'user');
        });
    });

    describe('authAdapter.logout', () => {
        it('Should do a DELETE', async() => {
            capturedRequests.length = 0;
            await authAdapter.logout();
            expect(Boolean(authAdapter.getLocalSession())).toBe(false);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });
    });
});
import {
    it,
    expect,
    describe,
    afterAll,
    beforeAll,
    beforeEach,
} from 'vitest';
import {
    SESSION,
    ACCOUNT,
    PROJECT,
    GENERIC_OPTIONS,
    createFetchMock,
    testedMethods,
    getFunctionKeys,
} from './common';

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

        it('Should do a POST', async () => {
            await authAdapter.login(CREDENTIALS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should use the authentication URL', async () => {
            await authAdapter.login(CREDENTIALS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/authentication`);
        });

        it('Should support generic URL options', async () => {
            await authAdapter.login(CREDENTIALS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/authentication`);
        });

        it('Should pass login credentials to the request body', async () => {
            await authAdapter.login(CREDENTIALS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toMatchObject(CREDENTIALS);
        });

        it('Should store the payload as the current session', async () => {
            await authAdapter.login(CREDENTIALS);
            expect(authAdapter.getLocalSession()).toEqual(SESSION);
        });

        it('Should set objectType as user when one is not provided', async () => {
            await authAdapter.login(CREDENTIALS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType', 'user');
        });

        testedMethods.add('login');
    });

    describe('authAdapter.logout', () => {
        it('Should do a DELETE', async () => {
            capturedRequests.length = 0;
            await authAdapter.logout();
            expect(Boolean(authAdapter.getLocalSession())).toBe(false);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        testedMethods.add('logout');
    });

    describe('authAdapter.getSession', () => {
        it('Should do a GET', async () => {
            await authAdapter.getSession({});
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the verification URL', async () => {
            await authAdapter.getSession({});
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/verification`);
        });

        it('Should support generic URL options', async () => {
            await authAdapter.getSession(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/verification`);
        });

        testedMethods.add('getSession');
    });

    describe('authAdapter.getLocalSession', () => {
        it('Should return undefined when no session is set', () => {
            authAdapter.removeLocalSession();
            expect(authAdapter.getLocalSession()).toBeUndefined();
        });

        it('Should return the current session when set', async () => {
            authAdapter.setLocalSession(SESSION);
            expect(authAdapter.getLocalSession()).toEqual(SESSION);
        });

        testedMethods.add('getLocalSession');
    });

    describe('authAdapter.setLocalSession', () => {
        it('Should set the local session', () => {
            const result = authAdapter.setLocalSession(SESSION);
            expect(result).toEqual(SESSION);
            expect(authAdapter.getLocalSession()).toEqual(SESSION);
        });

        testedMethods.add('setLocalSession');
    });

    describe('authAdapter.removeLocalSession', () => {
        it('Should remove the local session', async () => {
            authAdapter.setLocalSession(SESSION);
            await authAdapter.removeLocalSession();
            expect(authAdapter.getLocalSession()).toBeUndefined();
        });

        testedMethods.add('removeLocalSession');
    });

    describe('authAdapter.regenerate', () => {
        const groupKey = 'GROUP_KEY';

        it('Should do a PATCH', async () => {
            await authAdapter.regenerate(groupKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should use the authentication URL', async () => {
            await authAdapter.regenerate(groupKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/authentication`);
        });

        it('Should support generic URL options', async () => {
            await authAdapter.regenerate(groupKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/authentication`);
        });

        it('Should pass groupKey to the request body for user objectType', async () => {
            await authAdapter.regenerate(groupKey, { objectType: 'user' });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType', 'user');
            expect(body).toHaveProperty('groupKey', groupKey);
        });

        it('Should use account context for admin objectType', async () => {
            const accountName = 'test-account';
            await authAdapter.regenerate(accountName, { objectType: 'admin' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(accountName);
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType', 'admin');
        });

        it('Should store the new session locally', async () => {
            await authAdapter.regenerate(groupKey);
            expect(authAdapter.getLocalSession()).toEqual(SESSION);
        });

        testedMethods.add('regenerate');
    });

    describe('authAdapter.sso', () => {
        it('Should do a GET', async () => {
            await authAdapter.sso();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the registration/sso/user URL', async () => {
            await authAdapter.sso();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/registration/sso/user`);
        });

        it('Should support generic URL options', async () => {
            await authAdapter.sso(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/registration/sso/user`);
        });

        testedMethods.add('sso');
    });

    describe('authAdapter.getSAMLLink', () => {
        it('Should do a GET', async () => {
            await authAdapter.getSAMLLink();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the registration/sso/user/saml URL', async () => {
            await authAdapter.getSAMLLink();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/registration/sso/user/saml`);
        });

        it('Should support generic URL options', async () => {
            await authAdapter.getSAMLLink(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/registration/sso/user/saml`);
        });

        testedMethods.add('getSAMLLink');
    });

    describe('authAdapter.generateSAMLLINK', () => {
        it('Should generate a SAML URL string', () => {
            const url = authAdapter.generateSAMLLINK();
            expect(typeof url).toBe('string');
            expect(url).toContain('/registration/sso/user/saml');
        });

        it('Should use default config values', () => {
            const url = authAdapter.generateSAMLLINK();
            expect(url).toContain(config.apiHost);
            expect(url).toContain(config.accountShortName);
            expect(url).toContain(config.projectShortName);
        });

        it('Should support generic URL options', () => {
            const url = authAdapter.generateSAMLLINK(GENERIC_OPTIONS);
            const { accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toContain(accountShortName);
            expect(url).toContain(projectShortName);
        });

        testedMethods.add('generateSAMLLINK');
    });

    describe('authAdapter.ssoOutcome', () => {
        const ltiVersion = '1.3';
        const outcomeInfo = {
            value: 95,
            sourcedId: 'student123',
            outcomeServiceUrl: 'https://example.com/outcome',
        };

        it('Should do a POST', async () => {
            await authAdapter.ssoOutcome(ltiVersion, outcomeInfo);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should use the lti outcome URL with version', async () => {
            await authAdapter.ssoOutcome(ltiVersion, outcomeInfo);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/lti/${ltiVersion}/outcome`);
        });

        it('Should support generic URL options', async () => {
            await authAdapter.ssoOutcome(ltiVersion, outcomeInfo, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/lti/${ltiVersion}/outcome`);
        });

        it('Should pass outcome information to the request body', async () => {
            await authAdapter.ssoOutcome(ltiVersion, outcomeInfo);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('value', outcomeInfo.value);
            expect(body).toHaveProperty('sourcedId', outcomeInfo.sourcedId);
            expect(body).toHaveProperty('outcomeServiceUrl', outcomeInfo.outcomeServiceUrl);
        });

        testedMethods.add('ssoOutcome');
    });

    describe('authAdapter.resetPassword', () => {
        const handle = 'testuser@example.com';

        it('Should do a POST', async () => {
            await authAdapter.resetPassword(handle);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should use the verification/password/user URL', async () => {
            await authAdapter.resetPassword(handle);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/verification/password/user/${handle}`);
        });

        it('Should support generic URL options', async () => {
            await authAdapter.resetPassword(handle, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/verification/password/user/${handle}`);
        });

        it('Should pass optional parameters to the request body', async () => {
            const optionals = {
                redirectURL: 'https://example.com/reset',
                subject: 'Reset your password',
            };
            await authAdapter.resetPassword(handle, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('redirectUrl', optionals.redirectURL);
            expect(body).toHaveProperty('subject', optionals.subject);
        });

        testedMethods.add('resetPassword');
    });

    describe('authAdapter.verify', () => {
        const token = 'test-token-12345';

        it('Should do a GET', async () => {
            await authAdapter.verify(token);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the verification URL', async () => {
            await authAdapter.verify(token);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/verification`);
        });

        it('Should support generic URL options', async () => {
            await authAdapter.verify(token, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/verification`);
        });

        it('Should include Bearer token in authorization header', async () => {
            await authAdapter.verify(token);
            const req = capturedRequests[capturedRequests.length - 1];
            const authHeader = req.requestHeaders.authorization || req.requestHeaders.Authorization;
            expect(authHeader).toBe(`Bearer ${token}`);
        });

        testedMethods.add('verify');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(authAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

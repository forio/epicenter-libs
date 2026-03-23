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
    getPermitHeader,
    testedMethods,
    config,
    authAdapter,
    gitAdapter,
    getFunctionKeys,
} from './common';

describe('gitAdapter', () => {
    let capturedRequests = [];
    let mockSetup;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    const BASE_URL = `https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}`;

    const INTEGRATION_CREATE = {
        uri: 'git@github.com:myorg/myrepo.git',
        publicKey: 'ssh-ed25519 AAAA...',
        privateKey: '-----BEGIN OPENSSH PRIVATE KEY-----',
        publicKeySpec: 'ssh-ed25519',
        privateKeySpec: 'OPENSSH',
        algorithm: 'Ed25519',
    };

    const INTEGRATION_UPDATE = {
        uri: 'git@github.com:myorg/myrepo.git',
        publicKeySpec: 'ssh-ed25519',
        privateKeySpec: 'OPENSSH',
        algorithm: 'Ed25519',
    };

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

    describe('gitAdapter.get', () => {
        it('Should do a GET', async () => {
            await gitAdapter.get();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await gitAdapter.get();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the git URL', async () => {
            await gitAdapter.get();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git`);
        });

        it('Should support generic URL options', async () => {
            await gitAdapter.get(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/git`);
        });

        testedMethods.add('get');
    });

    describe('gitAdapter.getStatus', () => {
        it('Should do a GET', async () => {
            await gitAdapter.getStatus();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await gitAdapter.getStatus();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the git/status URL', async () => {
            await gitAdapter.getStatus();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git/status`);
        });

        it('Should support generic URL options', async () => {
            await gitAdapter.getStatus(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/git/status`);
        });

        testedMethods.add('getStatus');
    });

    describe('gitAdapter.checkout', () => {
        const BRANCH = 'main';

        it('Should do a GET', async () => {
            await gitAdapter.checkout(BRANCH);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await gitAdapter.checkout(BRANCH);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the git/checkout/{branch} URL', async () => {
            await gitAdapter.checkout(BRANCH);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git/checkout/${BRANCH}`);
        });

        it('Should support generic URL options', async () => {
            await gitAdapter.checkout(BRANCH, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/git/checkout/${BRANCH}`);
        });

        testedMethods.add('checkout');
    });

    describe('gitAdapter.reset', () => {
        it('Should do a DELETE', async () => {
            await gitAdapter.reset();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await gitAdapter.reset();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the git/reset URL when no branch is provided', async () => {
            await gitAdapter.reset();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git/reset`);
        });

        it('Should use the git/reset/{branch} URL when branch is provided', async () => {
            await gitAdapter.reset({ branch: 'main' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git/reset/main`);
        });

        it('Should support generic URL options', async () => {
            await gitAdapter.reset(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/git/reset`);
        });

        testedMethods.add('reset');
    });

    describe('gitAdapter.createIntegration', () => {
        it('Should do a POST', async () => {
            await gitAdapter.createIntegration(INTEGRATION_CREATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await gitAdapter.createIntegration(INTEGRATION_CREATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the git/integration URL', async () => {
            await gitAdapter.createIntegration(INTEGRATION_CREATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git/integration`);
        });

        it('Should support generic URL options', async () => {
            await gitAdapter.createIntegration(INTEGRATION_CREATE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/git/integration`);
        });

        it('Should send the integration config in the request body', async () => {
            await gitAdapter.createIntegration(INTEGRATION_CREATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(INTEGRATION_CREATE);
        });

        testedMethods.add('createIntegration');
    });

    describe('gitAdapter.updateIntegration', () => {
        it('Should do a PATCH', async () => {
            await gitAdapter.updateIntegration(INTEGRATION_UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await gitAdapter.updateIntegration(INTEGRATION_UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the git/integration URL', async () => {
            await gitAdapter.updateIntegration(INTEGRATION_UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git/integration`);
        });

        it('Should support generic URL options', async () => {
            await gitAdapter.updateIntegration(INTEGRATION_UPDATE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/git/integration`);
        });

        it('Should send the integration fields in the request body', async () => {
            await gitAdapter.updateIntegration(INTEGRATION_UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(INTEGRATION_UPDATE);
        });

        testedMethods.add('updateIntegration');
    });

    describe('gitAdapter.removeIntegration', () => {
        it('Should do a DELETE', async () => {
            await gitAdapter.removeIntegration();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await gitAdapter.removeIntegration();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the git/integration URL', async () => {
            await gitAdapter.removeIntegration();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git/integration`);
        });

        it('Should support generic URL options', async () => {
            await gitAdapter.removeIntegration(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/git/integration`);
        });

        testedMethods.add('removeIntegration');
    });

    describe('gitAdapter.push', () => {
        it('Should do a POST', async () => {
            await gitAdapter.push();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await gitAdapter.push();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the git/push URL', async () => {
            await gitAdapter.push();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git/push`);
        });

        it('Should support generic URL options', async () => {
            await gitAdapter.push(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/git/push`);
        });

        it('Should send message and password in the request body', async () => {
            await gitAdapter.push({ message: 'my commit', password: 'secret' });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.message).toBe('my commit');
            expect(body.password).toBe('secret');
        });

        it('Should append force as a query parameter', async () => {
            await gitAdapter.push({ force: true });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('force=true');
        });

        testedMethods.add('push');
    });

    describe('gitAdapter.pull', () => {
        it('Should do a POST', async () => {
            await gitAdapter.pull();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await gitAdapter.pull();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the git/pull URL', async () => {
            await gitAdapter.pull();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`${BASE_URL}/git/pull`);
        });

        it('Should support generic URL options', async () => {
            await gitAdapter.pull(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/git/pull`);
        });

        it('Should send password in the request body', async () => {
            await gitAdapter.pull({ password: 'secret' });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.password).toBe('secret');
        });

        it('Should append force as a query parameter', async () => {
            await gitAdapter.pull({ force: true });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('force=true');
        });

        it('Should set X-Forio-Confirmation header when confirm is true', async () => {
            await gitAdapter.pull({ confirm: true });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getPermitHeader(req.requestHeaders)).toBeTruthy();
        });

        it('Should not set X-Forio-Confirmation header when confirm is falsy', async () => {
            await gitAdapter.pull();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getPermitHeader(req.requestHeaders)).toBeFalsy();
        });

        testedMethods.add('pull');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(gitAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

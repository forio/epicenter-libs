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
    SCOPE_BOUNDARY,
    createFetchMock,
    getAuthHeader,
    testedMethods,
    config,
    authAdapter,
    walletAdapter,
} from './common';

describe('walletAdapter', () => {
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

    describe('walletAdapter.get', () => {
        const userKey = 'USER_KEY';
        const scopeBoundary = SCOPE_BOUNDARY.PROJECT;
        const scopeKey = 'PROJECT_KEY';

        const scope = {
            userKey, scopeKey, scopeBoundary,
        };

        it('Should do a GET', async() => {
            await walletAdapter.get(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await walletAdapter.get(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the wallet URL', async() => {
            await walletAdapter.get(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/wallet/${scopeBoundary}/${scopeKey}/${userKey}`);
        });

        it('Should support generic URL options', async() => {
            await walletAdapter.get(scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/wallet/${scopeBoundary}/${scopeKey}/${userKey}`);
        });

        testedMethods.push('get');
    });

    describe('walletAdapter.update', () => {
        const userKey = 'USER_KEY';
        const scopeBoundary = SCOPE_BOUNDARY.PROJECT;
        const scopeKey = 'PROJECT_KEY';

        const scope = {
            userKey, scopeKey, scopeBoundary,
        };

        const items = [
            { label: 'item1', value: 'value1' },
            { label: 'item2', value: 'value2' },
            { label: 'item3', value: 'value3' },
        ];

        it('Should do a POST', async() => {
            await walletAdapter.update(scope, items);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await walletAdapter.update(scope, items);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the wallet URL', async() => {
            await walletAdapter.update(scope, items);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/wallet`);
        });

        it('Should support generic URL options', async() => {
            await walletAdapter.update(scope, items, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/wallet`);
        });

        it('Should pass the wallet details to the request body', async() => {
            await walletAdapter.update(scope, items);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('items');
            expect(body).toHaveProperty('scope');
        });

        testedMethods.push('update');
    });

    describe('walletAdapter.withScope', () => {
        const userKey = 'USER_KEY';
        const scopeBoundary = SCOPE_BOUNDARY.PROJECT;
        const scopeKey = 'PROJECT_KEY';

        const scope = {
            userKey, scopeKey, scopeBoundary,
        };

        const optionals = {
            first: 20,
            max: 10,
        };

        it('Should do a GET', async() => {
            await walletAdapter.withScope(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await walletAdapter.withScope(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the wallet URL', async() => {
            await walletAdapter.withScope(scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/wallet/with/${scopeBoundary}/${scopeKey}?first=${optionals.first}&max=${optionals.max}`);
        });

        it('Should support generic URL options', async() => {
            const options = { ...GENERIC_OPTIONS, ...optionals };
            await walletAdapter.withScope(scope, options);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/wallet/with/${scopeBoundary}/${scopeKey}?first=${optionals.first}&max=${optionals.max}`);
        });

        testedMethods.push('withScope');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(walletAdapter).filter((key) => typeof walletAdapter[key] === 'function');
        expect(actualMethods).toEqual(testedMethods);
    });
});

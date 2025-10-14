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
    somebodyAdapter,
} from './common';

describe('somebodyAdapter', () => {
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

    describe('somebodyAdapter.create', () => {
        const email = 'test4@test.com';

        const optionals = {
            givenName: 'Test',
            familyName: 'Person4',
        };

        const scope = {
            scopeBoundary: 'group',
            scopeKey: 'test-group',
        };

        it('Should do a POST', async() => {
            await somebodyAdapter.create(email, scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await somebodyAdapter.create(email, scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the somebody URL', async() => {
            await somebodyAdapter.create(email, scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/somebody`);
        });

        it('Should support generic URL options', async() => {
            await somebodyAdapter.create(email, scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody`);
        });

        it('Should pass the arguments as part of the request body', async() => {
            await somebodyAdapter.create(email, scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual({ email, scope, ...optionals });
        });

        testedMethods.push('create');
    });

    describe('somebodyAdapter.get', () => {
        const somebodyKey = 'user-12345';

        it('Should do a GET', async() => {
            await somebodyAdapter.get(somebodyKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await somebodyAdapter.get(somebodyKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the somebody URL', async() => {
            await somebodyAdapter.get(somebodyKey);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/somebody/${somebodyKey}`);
        });

        it('Should support generic URL options', async() => {
            await somebodyAdapter.get(somebodyKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/${somebodyKey}`);
        });

        testedMethods.push('get');
    });

    describe('somebodyAdapter.inScope', () => {
        const optionals = {
            first: 0,
            max: 10,
        };

        const scope = {
            scopeBoundary: 'group',
            scopeKey: 'test-group',
        };

        it('Should do a GET', async() => {
            await somebodyAdapter.inScope(scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await somebodyAdapter.inScope(scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the somebody URL', async() => {
            await somebodyAdapter.inScope(scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/somebody/in/${scope.scopeBoundary}/${scope.scopeKey}`);
        });

        it('Should pass search options in the URL search parameters', async() => {
            await somebodyAdapter.inScope(scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('first')).toBe(optionals.first.toString());
            expect(searchParams.get('max')).toBe(optionals.max.toString());
        });

        it('Should support generic URL options', async() => {
            await somebodyAdapter.inScope(scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/in/${scope.scopeBoundary}/${scope.scopeKey}`);
        });

        testedMethods.push('inScope');
    });

    describe('somebodyAdapter.byEmail', () => {
        const email = 'test4@test.com';

        const optionals = {
            givenName: 'Test',
            familyName: 'Person4',
        };

        const scope = {
            scopeBoundary: 'group',
            scopeKey: 'test-group',
        };

        it('Should do a GET', async() => {
            await somebodyAdapter.byEmail(email, scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await somebodyAdapter.byEmail(email, scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the somebody URL', async() => {
            await somebodyAdapter.byEmail(email, scope, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/somebody/with/${scope.scopeBoundary}/${scope.scopeKey}/${email}`);
        });

        it('Should support generic URL options', async() => {
            await somebodyAdapter.byEmail(email, scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/with/${scope.scopeBoundary}/${scope.scopeKey}/${email}`);
        });

        testedMethods.push('byEmail');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(somebodyAdapter).filter((key) => typeof somebodyAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

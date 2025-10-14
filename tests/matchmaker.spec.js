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
    matchmakerAdapter,
    SCOPE_BOUNDARY,
} from './common';

describe('matchmakerAdapter', () => {
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

    describe('matchmakerAdapter.create', () => {
        const name = 'my-matchmaker';
        const partners = 2;
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: 'GROUP_KEY',
        };

        it('Should do a POST', async() => {
            await matchmakerAdapter.create(name, partners, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await matchmakerAdapter.create(name, partners, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the matchmaker/udome URL with name', async() => {
            await matchmakerAdapter.create(name, partners, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/matchmaker/udome/${name}`);
        });

        it('Should support generic URL options', async() => {
            await matchmakerAdapter.create(name, partners, scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/matchmaker/udome/${name}`);
        });

        it('Should pass scope and partners to the request body', async() => {
            await matchmakerAdapter.create(name, partners, scope);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('scope');
            expect(body.scope.scopeBoundary).toBe(scope.scopeBoundary);
            expect(body.scope.scopeKey).toBe(scope.scopeKey);
            expect(body).toHaveProperty('partners', partners);
        });

        testedMethods.push('create');
    });

    describe('matchmakerAdapter.edit', () => {
        const udomeKey = 'UDOME_KEY';
        const closed = true;

        it('Should do a PUT', async() => {
            await matchmakerAdapter.edit(udomeKey, closed);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PUT');
        });

        it('Should have authorization', async() => {
            await matchmakerAdapter.edit(udomeKey, closed);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the matchmaker/udome URL with udomeKey', async() => {
            await matchmakerAdapter.edit(udomeKey, closed);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/matchmaker/udome/${udomeKey}`);
        });

        it('Should support generic URL options', async() => {
            await matchmakerAdapter.edit(udomeKey, closed, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/matchmaker/udome/${udomeKey}`);
        });

        it('Should pass closed status to the request body', async() => {
            await matchmakerAdapter.edit(udomeKey, closed);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('closed', closed);
        });

        testedMethods.push('edit');
    });

    describe('matchmakerAdapter.addUser', () => {
        const udomeKey = 'UDOME_KEY';

        it('Should do a PATCH', async() => {
            await matchmakerAdapter.addUser(udomeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async() => {
            await matchmakerAdapter.addUser(udomeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the matchmaker/udome URL', async() => {
            await matchmakerAdapter.addUser(udomeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/matchmaker/udome`);
        });

        it('Should support generic URL options', async() => {
            await matchmakerAdapter.addUser(udomeKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/matchmaker/udome`);
        });

        it('Should pass udomeKey to the request body', async() => {
            await matchmakerAdapter.addUser(udomeKey);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('udomeKey', udomeKey);
        });

        testedMethods.push('addUser');
    });

    describe('matchmakerAdapter.get', () => {
        const udomeKey = 'UDOME_KEY';

        it('Should do a GET', async() => {
            await matchmakerAdapter.get(udomeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await matchmakerAdapter.get(udomeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the matchmaker/udome URL with udomeKey', async() => {
            await matchmakerAdapter.get(udomeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/matchmaker/udome/${udomeKey}`);
        });

        it('Should support generic URL options', async() => {
            await matchmakerAdapter.get(udomeKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/matchmaker/udome/${udomeKey}`);
        });

        testedMethods.push('get');
    });

    describe('matchmakerAdapter.byName', () => {
        const name = 'my-matchmaker';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: 'GROUP_KEY',
        };

        it('Should do a GET', async() => {
            await matchmakerAdapter.byName(name, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await matchmakerAdapter.byName(name, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the matchmaker/udome URL with scope and name', async() => {
            await matchmakerAdapter.byName(name, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/matchmaker/udome/${scope.scopeBoundary}/${scope.scopeKey}/${name}`);
        });

        it('Should support generic URL options', async() => {
            await matchmakerAdapter.byName(name, scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/matchmaker/udome/${scope.scopeBoundary}/${scope.scopeKey}/${name}`);
        });

        testedMethods.push('byName');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(matchmakerAdapter).filter((key) => typeof matchmakerAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

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
    createFetchMock,
    GENERIC_OPTIONS,
    testedMethods,
    config,
    authAdapter,
    leaderboardAdapter,
    getAuthHeader,
    getFunctionKeys,
} from './common';

const DEPRECATED_METHODS = ['get'];

describe('leaderboardAdapter', () => {
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

    describe('leaderboardAdapter.update', () => {
        const COLLECTION = 'mycollection';
        const SCOPE = { scopeBoundary: 'group', scopeKey: 'mygroupkey' };
        const SCORES = [{ name: 'score1', quantity: 10 }, { name: 'score2', quantity: 20 }];
        const OPTIONALS = {
            tags: [{ label: 'tag1', content: 'tagcontent1' }],
            allowChannel: true,
        };

        it('Should do a POST', async () => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /leaderboard URL', async () => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/leaderboard`);
        });

        it('Should support generic URL options', async () => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/leaderboard`);
        });

        it('Should pass the leaderboard data in the request body', async () => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES, OPTIONALS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual({
                collection: COLLECTION,
                scope: {
                    ...SCOPE,
                    userKey: SESSION.userKey,
                },
                scores: SCORES,
                ...OPTIONALS,
            });
        });

        testedMethods.add('update');
    });

    describe('leaderboardAdapter.list', () => {
        const COLLECTION = 'mycollection';
        const SCOPE = { scopeBoundary: 'group', scopeKey: 'mygroupkey' };
        const SEARCH_OPTIONS = {
            filter: ['score.total>10'],
            sort: ['+score.total'],
            first: 0,
            max: 20,
        };

        it('Should do a GET', async () => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /leaderboard/{scopeBoundary}/{scopeKey}/{collection} URL', async () => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/leaderboard/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${COLLECTION}`);
        });

        it('Should support generic URL options', async () => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            const url = req.url.split('?')[0];
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/leaderboard/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${COLLECTION}`);
        });

        it('Should pass search options in the URL search parameters', async () => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('filter')).toBe(SEARCH_OPTIONS.filter.join(';'));
            expect(searchParams.get('sort')).toBe(SEARCH_OPTIONS.sort.join(';'));
            expect(searchParams.get('first')).toBe(SEARCH_OPTIONS.first.toString());
            expect(searchParams.get('max')).toBe(SEARCH_OPTIONS.max.toString());
        });

        testedMethods.add('list');
    });

    describe('leaderboardAdapter.getCount', () => {
        const COLLECTION = 'mycollection';
        const SCOPE = { scopeBoundary: 'group', scopeKey: 'mygroupkey' };
        const SEARCH_OPTIONS = {
            filter: ['score.total>10'],
        };

        it('Should do a GET', async () => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /leaderboard/count/{scopeBoundary}/{scopeKey}/{collection} URL', async () => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/leaderboard/count/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${COLLECTION}`);
        });

        it('Should support generic URL options', async () => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            const url = req.url.split('?')[0];
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/leaderboard/count/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${COLLECTION}`);
        });

        it('Should pass search options in the URL search parameters', async () => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('filter')).toBe(SEARCH_OPTIONS.filter.join(';'));
        });

        testedMethods.add('getCount');
    });

    describe('leaderboardAdapter.get', () => {
        it('Should be deprecated', () => {
            expect(DEPRECATED_METHODS).toContain('get');
        });

        testedMethods.add('get');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(leaderboardAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, createFetchMock, GENERIC_OPTIONS, testedMethods, config, authAdapter, somebodyAdapter, getAuthHeader } from './common';

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

        it('Should do a POST', async() => {
            await somebodyAdapter.create(email, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await somebodyAdapter.create(email, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the somebody URL', async() => {
            await somebodyAdapter.create(email, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody`);
        });

        it('Should support generic URL options', async() => {
            await somebodyAdapter.create(email, { optionals, ...GENERIC_OPTIONS });
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody`);
        });

        it('Should pass the arguments as part of the request body', async() => {
            await somebodyAdapter.create(email, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual({email, ...optionals});
        });

        testedMethods.push('create');
    });

    describe('somebodyAdapter.query', () => {
        const OPTIONS = {
            filter: [
                'email|=test4@test.com|test2@test.com',
            ],
            sort: ['-somebody.email'],    
            first: 3,                   
            max: 10,                    
            count: false,               
        };

        it('Should do a GET', async() => {
            await somebodyAdapter.query(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await somebodyAdapter.query(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the somebody URL', async() => {
            await somebodyAdapter.query(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody/search`);
        });

        it('Should support generic URL options', async() => {
            await somebodyAdapter.query(OPTIONS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/search`);
        });

        it('Should pass in query options as a part of the search parameters (query string)', async() => {
            await somebodyAdapter.query(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('filter')).toBe(OPTIONS.filter.join(';'));
            expect(searchParams.get('sort')).toBe(OPTIONS.sort.join(';'));
            expect(searchParams.get('first')).toBe(OPTIONS.first.toString());
            expect(searchParams.get('max')).toBe(OPTIONS.max.toString());
            expect(searchParams.get('count')).toBe(OPTIONS.count.toString());
        });

        testedMethods.push('query');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(somebodyAdapter).filter((key) => typeof somebodyAdapter[key] === 'function');
        expect(actualMethods).toEqual(testedMethods);
    });
});

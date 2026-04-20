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
    testedMethods,
    getAuthHeader,
    authAdapter,
    automatonAdapter,
    config,
    getFunctionKeys,
} from './common';

describe('automatonAdapter', () => {
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

    describe('automatonAdapter.start', () => {
        const automata = 'ADD_USER_TO_ALL_GROUPS';
        const parameters = {
            userId: { objectType: 'string', value: 'user123' },
        };

        it('Should do a POST', async () => {
            await automatonAdapter.start(automata, parameters);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await automatonAdapter.start(automata, parameters);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the automaton URL with automata action', async () => {
            await automatonAdapter.start(automata, parameters);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/automaton/${automata}`);
        });

        it('Should support generic URL options', async () => {
            await automatonAdapter.start(automata, parameters, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/automaton/${automata}`);
        });

        it('Should pass parameters in the request body', async () => {
            await automatonAdapter.start(automata, parameters);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('parameters');
            expect(body.parameters).toEqual(parameters);
        });

        it('Should pass addNonce as a query parameter', async () => {
            await automatonAdapter.start(automata, parameters, { addNonce: true });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('addNonce=true');
        });

        testedMethods.add('start');
    });

    describe('automatonAdapter.getStatus', () => {
        const jobId = 12345;

        it('Should do a GET', async () => {
            await automatonAdapter.getStatus(jobId);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await automatonAdapter.getStatus(jobId);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the automaton URL with jobId and project path segment', async () => {
            await automatonAdapter.getStatus(jobId);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/automaton/${jobId}`);
        });

        it('Should support generic URL options', async () => {
            await automatonAdapter.getStatus(jobId, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName } = GENERIC_OPTIONS;
            const { projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/automaton/${jobId}`);
        });

        testedMethods.add('getStatus');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(automatonAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

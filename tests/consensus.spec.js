import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, createFetchMock, GENERIC_OPTIONS, testedMethods, config, authAdapter, consensusAdapter, getAuthHeader } from './common';

describe('consensusAdapter', () => {
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
        authAdapter.removeLocalSession();
    });

    describe('consensusAdapter.create', () => {
        const worldKey = 'RUN_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';
        const expectedRoles = {
            ROLE1: 1,
            ROLE2: 1,
            ROLE3: 2,
        };
        const defaultActions = {
            ROLE1: [{ name: 'step', arguments: [] }],
            ROLE2: [{ name: 'step', arguments: [] }],
            ROLE3: [{ name: 'step', arguments: [] }],
        };

        it('Should do a POST', async() => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus URL', async() => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/consensus/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async() => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/${worldKey}/${name}/${stage}`);
        });

        it('Should pass the consensus details to the request body', async() => {
            const optionals = {
                ttlSeconds: 60000,
                transparent: true,
                allowChannel: true,
            };
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('ttlSeconds');
            expect(body.ttlSeconds).toBe(optionals.ttlSeconds);
            expect(body).toHaveProperty('transparent');
            expect(body.transparent).toBe(optionals.transparent);
            expect(body).toHaveProperty('actions');
            expect(body).toHaveProperty('expectedRoles');
            expect(body.allowChannel).toBe(optionals.allowChannel);
        });

        testedMethods.push('create');
    });

    describe('consensusAdapter.submitActions', () => {
        const worldKey = 'RUN_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';
        const actions = {
            ROLE1: [{ name: 'step', arguments: [] }],
            ROLE2: [{ name: 'step', arguments: [] }],
            ROLE3: [{ name: 'step', arguments: [] }],
        };

        it('Should do a POST', async() => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/actions URL', async() => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/consensus/publish/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async() => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/publish/${worldKey}/${name}/${stage}`);
        });

        it('Should pass the consensus details to the request body', async() => {
            const optionals = {
                ritual: 'REANIMATE',
            };
            await consensusAdapter.submitActions(worldKey, name, stage, actions, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('actions');
            expect(body).toHaveProperty('ritual');
            expect(body.ritual).toBe(optionals.ritual);
        });

        testedMethods.push('submitActions');
    });

    //TODO: Make a test for each new method in the consensusAdapter
    // it('Should not have any untested methods', () => {
    //     chai.expect(consensusAdapter).to.have.all.keys(...testedMethods);
    // });
    describe('consensusAdapter.undoSubmitFor', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';
        const userKey = 'USER_KEY';

        it('Should do a DELETE', async() => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async() => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/actions URL', async() => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/consensus/expectation/${worldKey}/${name}/${stage}/${userKey}`);
        });

        it('Should support generic URL options', async() => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/expectation/${worldKey}/${name}/${stage}/${userKey}`);
        });

        testedMethods.push('undoSubmitFor');
    });
});

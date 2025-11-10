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
    consensusAdapter,
    getAuthHeader,
    getFunctionKeys,
} from './common';

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

        it('Should do a POST', async () => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus URL', async () => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/${worldKey}/${name}/${stage}`);
        });

        it('Should pass the consensus details to the request body', async () => {
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

        testedMethods.add('create');
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

        it('Should do a POST', async () => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/actions URL', async () => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/publish/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/publish/${worldKey}/${name}/${stage}`);
        });

        it('Should pass the consensus details to the request body', async () => {
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

        testedMethods.add('submitActions');
    });

    describe('consensusAdapter.undoSubmitFor', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';
        const userKey = 'USER_KEY';

        it('Should do a DELETE', async () => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/actions URL', async () => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/expectation/${worldKey}/${name}/${stage}/${userKey}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/expectation/${worldKey}/${name}/${stage}/${userKey}`);
        });

        testedMethods.add('undoSubmitFor');
    });

    describe('consensusAdapter.deleteBarrier', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';

        it('Should do a DELETE', async () => {
            await consensusAdapter.deleteBarrier(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.deleteBarrier(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus URL', async () => {
            await consensusAdapter.deleteBarrier(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.deleteBarrier(worldKey, name, stage, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/${worldKey}/${name}/${stage}`);
        });

        testedMethods.add('deleteBarrier');
    });

    describe('consensusAdapter.deleteAll', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';

        it('Should do a DELETE', async () => {
            await consensusAdapter.deleteAll(worldKey, name);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.deleteAll(worldKey, name);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus URL', async () => {
            await consensusAdapter.deleteAll(worldKey, name);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/${worldKey}/${name}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.deleteAll(worldKey, name, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/${worldKey}/${name}`);
        });

        testedMethods.add('deleteAll');
    });

    describe('consensusAdapter.forceClose', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';

        it('Should do a POST', async () => {
            await consensusAdapter.forceClose(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.forceClose(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/close URL', async () => {
            await consensusAdapter.forceClose(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/close/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.forceClose(worldKey, name, stage, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/close/${worldKey}/${name}/${stage}`);
        });

        it('Should pass the ritual to the request body', async () => {
            const optionals = {
                ritual: 'REANIMATE',
            };
            await consensusAdapter.forceClose(worldKey, name, stage, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('ritual');
            expect(body.ritual).toBe(optionals.ritual);
        });

        testedMethods.add('forceClose');
    });

    describe('consensusAdapter.list', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';

        it('Should do a GET', async () => {
            await consensusAdapter.list(worldKey, name);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.list(worldKey, name);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus URL', async () => {
            await consensusAdapter.list(worldKey, name);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/${worldKey}/${name}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.list(worldKey, name, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/${worldKey}/${name}`);
        });

        testedMethods.add('list');
    });

    describe('consensusAdapter.load', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';

        it('Should do a GET', async () => {
            await consensusAdapter.load(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.load(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus URL', async () => {
            await consensusAdapter.load(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.load(worldKey, name, stage, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/${worldKey}/${name}/${stage}`);
        });

        testedMethods.add('load');
    });

    describe('consensusAdapter.triggerFor', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';
        const userKey = 'USER_KEY';
        const actions = [{ name: 'step', arguments: [] }];

        it('Should do a POST', async () => {
            await consensusAdapter.triggerFor(worldKey, name, stage, userKey, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.triggerFor(worldKey, name, stage, userKey, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/trigger URL', async () => {
            await consensusAdapter.triggerFor(worldKey, name, stage, userKey, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/trigger/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.triggerFor(worldKey, name, stage, userKey, actions, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/trigger/${worldKey}/${name}/${stage}`);
        });

        it('Should pass the consensus details to the request body', async () => {
            const optionals = {
                ritual: 'REANIMATE',
                message: 'Test message',
            };
            await consensusAdapter.triggerFor(worldKey, name, stage, userKey, actions, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('userKey');
            expect(body.userKey).toBe(userKey);
            expect(body).toHaveProperty('actions');
            expect(body.actions).toEqual(actions);
            expect(body).toHaveProperty('message');
            expect(body.message).toBe(optionals.message);
            expect(body).toHaveProperty('ritual');
            expect(body.ritual).toBe(optionals.ritual);
        });

        testedMethods.add('triggerFor');
    });

    describe('consensusAdapter.undoSubmit', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';

        it('Should do a DELETE', async () => {
            await consensusAdapter.undoSubmit(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.undoSubmit(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/arrival URL', async () => {
            await consensusAdapter.undoSubmit(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/arrival/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.undoSubmit(worldKey, name, stage, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/arrival/${worldKey}/${name}/${stage}`);
        });

        testedMethods.add('undoSubmit');
    });

    describe('consensusAdapter.updateDefaults', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';
        const actions = [{ name: 'step', arguments: [] }];

        it('Should do a PATCH', async () => {
            await consensusAdapter.updateDefaults(worldKey, name, stage, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.updateDefaults(worldKey, name, stage, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/actions URL', async () => {
            await consensusAdapter.updateDefaults(worldKey, name, stage, actions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/actions/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.updateDefaults(worldKey, name, stage, actions, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/actions/${worldKey}/${name}/${stage}`);
        });

        it('Should pass the actions to the request body', async () => {
            await consensusAdapter.updateDefaults(worldKey, name, stage, actions);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('actions');
            expect(body.actions).toEqual(actions);
        });

        testedMethods.add('updateDefaults');
    });

    describe('consensusAdapter.pause', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';

        it('Should do a PATCH', async () => {
            await consensusAdapter.pause(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.pause(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/pause URL', async () => {
            await consensusAdapter.pause(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/pause/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.pause(worldKey, name, stage, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/pause/${worldKey}/${name}/${stage}`);
        });

        it('Should pass resume: false to the request body', async () => {
            await consensusAdapter.pause(worldKey, name, stage);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('resume');
            expect(body.resume).toBe(false);
        });

        testedMethods.add('pause');
    });

    describe('consensusAdapter.resume', () => {
        const worldKey = 'WORLD_KEY';
        const name = 'CONSENSUS_NAME';
        const stage = 'CONSENSUS_STAGE';

        it('Should do a PATCH', async () => {
            await consensusAdapter.resume(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await consensusAdapter.resume(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the consensus/pause URL', async () => {
            await consensusAdapter.resume(worldKey, name, stage);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/consensus/pause/${worldKey}/${name}/${stage}`);
        });

        it('Should support generic URL options', async () => {
            await consensusAdapter.resume(worldKey, name, stage, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/pause/${worldKey}/${name}/${stage}`);
        });

        it('Should pass resume: true to the request body', async () => {
            await consensusAdapter.resume(worldKey, name, stage);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('resume');
            expect(body.resume).toBe(true);
        });

        testedMethods.add('resume');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(consensusAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

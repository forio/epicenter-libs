// Largely Claude Opus

import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE } from './constants';
chai.use(require('sinon-chai'));

describe('World APIs', () => {
    const { config, worldAdapter, authAdapter, SCOPE_BOUNDARY } = epicenter;
    let fakeServer;
    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;
    const testedMethods = [];

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);
        fakeServer.respondWith(/(.*)\/world/, function(xhr, id) {
            const RESPONSE = {
                /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */
            };
            xhr.respond(OK_CODE, { 'content-type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('worldAdapter.create', () => {
        it('Should do a POST to world', async() => {
            await worldAdapter.create();
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });

        it('Should have authorization', async() => {
            await worldAdapter.create();
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/{groupName} URL', async() => {
            await worldAdapter.create();
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/${SESSION.groupName}`);
        });

        it('Should forward world config in the request body', async() => {
            const config = {
                name: 'world-name',
                displayName: 'World Name',
                allowChannel: true,
                worldNameGenerator: { objectType: 'color-animal' },
            };
            await worldAdapter.create(config);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.deep.equal(config);
        });

        testedMethods.push('create');
    });

    describe('worldAdapter.update', () => {
        const WORLD_KEY = 'world-key';
        const UPDATE = {
            displayName: 'New World Name',
            allowChannel: true,
        };

        it('Should do a PATCH to world', async() => {
            await worldAdapter.update(WORLD_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        });

        it('Should have authorization', async() => {
            await worldAdapter.update(WORLD_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/{worldKey} URL', async() => {
            await worldAdapter.update(WORLD_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/${WORLD_KEY}`);
        });

        it('Should send the update in the request body', async() => {
            await worldAdapter.update(WORLD_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            JSON.parse(req.requestBody).should.deep.equal(UPDATE);
        });

        testedMethods.push('update');
    });

    describe('worldAdapter.destroy', () => {
        const WORLD_KEY = 'world-key';

        it('Should do a DELETE to world', async() => {
            await worldAdapter.destroy(WORLD_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });

        it('Should have authorization', async() => {
            await worldAdapter.destroy(WORLD_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/{worldKey} URL', async() => {
            await worldAdapter.destroy(WORLD_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/${WORLD_KEY}`);
        });

        testedMethods.push('destroy');
    });

    describe('worldAdapter.get', () => {
        it('Should do a GET to world', async() => {
            await worldAdapter.get();
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });

        it('Should have authorization', async() => {
            await worldAdapter.get();
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/{groupName} URL', async() => {
            await worldAdapter.get();
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/${SESSION.groupName}`);
        });

        testedMethods.push('get');
    });

    describe('worldAdapter.getPersonas', () => {
        const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };

        it('Should do a GET to persona', async() => {
            await worldAdapter.getPersonas(GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });

        it('Should have authorization', async() => {
            await worldAdapter.getPersonas(GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/persona/group URL', async() => {
            await worldAdapter.getPersonas(GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/persona/group/${GROUP_SCOPE.scopeKey}`);
        });
        testedMethods.push('getPersonas');
    });

    describe('worldAdapter.setPersonas', () => {
        const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };
        const PERSONAS = [
            { role: 'leader', minimum: 1 },
            { role: 'member', minimum: 2, maximum: 5 },
        ];

        it('Should do a PUT to persona', async() => {
            await worldAdapter.setPersonas(PERSONAS, GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PUT');
        });

        it('Should have authorization', async() => {
            await worldAdapter.setPersonas(PERSONAS, GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/persona/group URL', async() => {
            await worldAdapter.setPersonas(PERSONAS, GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/persona/group/${GROUP_SCOPE.scopeKey}`);
        });

        it('Should send the personas in the request body', async() => {
            await worldAdapter.setPersonas(PERSONAS, GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            JSON.parse(req.requestBody).should.deep.equal(PERSONAS);
        });
        testedMethods.push('setPersonas');
    });

    describe('worldAdapter.assignRun', () => {
        const WORLD_KEY = 'world-key';
        const RUN_KEY = 'run-key';

        it('Should do a PATCH to world/run', async() => {
            await worldAdapter.assignRun(WORLD_KEY, RUN_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        });

        it('Should have authorization', async() => {
            await worldAdapter.assignRun(WORLD_KEY, RUN_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/run/{worldKey} URL', async() => {
            await worldAdapter.assignRun(WORLD_KEY, RUN_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/run/${WORLD_KEY}`);
        });

        it('Should send the runKey in the request body', async() => {
            await worldAdapter.assignRun(WORLD_KEY, RUN_KEY);
            const req = fakeServer.requests.pop();
            JSON.parse(req.requestBody).should.deep.equal({ runKey: RUN_KEY });
        });
        testedMethods.push('assignRun');
    });

    describe('worldAdapter.autoAssignUsers', () => {
        const ASSIGNMENTS = [
            { userKey: 'user-key-1', role: 'leader' },
            { userKey: 'user-key-2' },
        ];

        it('Should do a POST to world/assignment', async() => {
            await worldAdapter.autoAssignUsers(ASSIGNMENTS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });

        it('Should have authorization', async() => {
            await worldAdapter.autoAssignUsers(ASSIGNMENTS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/assignment/{groupName} URL', async() => {
            await worldAdapter.autoAssignUsers(ASSIGNMENTS);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/assignment/${SESSION.groupName}`);
        });

        it('Should send the assignments in the request body', async() => {
            await worldAdapter.autoAssignUsers(ASSIGNMENTS);
            const req = fakeServer.requests.pop();
            JSON.parse(req.requestBody).should.have.property('assignments').that.deep.equals(ASSIGNMENTS);
        });

        it('Should send the world config in the request body', async() => {
            const optionals = {
                objective: 'MARGINAL',
                allowChannel: true,
                worldNameGenerator: { objectType: 'color-animal' },
            };
            await worldAdapter.autoAssignUsers(ASSIGNMENTS, optionals);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.allowChannel.should.equal(optionals.allowChannel);
            body.objective.should.equal(optionals.objective);
            body.worldNameGenerator.should.deep.equal(optionals.worldNameGenerator);
        });

        testedMethods.push('autoAssignUsers');
    });

    describe('worldAdapter.editAssignments', () => {
        const WORLD_KEY = 'world-key';
        const ASSIGNMENTS = {
            [WORLD_KEY]: [
                { userKey: 'user-key-1', role: 'leader' },
                { userKey: 'user-key-2' },
            ],
        };

        it('Should do a PUT to world/assignment', async() => {
            await worldAdapter.editAssignments(ASSIGNMENTS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PUT');
        });

        it('Should have authorization', async() => {
            await worldAdapter.editAssignments(ASSIGNMENTS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/assignment/{groupName} URL', async() => {
            await worldAdapter.editAssignments(ASSIGNMENTS);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/assignment/${SESSION.groupName}`);
        });

        it('Should send the assignments in the request body', async() => {
            await worldAdapter.editAssignments(ASSIGNMENTS);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.assignments.should.deep.equal(ASSIGNMENTS);
        });

        testedMethods.push('editAssignments');
    });


    describe('worldAdapter.getAssignments', () => {
        it('Should do a GET to world/assignment/for', async() => {
            await worldAdapter.getAssignments();
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });

        it('Should have authorization', async() => {
            await worldAdapter.getAssignments();
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/assignment/for/{groupName} URL', async() => {
            await worldAdapter.getAssignments();
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/assignment/for/${SESSION.groupName}`);
        });

        testedMethods.push('getAssignments');
    });

    describe('worldAdapter.getAssignmentsByKey', () => {
        const WORLD_KEY = 'world-key';

        it('Should do a GET to world/assignment/{worldKey}', async() => {
            await worldAdapter.getAssignmentsByKey(WORLD_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });

        it('Should have authorization', async() => {
            await worldAdapter.getAssignmentsByKey(WORLD_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/assignment/{worldKey} URL', async() => {
            await worldAdapter.getAssignmentsByKey(WORLD_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/assignment/${WORLD_KEY}`);
        });

        testedMethods.push('getAssignmentsByKey');
    });

    describe('worldAdapter.getSessionWorlds', () => {
        it('Should do a GET to world/assignment', async() => {
            await worldAdapter.getSessionWorlds();
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });

        it('Should have authorization', async() => {
            await worldAdapter.getSessionWorlds();
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/assignment URL', async() => {
            await worldAdapter.getSessionWorlds();
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/assignment`);
        });

        testedMethods.push('getSessionWorlds');
    });

    describe('worldAdapter.removeUsers', () => {
        const USER_KEYS = ['user-key-1', 'user-key-2'];

        it('Should do a DELETE to world/assignment', async() => {
            await worldAdapter.removeUsers(USER_KEYS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });

        it('Should have authorization', async() => {
            await worldAdapter.removeUsers(USER_KEYS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/assignment/{groupName} URL', async() => {
            const keepEmptyWorlds = true;
            await worldAdapter.removeUsers(USER_KEYS, { keepEmptyWorlds});
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/assignment/${SESSION.groupName}?userKey=${USER_KEYS[0]}&userKey=${USER_KEYS[1]}&keepEmptyWorlds=${keepEmptyWorlds}`);
        });

        testedMethods.push('removeUsers');
    });

    describe('worldAdapter.selfAssign', () => {
        it('Should do a POST to world/selfassign', async() => {
            await worldAdapter.selfAssign();
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });

        it('Should have authorization', async() => {
            await worldAdapter.selfAssign();
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });

        it('Should use the world/selfassign/{groupName} URL', async() => {
            await worldAdapter.selfAssign();
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/selfassign/${SESSION.groupName}`);
        });

        it('Should send the world config in the request body', async() => {
            const optionals = {
                allowChannel: true,
                role: 'leader',
                worldNameGenerator: { objectType: 'color-animal' },
            };
            await worldAdapter.selfAssign(optionals);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.allowChannel.should.equal(optionals.allowChannel);
            body.role.should.equal(optionals.role);
            body.worldNameGenerator.should.deep.equal(optionals.worldNameGenerator);
        });

        testedMethods.push('selfAssign');
    });

    it('Should not have any untested methods', () => {
        chai.expect(worldAdapter).to.have.all.keys(...testedMethods);
    });
});
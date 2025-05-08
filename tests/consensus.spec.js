import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './constants';
chai.use(require('sinon-chai'));


describe('Consensus APIs', () => {
    const { config, consensusAdapter, authAdapter, SCOPE_BOUNDARY, ROLE, RITUAL } = epicenter;
    let fakeServer;
    const testedMethods = [];

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondWith('POST', /(.*)\/consensus/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });

        fakeServer.respondWith('DELETE', /(.*)\/consensus/, (xhr, id) => {
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, 'true');
        });

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
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
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the consensus URL', async() => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/consensus/${worldKey}/${name}/${stage}`);
        });
        it('Should support generic URL options', async() => {
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/${worldKey}/${name}/${stage}`);
        });
        it('Should pass the consensus details to the request body', async() => {
            const optionals = {
                ttlSeconds: 60000,
                transparent: true,
                allowChannel: true,
            };
            await consensusAdapter.create(worldKey, name, stage, expectedRoles, defaultActions, optionals);

            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.have.property('ttlSeconds');
            body.ttlSeconds.should.equal(optionals.ttlSeconds);
            body.should.have.property('transparent');
            body.transparent.should.equal(optionals.transparent);
            body.should.have.property('actions');
            body.should.have.property('expectedRoles');
            body.allowChannel.should.equal(optionals.allowChannel);
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
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the consensus/actions URL', async() => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/consensus/publish/${worldKey}/${name}/${stage}`);
        });
        it('Should support generic URL options', async() => {
            await consensusAdapter.submitActions(worldKey, name, stage, actions, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/publish/${worldKey}/${name}/${stage}`);
        });
        it('Should pass the consensus details to the request body', async() => {
            const optionals = {
                ritual: 'REANIMATE',
            };
            await consensusAdapter.submitActions(worldKey, name, stage, actions, optionals);

            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.have.property('actions');
            body.should.have.property('ritual');
            body.ritual.should.equal(optionals.ritual);
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
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });
        it('Should have authorization', async() => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the consensus/actions URL', async() => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/consensus/expectation/${worldKey}/${name}/${stage}/${userKey}`);
        });
        it('Should support generic URL options', async() => {
            await consensusAdapter.undoSubmitFor(worldKey, name, stage, userKey, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/consensus/expectation/${worldKey}/${name}/${stage}/${userKey}`);
        });
        testedMethods.push('undoSubmitFor');
    });
});

import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './constants';
chai.use(require('sinon-chai'));


describe('Run APIs', () => {
    const { config, worldAdapter, authAdapter, SCOPE_BOUNDARY, ROLE, RITUAL } = epicenter;
    let fakeServer;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondWith('GET', /(.*)\/world/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'content-type': 'application/json' }, JSON.stringify(RESPONSE));
        });

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('worldAdapter.getPersonas', () => {
        const WORLD_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.WORLD, scopeKey: 123456789123456 };
        it('Should do a GET to persona', async() => {
            await worldAdapter.getPersonas(WORLD_SCOPE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await worldAdapter.getPersonas(WORLD_SCOPE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the world/persona/group URL', async() => {
            await worldAdapter.getPersonas(WORLD_SCOPE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/world/persona/group/${WORLD_SCOPE.scopeKey}`);
        });
    });

    //TODO: Need to define tests for the other worldAdapter functions
});

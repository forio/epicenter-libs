import sinon from 'sinon';
import chai from 'chai';
import { CREATED_CODE, SESSION, ACCOUNT, PROJECT, GENERIC_OPTIONS } from './constants';
chai.use(require('sinon-chai'));

describe('Authentication', () => {
    const { config, authAdapter } = epicenter;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    let fakeServer;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        fakeServer.respondWith('POST', /(.*)\/authentication/, (xhr, id) => {
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(SESSION));
        });
        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.logout();
    });

    describe('authAdapter.login', () => {
        const CREDENTIALS = { handle: 'joe', password: 'pass', groupKey: 'groupkey' };
        it('Should do a POST', async() => {
            await authAdapter.login(CREDENTIALS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should use the authentication URL', async() => {
            await authAdapter.login(CREDENTIALS);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/authentication`);
        });
        it('Should support generic URL options', async() => {
            await authAdapter.login(CREDENTIALS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/authentication`);
        });
        it('Should pass login credentials to the request body', async() => {
            await authAdapter.login(CREDENTIALS);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.include(CREDENTIALS);
        });
        it('Should store the payload as the current session', async() => {
            await authAdapter.login(CREDENTIALS);
            authAdapter.getLocalSession().should.deep.equal(SESSION);
        });
        it('Should set objectType as user when one is not provided', async() => {
            await authAdapter.login(CREDENTIALS);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.have.property('objectType', 'user');
        });
    });
    describe('authAdapter.logout', () => {
        it('Should not make a network request', async() => {
            fakeServer.requests = [];
            await authAdapter.logout();
            Boolean(authAdapter.getLocalSession()).should.equal(false);
            fakeServer.requests.should.be.empty;
        });
    });
});

import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './constants';
chai.use(require('sinon-chai'));

describe('Somebody APIs', () => {
    const { config, authAdapter, somebodyAdapter, SCOPE_BOUNDARY } = epicenter;
    let fakeServer;
    const testedMethods = [];

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: '123456789123456' };

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondWith('GET', /(.*)\/somebody/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('POST', /(.*)\/somebody/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('somebodyAdapter.create', () => {
        const email = 'test4@test.com';
        const optionals = {
            givenName: 'Test',
            familyName: 'Person4',
        };

        it('Should do a POST', async() => {
            await somebodyAdapter.create(email, GROUP_SCOPE, optionals);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.create(email, GROUP_SCOPE, optionals);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.create(email, GROUP_SCOPE, optionals);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody`);
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.create(email, GROUP_SCOPE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody`);
        });
        it('Should pass the arguments as part of the request body', async() => {
            await somebodyAdapter.create(email, GROUP_SCOPE, optionals);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.be.deep.equal({ email, scope: GROUP_SCOPE, ...optionals });
        });
        it('Should route specific and generic options correctly', async() => {
            await somebodyAdapter.create(email, GROUP_SCOPE, { ...optionals, ...GENERIC_OPTIONS });
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.be.deep.equal({ email, scope: GROUP_SCOPE, ...optionals });
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody`);
        });
        testedMethods.push('create');
    });
    describe('somebodyAdapter.get', () => {
        const somebodyKey = '123456789123456';
        it('Should do a GET', async() => {
            await somebodyAdapter.get(somebodyKey);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.get(somebodyKey);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.get(somebodyKey);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody/${somebodyKey}`);
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.get(somebodyKey, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/${somebodyKey}`);
        });
        testedMethods.push('get');
    });
    describe('somebodyAdapter.list', () => {
        it('Should do a GET', async() => {
            await somebodyAdapter.list(GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.list(GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.list(GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody/in/${GROUP_SCOPE.scopeBoundary}/${GROUP_SCOPE.scopeKey}`);
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.list(GROUP_SCOPE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/in/${GROUP_SCOPE.scopeBoundary}/${GROUP_SCOPE.scopeKey}`);
        });
        it('Should pass in query options as a part of the search parameters (query string)', async() => {
            await somebodyAdapter.list(GROUP_SCOPE, { first: 3, max: 10 });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('first').should.equal('3');
            searchParams.get('max').should.equal('10');
        });
        it('Should route specific and generic options correctly', async() => {
            await somebodyAdapter.list(GROUP_SCOPE, { first: 3, max: 10, ...GENERIC_OPTIONS });
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/in/${GROUP_SCOPE.scopeBoundary}/${GROUP_SCOPE.scopeKey}?first=3&max=10`);
        });
        testedMethods.push('list');
    });
    describe('somebodyAdapter.byEmail', () => {
        const email = 'somebody@forio.com';
        it('Should do a GET', async() => {
            await somebodyAdapter.byEmail(email, GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.byEmail(email, GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.byEmail(email, GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody/with/${GROUP_SCOPE.scopeBoundary}/${GROUP_SCOPE.scopeKey}/${email}`);
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.byEmail(email, GROUP_SCOPE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/with/${GROUP_SCOPE.scopeBoundary}/${GROUP_SCOPE.scopeKey}/${email}`);
        });
        testedMethods.push('byEmail');
    });

    it('Should not have any untested methods', () => {
        chai.expect(somebodyAdapter).to.have.all.keys(...testedMethods);
    });
});

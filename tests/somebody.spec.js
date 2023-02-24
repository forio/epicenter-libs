import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './constants';
chai.use(require('sinon-chai'));

describe('Somebody APIs', () => {
    const { config, authAdapter, somebodyAdapter } = epicenter;
    let fakeServer;
    const testedMethods = [];

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

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
            await somebodyAdapter.create(email, optionals);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.create(email, optionals);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.create(email, optionals);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody`);
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.create(email, { optionals, ...GENERIC_OPTIONS });
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody`);
        });
        it('Should pass the arguments as part of the request body', async() => {
            await somebodyAdapter.create(email, optionals);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.be.deep.equal({email, ...optionals});
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
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.query(OPTIONS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.query(OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody/search`);
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.query(OPTIONS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/search`);
        });
        it('Should pass in query options as a part of the search parameters (query string)', async() => {
            await somebodyAdapter.query(OPTIONS);
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('filter').should.equal(OPTIONS.filter.join(';'));
            searchParams.get('sort').should.equal(OPTIONS.sort.join(';'));
            searchParams.get('first').should.equal(OPTIONS.first.toString());
            searchParams.get('max').should.equal(OPTIONS.max.toString());
            searchParams.get('count').should.equal(OPTIONS.count.toString());
        });
        testedMethods.push('query');

    });
    
    it('Should not have any untested methods', () => {
        chai.expect(somebodyAdapter).to.have.all.keys(...testedMethods);
    });
});

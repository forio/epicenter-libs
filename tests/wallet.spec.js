import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './constants';
chai.use(require('sinon-chai'));


describe('Wallet APIs', () => {
    const { config, walletAdapter, authAdapter, SCOPE_BOUNDARY } = epicenter;
    let fakeServer;
    const testedMethods = [];

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondWith('GET', /(.*)\/wallet/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('POST', /(.*)\/wallet/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('walletAdapter.update', () => {
        const userKey = 'USER_KEY';
        const scopeBoundary = SCOPE_BOUNDARY.PROJECT;
        const scopeKey = 'PROJECT_KEY';

        const scope = {
            userKey, scopeKey, scopeBoundary,
        };
        const items = [
            { label: 'item1', value: 'value1' },
            { label: 'item2', value: 'value2' },
            { label: 'item3', value: 'value3' },
        ];

        it('Should do a POST', async() => {
            await walletAdapter.update(scope, items);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await walletAdapter.update(scope, items);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the wallet URL', async() => {
            await walletAdapter.update(scope, items);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/wallet`);
        });
        it('Should support generic URL options', async() => {
            await walletAdapter.update(scope, items, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/wallet`);
        });
        it('Should pass the wallet details to the request body', async() => {
            await walletAdapter.update(scope, items);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.have.property('items');
            body.should.have.property('scope');
        });
        testedMethods.push('update');
    });
    describe('walletAdapter.get', () => {
        const userKey = 'USER_KEY';
        const scopeBoundary = SCOPE_BOUNDARY.PROJECT;
        const scopeKey = 'PROJECT_KEY';

        const scope = {
            userKey, scopeKey, scopeBoundary,
        };

        it('Should do a GET', async() => {
            await walletAdapter.get(scope);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await walletAdapter.get(scope);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the wallet URL', async() => {
            await walletAdapter.get(scope);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/wallet/${scopeBoundary}/${scopeKey}/${userKey}`);
        });
        it('Should support generic URL options', async() => {
            await walletAdapter.get(scope, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/wallet/${scopeBoundary}/${scopeKey}/${userKey}`);
        });
        testedMethods.push('get');
    });
    describe('walletAdapter.withScope', () => {
        const userKey = 'USER_KEY';
        const scopeBoundary = SCOPE_BOUNDARY.PROJECT;
        const scopeKey = 'PROJECT_KEY';

        const scope = {
            userKey, scopeKey, scopeBoundary,
        };

        const optionals = {
            first: 20,
            max: 10,
        };

        it('Should do a GET', async() => {
            await walletAdapter.withScope(scope);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await walletAdapter.withScope(scope);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the wallet URL', async() => {
            await walletAdapter.withScope(scope, optionals);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/wallet/with/${scopeBoundary}/${scopeKey}?first=${optionals.first}&max=${optionals.max}`);
        });
        it('Should support generic URL options', async() => {
            const options = { ...GENERIC_OPTIONS, ...optionals };
            await walletAdapter.withScope(scope, options);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/wallet/with/${scopeBoundary}/${scopeKey}?first=${optionals.first}&max=${optionals.max}`);
        });
        testedMethods.push('withScope');
    });

    it('Should not have any untested methods', () => {
        chai.expect(walletAdapter).to.have.all.keys(...testedMethods);
    });
});

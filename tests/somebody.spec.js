import sinon from 'sinon';
import chai from 'chai';
import {
    ACCOUNT,
    PROJECT,
    SESSION,
    OK_CODE,
    CREATED_CODE,
    GENERIC_OPTIONS,
} from './constants';
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
            const RESPONSE = {
                /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */
            };
            xhr.respond(
                OK_CODE,
                { 'Content-Type': 'application/json' },
                JSON.stringify(RESPONSE)
            );
        });
        fakeServer.respondWith('POST', /(.*)\/somebody/, function(xhr, id) {
            const RESPONSE = {
                /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */
            };
            xhr.respond(
                CREATED_CODE,
                { 'Content-Type': 'application/json' },
                JSON.stringify(RESPONSE)
            );
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
        const scope = {
            scopeBoundary: 'group',
            scopeKey: 'test-group',
        };

        it('Should do a POST', async() => {
            await somebodyAdapter.create(email, scope, optionals);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.create(email, scope, optionals);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property(
                'authorization',
                `Bearer ${SESSION.token}`
            );
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.create(email, scope, optionals);
            const req = fakeServer.requests.pop();
            req.url.should.equal(
                `https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody`
            );
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.create(email, scope, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } =
                GENERIC_OPTIONS;
            req.url.should.equal(
                `${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody`
            );
        });
        it('Should pass the arguments as part of the request body', async() => {
            await somebodyAdapter.create(email, scope, optionals);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.be.deep.equal({ email, scope, ...optionals });
        });
        testedMethods.push('create');
    });
    describe('somebodyAdapter.get', () => {
        const somebodyKey = 'user-12345';

        it('Should do a GET', async() => {
            await somebodyAdapter.get(somebodyKey);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.get(somebodyKey);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property(
                'authorization',
                `Bearer ${SESSION.token}`
            );
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.get(somebodyKey);
            const req = fakeServer.requests.pop();
            req.url.should.equal(
                `https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody/${somebodyKey}`
            );
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.get(somebodyKey, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } =
                GENERIC_OPTIONS;
            req.url.should.equal(
                `${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/${somebodyKey}`
            );
        });
        testedMethods.push('get');
    });

    describe('somebodyAdapter.byEmail', () => {
        const email = 'test4@test.com';
        const optionals = {
            givenName: 'Test',
            familyName: 'Person4',
        };
        const scope = {
            scopeBoundary: 'group',
            scopeKey: 'test-group',
        };

        it('Should do a GET', async() => {
            await somebodyAdapter.byEmail(email, scope, optionals);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.byEmail(email, scope, optionals);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property(
                'authorization',
                `Bearer ${SESSION.token}`
            );
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.byEmail(email, scope, optionals);
            const req = fakeServer.requests.pop();
            req.url.should.equal(
                `https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody/with/${scope.scopeBoundary}/${scope.scopeKey}/${email}`
            );
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.byEmail(email, scope, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } =
                GENERIC_OPTIONS;
            req.url.should.equal(
                `${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/with/${scope.scopeBoundary}/${scope.scopeKey}/${email}`
            );
        });
        testedMethods.push('byEmail');
    });

    describe('somebodyAdapter.inScope', () => {
        const optionals = {
            first: 0,
            max: 10,
        };
        const scope = {
            scopeBoundary: 'group',
            scopeKey: 'test-group',
        };

        it('Should do a GET', async() => {
            await somebodyAdapter.inScope(scope, optionals);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await somebodyAdapter.inScope(scope, optionals);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property(
                'authorization',
                `Bearer ${SESSION.token}`
            );
        });
        it('Should use the somebody URL', async() => {
            await somebodyAdapter.inScope(scope, optionals);
            const req = fakeServer.requests.pop();
            req.url.should.equal(
                `https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/somebody/in/${scope.scopeBoundary}/${scope.scopeKey}?first=${optionals.first}&max=${optionals.max}`
            );
        });
        it('Should support generic URL options', async() => {
            await somebodyAdapter.inScope(scope, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } =
                GENERIC_OPTIONS;
            req.url.should.equal(
                `${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/somebody/in/${scope.scopeBoundary}/${scope.scopeKey}`
            );
        });
        testedMethods.push('inScope');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(somebodyAdapter).filter(
            (key) => typeof somebodyAdapter[key] === 'function'
        );
        chai.expect(actualMethods).to.have.members(testedMethods);
    });
});

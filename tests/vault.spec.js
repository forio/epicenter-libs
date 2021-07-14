import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './common';
chai.use(require('sinon-chai'));

describe('Vault API Service', () => {
    const { config, vaultAdapter, authAdapter, ROLE, SCOPE_BOUNDARY } = epicenter;
    let fakeServer;
    const testedMethods = [];

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondWith('DELETE', /(.*)\/vault/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('GET', /(.*)\/vault/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('POST', /(.*)\/vault/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('PATCH', /(.*)\/vault/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('vaultAdapter.update', () => {
        const VAULT_KEY = 'MOCK_VAULT_KEY';
        const UPDATE = {
            set: { foo: 'bar' },
            push: {},
        };
        it('Should do a PATCH', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        });
        it('Should have authorization', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the vault/vaultKey URL', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/vault/${VAULT_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/${VAULT_KEY}`);
        });
        it('Should send the update in the request body', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.deep.equal(UPDATE);
        });
        testedMethods.push('update');
    });
    describe('vaultAdapter.get', () => {
        const VAULT_KEY = 'MOCK_VAULT_KEY';
        it('Should do a GET', async() => {
            await vaultAdapter.get(VAULT_KEY, );
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await vaultAdapter.get(VAULT_KEY, );
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the vault/vaultKey URL', async() => {
            await vaultAdapter.get(VAULT_KEY, );
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/vault/${VAULT_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await vaultAdapter.get(VAULT_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/${VAULT_KEY}`);
        });
        testedMethods.push('get');
    });
    describe('vaultAdapter.getWithScope', () => {
        const NAME = 'myvaultname';
        const USER_KEY = 'myuserkey';
        const SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };
        it('Should do a GET', async() => {
            await vaultAdapter.getWithScope(NAME, SCOPE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await vaultAdapter.getWithScope(NAME, SCOPE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the vault/with/scopeBoundary/scopeKey/name URL', async() => {
            await vaultAdapter.getWithScope(NAME, SCOPE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/vault/with/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${NAME}`);
        });
        it('Should use insert userKey into URL when provided', async() => {
            await vaultAdapter.getWithScope(NAME, SCOPE, { userKey: USER_KEY });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/vault/with/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${USER_KEY}/${NAME}`);
        });
        it('Should support generic URL options', async() => {
            await vaultAdapter.getWithScope(NAME, SCOPE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/with/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${NAME}`);
        });
        testedMethods.push('getWithScope');
    });
    describe('vaultAdapter.byName', () => {
        const NAME = 'myvaultname';
        it('Should do a GET', async() => {
            await vaultAdapter.byName(NAME);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await vaultAdapter.byName(NAME);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the vault/in/groupName[/episodeName]/name URL', async() => {
            const EPISODE_NAME = 'myepisodename';
            await vaultAdapter.byName(NAME);
            const req1 = fakeServer.requests.pop();
            req1.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/vault/in/${SESSION.groupName}/${NAME}`);
            await vaultAdapter.byName(NAME, { episodeName: EPISODE_NAME });
            const req2 = fakeServer.requests.pop();
            req2.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/vault/in/${SESSION.groupName}/${EPISODE_NAME}/${NAME}`);
        });
        it('Should use a custom group name in the URL if provided', async() => {
            const GROUP_NAME = 'mygroupname';
            await vaultAdapter.byName(NAME, { groupName: GROUP_NAME });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/vault/in/${GROUP_NAME}/${NAME}`);
        });
        it('Should pass the userKey to the search params if provided', async() => {
            const USER_KEY = 'myuserkey'
            await vaultAdapter.byName(NAME, { userKey: USER_KEY });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('userKey').should.equal(USER_KEY);
        });
        it('Should support generic URL options', async() => {
            await vaultAdapter.byName(NAME, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/in/${SESSION.groupName}/${NAME}`);
        });
        testedMethods.push('byName');
    });
    describe('vaultAdapter.remove', () => {
        const VAULT_KEY = 'myvaultkey';
        it('Should do a DELETE', async() => {
            await vaultAdapter.remove(VAULT_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });
        it('Should have authorization', async() => {
            await vaultAdapter.remove(VAULT_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the vault/vaultKey URL', async() => {
            await vaultAdapter.remove(VAULT_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/vault/${VAULT_KEY}`);
        });
        it('Should pass the mutationKey to the search params if provided', async() => {
            const MUTATION_KEY = 'mymutationkey';
            await vaultAdapter.remove(VAULT_KEY, { mutationKey: MUTATION_KEY });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('MutationKey').should.equal(MUTATION_KEY);
        });
        it('Should support generic URL options', async() => {
            await vaultAdapter.remove(VAULT_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/${VAULT_KEY}`);
        });
        testedMethods.push('remove');
    });
    describe('vaultAdapter.create', () => {
        const NAME = 'myvaultname'
        const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };
        const WORLD_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.WORLD, scopeKey: 123456789123456 };
        const ITEMS = { set: { foo: 'bar' } };
        it('Should do a POST', async() => {
            await vaultAdapter.create(NAME, GROUP_SCOPE, ITEMS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await vaultAdapter.create(NAME, GROUP_SCOPE, ITEMS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the vault URL', async() => {
            await vaultAdapter.create(NAME, GROUP_SCOPE, ITEMS);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/vault/${NAME}`);
        });
        it('Should support generic URL options', async() => {
            await vaultAdapter.create(NAME, GROUP_SCOPE, ITEMS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/${NAME}`);
        });
        it('Should pass the scope and items to the body', async() => {
            await vaultAdapter.create(NAME, GROUP_SCOPE, ITEMS);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.items.should.be.deep.equal(ITEMS);
            body.scope.should.be.deep.equal(GROUP_SCOPE);
        });
        it('Should default the readLock to ‘participant’ when provided world scope', async() => {
            await vaultAdapter.create(NAME, WORLD_SCOPE, ITEMS);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.permit.readLock.should.equal(ROLE.PARTICIPANT);
        });
        it('Should use readLock and writeLock when explicitly provided', async() => {
            await vaultAdapter.create(NAME, WORLD_SCOPE, ITEMS, { readLock: ROLE.ANONYMOUS, writeLock: ROLE.ANONYMOUS });
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.permit.readLock.should.equal(ROLE.ANONYMOUS);
            body.permit.writeLock.should.equal(ROLE.ANONYMOUS);
        });
        it('Should use accept userKey, ttlSeconds, and mutationKey provided', async() => {
            const USER_KEY = 'myuserkey';
            const TTL_SECONDS = 20;
            const MUTATION_KEY = 'mymutationkey';
            const RANDOM_THING = { something: 'random' };
            await vaultAdapter.create(NAME, WORLD_SCOPE, ITEMS, {
                userKey: USER_KEY,
                ttlSeconds: TTL_SECONDS,
                mutationKey: MUTATION_KEY,
                ...RANDOM_THING,
            });
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.scope.userKey.should.equal(USER_KEY);
            body.ttlSeconds.should.equal(TTL_SECONDS);
            body.mutationKey.should.equal(MUTATION_KEY);
            body.should.not.include(RANDOM_THING);
        });
        testedMethods.push('create');
    });

    it('Should not have any untested methods', () => {
        vaultAdapter.should.have.all.keys(...testedMethods);
    });
});

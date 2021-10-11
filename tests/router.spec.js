import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, UNAUTHORIZED_CODE } from './common';
chai.use(require('sinon-chai'));

describe('Router (Fetch/Request Wrapper)', () => {
    const { config, Router, authAdapter, errorManager } = epicenter;
    let fakeServer;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();

        /* Mock general calls */
        fakeServer.respondWith('DELETE', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'content-type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('GET', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('POST', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('PATCH', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('PUT', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        /* Mock paginated calls */
        fakeServer.respondWith('GET', /(.*)\/pagination\?(.*)first=0/, function(xhr, id) {
            const RESPONSE = {
                firstResult: 0,
                maxResults: 3,
                totalResults: 10,
                values: ['one', 'two', 'three'],
            };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('GET', /(.*)\/pagination\?(.*)first=3/, function(xhr, id) {
            const RESPONSE = {
                firstResult: 3,
                maxResults: 3,
                totalResults: 10,
                values: ['four', 'five', 'six'],
            };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('GET', /(.*)\/pagination\?(.*)first=6/, function(xhr, id) {
            const RESPONSE = {
                firstResult: 6,
                maxResults: 3,
                totalResults: 10,
                values: ['seven', 'eight', 'nine'],
            };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('GET', /(.*)\/pagination\?(.*)first=9/, function(xhr, id) {
            const RESPONSE = {
                firstResult: 9,
                maxResults: 3,
                totalResults: 10,
                values: ['ten'],
            };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        /* Mock erroneous calls */
        fakeServer.respondWith('GET', /(.*)\/unauthorized/, function(xhr, id) {
            /* Authentication invalidated assumes a session currently exists, it's just invalidated, setting one here */
            authAdapter.setLocalSession(SESSION);
            /* Provide call for invalidated authentication to trigger error handler upgrade */
            const RESPONSE = { information: { code: 'AUTHENTICATION_INVALIDATED' } };
            xhr.respond(UNAUTHORIZED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('PATCH', /(.*)\/authentication/, function(xhr, id) {
            /* Upgrade should return new session -- in this case use SSO login method b/c
             * the subsequent retry will always fail and login via SSO doesn't refresh the page (bad for tests) */
            const RESPONSE = { loginMethod: { objectType: 'sso' } };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();

        /* Since this test file messes w/ configuration, we should reset
         * it back to the appropriate values for other the .spec.js files */
        config.loadBrowser();
        config.accountShortName = ACCOUNT;
        config.projectShortName = PROJECT;
        config.authOverride = undefined;
    });

    let router;
    beforeEach(() => {
        router = new Router();
    });
    afterEach(() => {
        authAdapter.setLocalSession(undefined);
    });
    describe('Configuration', () => {
        it('Should start with URI components all undefined', () => {
            (typeof router.server).should.equal('undefined');
            (typeof router.accountShortName).should.equal('undefined');
            (typeof router.projectShortName).should.equal('undefined');
            (typeof router.version).should.equal('undefined');
        });
        it('Should use the configuration values when no URI components are set', async() => {
            await router.get('/run');
            const req = fakeServer.requests.pop();
            const { apiProtocol, apiHost, apiVersion, accountShortName, projectShortName } = config;
            req.url.should.equal(`${apiProtocol}://${apiHost}/api/v${apiVersion}/${accountShortName}/${projectShortName}/run`);
        });
        it('Should also use configuration values retroactively', async() => {
            config.apiProtocol = 'http';
            config.apiHost = 'mydomain.com';
            config.accountShortName = 'something';
            config.projectShortName = 'else';

            await router.get('/run');
            const req1 = fakeServer.requests.pop();
            req1.url.should.equal('http://mydomain.com/api/v3/something/else/run');

            config.loadBrowser();
            config.accountShortName = ACCOUNT;
            config.projectShortName = PROJECT;

            await router.get('/run');
            const req2 = fakeServer.requests.pop();
            req2.url.should.equal(`https://forio.com/api/v3/${ACCOUNT}/${PROJECT}/run`);
        });
        it('Should ignore configuration values when URI components are provided directly to the router', async() => {
            router.server = 'https://mydomain.com';
            router.accountShortName = 'anything';
            router.projectShortName = 'else';

            config.accountShortName = ACCOUNT;
            config.projectShortName = PROJECT;

            await router.get('/run');
            const req = fakeServer.requests.pop();
            req.url.should.equal('https://mydomain.com/api/v3/anything/else/run');
        });
    });
    describe('Network Calls', () => {
        it('Should make a GET call when calling \'get\'', async() => {
            await router.get('/run');
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should make a POST call when calling \'post\'', async() => {
            await router.post('/run');
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should make a DELETE call when calling \'delete\'', async() => {
            await router.delete('/run');
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });
        it('Should make a PATCH call when calling \'patch\'', async() => {
            await router.patch('/run');
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        });
        it('Should make a PUT call when calling \'put\'', async() => {
            await router.put('/run');
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PUT');
        });
    });
    describe('Search Parameters', () => {
        it('Should accept URLSearchParams', async() => {
            router.searchParams = new URLSearchParams('?foo=foo&bar=bar');
            await router.get('/run');
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            search.should.equal('foo=foo&bar=bar');
        });
        it('Should accept strings for search parameters', async() => {
            router.searchParams = '?foo=foo&bar=bar';
            await router.get('/run');
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            search.should.equal('foo=foo&bar=bar');
        });
        it('Should accept arrayed tuples', async() => {
            router.searchParams = [['foo', 'foo'], ['bar', 'bar']];
            await router.get('/run');
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            search.should.equal('foo=foo&bar=bar');
        });
        it('Should accept objects', async() => {
            router.searchParams = { foo: 'foo', bar: 'bar' };
            await router.get('/run');
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            search.should.equal('foo=foo&bar=bar');
        });
        it('Should accept objects with arrayed values', async() => {
            router.searchParams = { foo: 'foo', bar: ['bar', 'baz'] };
            await router.get('/run');
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            search.should.equal('foo=foo&bar=bar&bar=baz');
        });
    });
    describe('\'with\' Functions', () => {
        it('Should have \'with\' functions for server, account, project, and search params', () => {
            (typeof router.withServer).should.equal('function');
            (typeof router.withAccountShortName).should.equal('function');
            (typeof router.withProjectShortName).should.equal('function');
            (typeof router.withSearchParams).should.equal('function');
        });
        it('Should return the router instance', () => {
            router.withServer().should.equal(router);
            router.withAccountShortName().should.equal(router);
            router.withProjectShortName().should.equal(router);
            router.withSearchParams().should.equal(router);
        });
        it('Should set any values that are not undefined', async() => {
            router.accountShortName = 'something';
            router.projectShortName = 'else';
            router.withAccountShortName(undefined);
            router.withProjectShortName('');
            router.accountShortName.should.equal('something');
            router.projectShortName.should.equal('');

            await router.get('/run');
            const req = fakeServer.requests.pop();
            req.url.should.equal('https://forio.com/api/v3/something//run');
        });
    });
    describe('Authorization', () => {
        it('Should use a \'Authorization\' header by default if a session exists', async() => {
            await router.get('/run');
            const req1 = fakeServer.requests.pop();
            req1.requestHeaders.should.not.have.property('authorization');
            authAdapter.setLocalSession(SESSION);
            await router.get('/run');
            const req2 = fakeServer.requests.pop();
            req2.requestHeaders.should.have.property('authorization');
        });
        it('Should use the auth token in the session', async() => {
            authAdapter.setLocalSession(SESSION);
            await router.get('/run');
            const req = fakeServer.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        });
        it('Should support overrides from the config', async() => {
            config.authOverride = 'bananas';
            await router.get('/run');
            const req = fakeServer.requests.pop();
            req.requestHeaders.authorization.should.equal('bananas');
        });
        it('Should support includeAuthorization: false', async() => {
            await router.get('/run', { includeAuthorization: false });
            const req = fakeServer.requests.pop();
            (typeof req.requestHeaders.authorization).should.equal('undefined');
        });
    });
    describe('Pagination', () => {
        it('Should return payloads with \'prev\', \'next\', and \'all\' functions', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            (typeof page.prev).should.equal('function');
            (typeof page.next).should.equal('function');
            (typeof page.all).should.equal('function');
        });
        it('Should return contain the values for the first page in .values', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            page.values.should.be.deep.equal(['one', 'two', 'three']);
        });
        it('Should return the next page when calling .next', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            const nextValues = await page.next();
            nextValues.should.be.deep.equal(['four', 'five', 'six']);
            page.values.should.be.deep.equal(['four', 'five', 'six']);
        });
        it('Should return the previous page when calling .prev', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            await page.next();
            await page.next();
            const prevValues = await page.prev();
            prevValues.should.be.deep.equal(['four', 'five', 'six']);
            page.values.should.be.deep.equal(['four', 'five', 'six']);
        });
        it('Should return all values when calling .all (regardless of what page you\'re currently on)', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            await page.next();
            const allValues = await page.all();
            allValues.should.be.deep.equal([
                'one', 'two', 'three',
                'four', 'five', 'six',
                'seven', 'eight', 'nine',
                'ten',
            ]);
        });
        it('Should return all values after an index, if one is provided in .all', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            const allValues = await page.all(3);
            allValues.should.be.deep.equal([
                'four', 'five', 'six',
                'seven', 'eight', 'nine',
                'ten',
            ]);
        });
        it('Should append to an array if one is provided', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            const allValues = await page.all(3, ['foo', 'bar', 'baz']);
            allValues.should.be.deep.equal([
                'foo', 'bar', 'baz',
                'four', 'five', 'six',
                'seven', 'eight', 'nine',
                'ten',
            ]);
        });
    });
    describe('Inert Requests', () => {
        it('Should call the errorManager to handle non-inert requests', async() => {
            const handleSpy = sinon.spy(errorManager, 'handle');
            try {
                await router.get('/unauthorized', { inert: true });
            } catch (error) {
                /* Do nothing, it should error here */
            }
            handleSpy.called.should.equal(false);

            try {
                await router.get('/unauthorized');
            } catch (error) {
                /* Do nothing, it should error here */
            }
            handleSpy.called.should.equal(true);
            errorManager.handle.restore();
        });
    });
});

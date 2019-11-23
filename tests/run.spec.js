const { authentication, config, run, utility } = epicenter;
import sinon from 'sinon';
import chai, { expect, assert } from 'chai';
chai.use(require('sinon-chai'));

const OK_CODE = 200;
const CREATED_CODE = 201;

const endpoints = { account: 'forio-dev', project: 'epi-v3' };

describe('Run API Service', () => {
    let server;
    let token;

    config.accountShortName = endpoints.account;
    config.projectShortName = endpoints.project;
    before(() => {
        token = 'tHDEVEueL7tuC8LYRj4lhWhYe3GDreWPzGx';
        server = sinon.fakeServer.create();
        server.respondWith(/(.*)\/config/, (xhr, id) => {
            xhr.respond(
                OK_CODE, { 'content-type': 'application/json' }, JSON.stringify({ api: { host: 'test.forio.com', protocol: 'https' }, clusterId: 'epicenter-test-monolith-1' })
            );
        });
        server.respondWith('DELETE', /(.*)\/run/, function(xhr, id) {
            xhr.respond(
                OK_CODE, { 'content-type': 'application/json' }, JSON.stringify({ api: { host: 'test.forio.com', protocol: 'https' }, clusterId: 'epicenter-test-monolith-1' })
            );
        });
        server.respondWith('GET', /(.*)\/run/, function(xhr, id) {
            const resp = {
                id: '065dfe50-d29d-4b55-a0fd-30868d7dd26c',
                model: 'model.vmf',
                account: 'mit',
                project: 'afv',
                saved: false,
                lastModified: '2014-06-20T04:09:45.738Z',
                created: '2014-06-20T04:09:45.738Z',
            };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(resp));
        });
        server.respondWith('POST', /(.*)\/run/, function(xhr, id) {
            const resp = {
                id: '065dfe50-d29d-4b55-a0fd-30868d7dd26c',
                model: 'model.vmf',
                account: 'mit',
                project: 'afv',
                saved: false,
                lastModified: '2014-06-20T04:09:45.738Z',
                created: '2014-06-20T04:09:45.738Z',
            };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(resp));
        });
        server.respondWith('PATCH', /(.*)\/run/, function(xhr, id) {
            const resp = {
                id: '065dfe50-d29d-4b55-a0fd-30868d7dd26c',
                model: 'model.vmf',
                account: 'mit',
                project: 'afv',
                saved: false,
                lastModified: '2014-06-20T04:09:45.738Z',
                created: '2014-06-20T04:09:45.738Z',
            };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(resp));
        });

        server.respondImmediately = true;
    });

    after(() => {
        server.restore();
        token = null;
    });

    describe('Create', () => {
        const testOptions = {
            scopeBoundary: 'WORLD',
            scopeKey: 123456789123456,
            trackingKey: 'tracking-key-123456',
            model: 'model.vmf',
            readLock: 'AUTHOR',
            writeLock: 'AUTHOR',
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
        };
        it('should Do a POST', async() => {
            await run.create(testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('POST');
                });
        });
        it('should create a proper URL', async() => {
            await run.create(testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run`);
                });
        });
        it('should pass the run options to the request body', async() => {
            await run.create(testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const reqBody = JSON.parse(req.requestBody);
                    (reqBody.scope.scopeBoundary).should.equal(testOptions.scopeBoundary);
                    (reqBody.scope.scopeKey).should.equal(testOptions.scopeKey);
                    (reqBody.permit.readLock).should.equal(testOptions.readLock);
                    (reqBody.permit.writeLock).should.equal(testOptions.writeLock);
                    (reqBody.trackingKey).should.equal(testOptions.trackingKey);
                    (reqBody.modelFile).should.equal(testOptions.model);
                });
        });
    });
    describe('Clone', () => {
        const testOptions = {
            trackingKey: 'tracking-key-123456',
            model: 'model.vmf',
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
        };
        const testRunKey = 123456789;
        it('should Do a POST', async() => {
            await run.clone(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('POST');
                });
        });
        it('should create a proper URL', async() => {
            await run.clone(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/clone/${testRunKey}`);
                });
        });
        it('should pass the options to the request body', async() => {
            await run.clone(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const reqBody = JSON.parse(req.requestBody);
                    (reqBody.trackingKey).should.equal(testOptions.trackingKey);
                    (reqBody.modelFile).should.equal(testOptions.model);
                });
        });
    });
    describe('Restore', () => {
        const testOptions = {
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
        };
        const testRunKey = 123456789;
        it('should Do a POST', async() => {
            await run.restore(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('POST');
                });
        });
        it('should create a proper URL', async() => {
            await run.restore(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/restore/${testRunKey}`);
                });
        });
    });
    describe('Rewind', () => {
        const testOptions = {
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
        };
        const testRunKey = 123456789;
        it('should Do a POST', async() => {
            await run.rewind(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('POST');
                });
        });
        it('should create a proper URL', async() => {
            await run.rewind(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/rewind/${testRunKey}`);
                });
        });
    });
    describe('Update', () => {
        const testOptions = {
            trackingKey: 'tracking-key-123456',
            readLock: 'AUTHOR',
            writeLock: 'AUTHOR',
            marked: true,
            hidden: true,
            closed: false,
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
        };
        const testRunKey = 123456789;
        it('should Do a PATCH', async() => {
            await run.update(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('PATCH');
                });
        });
        it('should create a proper URL', async() => {
            await run.update(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/${testRunKey}`);
                });
        });
        it('should pass the options to the request body', async() => {
            await run.update(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const reqBody = JSON.parse(req.requestBody);
                    (reqBody.readLock).should.equal(testOptions.readLock);
                    (reqBody.writeLock).should.equal(testOptions.writeLock);
                    (reqBody.trackingKey).should.equal(testOptions.trackingKey);
                    (reqBody.marked).should.equal(testOptions.marked);
                    (reqBody.hidden).should.equal(testOptions.hidden);
                    (reqBody.closed).should.equal(testOptions.closed);
                });
        });
    });
    describe('Remove', () => {
        const testOptions = {
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
        };
        const testRunKey = 123456789;
        it('should Do a DELETE', async() => {
            await run.remove(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('DELETE');
                });
        });
        it('should create a proper URL', async() => {
            await run.remove(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/${testRunKey}`);
                });
        });
    });
    describe('Get', () => {
        const testOptions = {
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
        };
        const testRunKey = 123456789;
        it('should Do a GET', async() => {
            await run.get(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('GET');
                });
        });
        it('should create a proper URL', async() => {
            await run.get(testRunKey, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/${testRunKey}`);
                });
        });
    });
    describe('Query', () => {
        const testOptions = {
            scopeBoundary: 'PROJECT',
            scopeKey: 123456789,
            model: 'model.vmf',
            filter: 'vartest=23;trackingKey=1234;hidden=true',
            sort: 'created',
            first: 20,
            max: 15,
            timeout: 20,
            projections: 'vartest=23;trackingKey=1234;hidden=true',
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
        };
        it('should Do a GET', async() => {
            await run.query(testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('GET');
                });
        });
        it('should create a proper URL', async() => {
            await run.query(testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const expectedQueryString = utility.toQueryString({
                        filter: testOptions.filter,
                        sort: testOptions.sort,
                        first: testOptions.first,
                        max: testOptions.max,
                        timeout: testOptions.timeout,
                        projections: testOptions.projections,
                    });
                    assert.isTrue(req.url.indexOf(expectedQueryString) > -1);
                    assert.isTrue(req.url.indexOf(`${testOptions.scopeBoundary}/${testOptions.scopeKey}/${testOptions.model}`) > -1);
                });
        });
    });

    //TODO: Continue with introspect
});

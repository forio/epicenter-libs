const { authentication, config, run } = epicenter;
import sinon from 'sinon';
import chai, { expect } from 'chai';
chai.use(require('sinon-chai'));

const OK_CODE = 200;
const CREATED_CODE = 201;

const endpoints = { account: 'forio-dev', project: 'epi-v3' };

describe('Run API Service', () => {
    let server;
    let token;

    // before(() => {
    //     token = 'tHDEVEueL7tuC8LYRj4lhWhYe3GDreWPzGx';
    //     server = sinon.fakeServer.create();
    //     server.respondWith(/(.*)\/config/, (xhr, id) => {
    //         xhr.respond(
    //             OK_CODE, { 'content-type': 'application/json' }, JSON.stringify({ api: { host: 'test.forio.com', protocol: 'https' }, clusterId: 'epicenter-test-monolith-1' })
    //         );
    //     });
    //
    //     server.respondWith('GET', /(.*)\/run\/forio\/(.*)/, function(xhr, id) {
    //         xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify({ url: xhr.url }));
    //     });
    //
    //     server.respondWith('POST', /(.*)\/run\/(.*)/, function(xhr, id) {
    //         const resp = {
    //             id: '065dfe50-d29d-4b55-a0fd-30868d7dd26c',
    //             model: 'model.vmf',
    //             account: 'mit',
    //             project: 'afv',
    //             saved: false,
    //             lastModified: '2014-06-20T04:09:45.738Z',
    //             created: '2014-06-20T04:09:45.738Z',
    //         };
    //         xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(resp));
    //     });
    //
    //     server.respondWith(/(.*)\/run\/failure\/(.*)/, function(xhr, id) {
    //         xhr.respond(400, { 'Content-Type': 'application/json' }, JSON.stringify({ url: xhr.url }));
    //     });
    //
    //     server.respondImmediately = true;
    //
    //     config.accountShortName = endpoints.account;
    //     config.projectShortName = endpoints.project;
    // });
    before(() => {
        token = 'tHDEVEueL7tuC8LYRj4lhWhYe3GDreWPzGx';
        server = sinon.fakeServer.create();
        server.respondWith(/(.*)\/config/, (xhr, id) => {
            xhr.respond(
                OK_CODE, { 'content-type': 'application/json' }, JSON.stringify({ api: { host: 'test.forio.com', protocol: 'https' }, clusterId: 'epicenter-test-monolith-1' })
            );
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
        server.respondImmediately = true;
    });

    after(() => {
        server.restore();
        token = null;
    });

    describe('Create', () => {
        config.accountShortName = endpoints.account;
        config.projectShortName = endpoints.project;
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
});

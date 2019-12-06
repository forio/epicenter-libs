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
        const testRunKey = '123456789';
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
        const testRunKey = '123456789';
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
        const testRunKey = '123456789';
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
        const testRunKey = '123456789';
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
        const testRunKey = '123456789';
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
        const testRunKey = '123456789';
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
            scopeKey: '123456789',
            model: 'model.vmf',
            filter: 'vartest=23;trackingKey=1234;hidden=true',
            sort: 'created',
            first: '20',
            max: '15',
            timeout: '20',
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
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);
                    const paramKeys = ['filter', 'sort', 'first', 'max', 'timeout', 'projections'];

                    paramKeys.forEach((key) => urlParams.get(key).should.equal(testOptions[key]));
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/${testOptions.scopeBoundary}/${testOptions.scopeKey}/${testOptions.model}`) === 0);
                });
        });
    });
    describe('Introspect', () => {
        const testOptions = {
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
        };
        const testModel = 'test-model.py';
        it('should Do a GET', async() => {
            await run.introspect(testModel, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('GET');
                });
        });
        it('should create a proper URL', async() => {
            await run.introspect(testModel, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/introspect/${testModel}`);
                });
        });
    });
    describe('Operation', () => {
        const testOptions = {
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
            timeout: '12345',
            ritual: 'REANIMATE',
        };
        const testRunKey = '123456789';
        const testName = 'test-operation';
        const testArgs = ['arg1', 'arg2', 'arg3'];
        it('should Do a GET', async() => {
            await run.operation(testRunKey, testName, testArgs, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('POST');
                });
        });
        it('should create a proper URL with one runKey', async() => {
            await run.operation(testRunKey, testName, testArgs, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    urlParams.get('ritual').should.equal(testOptions.ritual);
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/operation/${testRunKey}`) > -1);
                });
        });
        it('should create a proper URL with multiple runKeys', async() => {
            const key1 = '123456789';
            const key2 = '987654321';
            const testRunKeyArr = [key1, key2];
            await run.operation(testRunKeyArr, testName, testArgs, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.getAll('runKey')[0].should.equal(testRunKeyArr[0]);
                    urlParams.getAll('runKey')[1].should.equal(testRunKeyArr[1]);
                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/operation`) === 0);
                });
        });
    });
    describe('Get Variables', () => {
        const testOptions = {
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
            timeout: '12345',
            ritual: 'REANIMATE',
        };
        const testRunKey = '123456789';
        const testVars = ['var1', 'var2', 'var3'];
        it('should Do a GET', async() => {
            await run.getVariables(testRunKey, testVars, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('GET');
                });
        });
        it('should create a proper URL; single runKey', async() => {
            await run.getVariables(testRunKey, testVars, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    urlParams.get('ritual').should.equal(testOptions.ritual);
                    urlParams.get('include').should.equal(testVars.join(';'));
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/variable/${testRunKey}`) === 0);
                });
        });
        it('should create a proper URL; multiple runKeys', async() => {
            const key1 = '123456789';
            const key2 = '987654321';
            const testRunKeyArr = [key1, key2];
            await run.getVariables(testRunKeyArr, testVars, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.getAll('runKey')[0].should.equal(testRunKeyArr[0]);
                    urlParams.getAll('runKey')[1].should.equal(testRunKeyArr[1]);
                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    urlParams.get('include').should.equal(testVars.join(';'));
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/variable`) === 0);
                });
        });
    });
    describe('Get Variable', () => {
        const testOptions = {
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
            timeout: '12345',
            ritual: 'REANIMATE',
        };
        const testRunKey = '123456789';
        const testVar = 'var1';
        it('should Do a GET', async() => {
            await run.getVariable(testRunKey, testVar, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('GET');
                });
        });
        it('should create a proper URL; single runKey', async() => {
            await run.getVariable(testRunKey, testVar, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    urlParams.get('ritual').should.equal(testOptions.ritual);
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/variable/${testRunKey}/${testVar}`) === 0);
                });
        });
        it('should create a proper URL; multiple runKeys, single variable', async() => {
            const key1 = '123456789';
            const key2 = '987654321';
            const testRunKeyArr = [key1, key2];
            await run.getVariable(testRunKeyArr, testVar, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.getAll('runKey')[0].should.equal(testRunKeyArr[0]);
                    urlParams.getAll('runKey')[1].should.equal(testRunKeyArr[1]);
                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    urlParams.get('include').should.equal(testVar);
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/variable`) === 0);
                });
        });
        it('should create a proper URL; single runKey, multiple variables', async() => {
            const testVars = ['var1', 'var2', 'var3'];
            await run.getVariable(testRunKey, testVars, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.get('ritual').should.equal(testOptions.ritual);
                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    urlParams.get('include').should.equal(testVars.join(';'));
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/variable`) === 0);
                });
        });
        it('should create a proper URL; multiple runKeys, multiple variables', async() => {
            const key1 = '123456789';
            const key2 = '987654321';
            const testRunKeyArr = [key1, key2];
            const testVars = ['var1', 'var2', 'var3'];
            await run.getVariable(testRunKeyArr, testVars, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.getAll('runKey')[0].should.equal(testRunKeyArr[0]);
                    urlParams.getAll('runKey')[1].should.equal(testRunKeyArr[1]);
                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    urlParams.get('include').should.equal(testVars.join(';'));
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/variable`) === 0);
                });
        });
    });
    describe('Update Variable', () => {
        const testOptions = {
            accountShortName: endpoints.account,
            projectShortName: endpoints.project,
            timeout: '12345',
            ritual: 'REANIMATE',
        };
        const testUpdate = {
            'varname#selector@dialect': 123456,
            'varname2#selector2@dialect2': 654987,
            'varname3#selector3@dialect3': 987654,
        };
        const testRunKey = '123456789';
        it('should Do a PATCH', async() => {
            await run.updateVariables(testRunKey, testUpdate, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('PATCH');
                });
        });
        it('should create a proper URL; single runKey', async() => {
            await run.updateVariables(testRunKey, testUpdate, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    urlParams.get('ritual').should.equal(testOptions.ritual);

                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/variable/${testRunKey}`) === 0);
                });
        });
        it('should create a proper URL; multiple runKeys', async() => {
            const key1 = '123456789';
            const key2 = '987654321';
            const testRunKeyArr = [key1, key2];
            await run.updateVariables(testRunKeyArr, testUpdate, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const urlParams = new URLSearchParams(req.url.split('?')[1]);

                    urlParams.getAll('runKey')[0].should.equal(testRunKeyArr[0]);
                    urlParams.getAll('runKey')[1].should.equal(testRunKeyArr[1]);
                    urlParams.get('timeout').should.equal(testOptions.timeout);
                    assert.isTrue(req.url.indexOf(`https://${config.localConfigHost}/v${config.apiVersion}/${testOptions.accountShortName}/${testOptions.projectShortName}/run/variable`) === 0);
                });
        });
        it('should pass the Body appropriately', async() => {
            await run.updateVariables(testRunKey, testUpdate, testOptions)
                .then((res) => {
                    const req = server.requests.pop();
                    const reqBody = JSON.parse(req.requestBody);

                    Object.keys(testUpdate).forEach((key) => reqBody[key].should.equal(testUpdate[key]));
                });
        });
    });
});

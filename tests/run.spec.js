import sinon from 'sinon';
import chai, { expect } from 'chai';
import { ENDPOINTS, SESSION_KEY, SESSION, OK_CODE, CREATED_CODE } from './common';
chai.use(require('sinon-chai'));

describe('Run API Service', () => {
    const { config, runAdapter, authAdapter, SCOPE_BOUNDARY, ROLE, RITUAL } = epicenter;
    let server;

    config.accountShortName = ENDPOINTS.accountShortName;
    config.projectShortName = ENDPOINTS.projectShortName;
    before(() => {
        server = sinon.fakeServer.create();
        document.cookies = `${SESSION_KEY}=${JSON.stringify(encodeURIComponent(SESSION))}`;
        server.respondWith(/(.*)\/config/, (xhr, id) => {
            const RESPONSE = {
                api: { host: 'test.forio.com', protocol: 'https' },
                clusterId: 'epicenter-test-monolith-1',
            };
            xhr.respond(OK_CODE, { 'content-type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        server.respondWith('DELETE', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = {
                api: { host: 'test.forio.com', protocol: 'https' },
                clusterId: 'epicenter-test-monolith-1',
            };
            xhr.respond(OK_CODE, { 'content-type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        server.respondWith('GET', /(.*)\/run/, function(xhr, id) {
            // Some mutant response
            const RESPONSE = {
                // getting a run
                id: '065dfe50-d29d-4b55-a0fd-30868d7dd26c',
                model: 'model.vmf',
                account: 'mit',
                project: 'afv',
                saved: false,
                lastModified: '2014-06-20T04:09:45.738Z',
                created: '2014-06-20T04:09:45.738Z',
                // getting many runs
                values: [],
            };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        server.respondWith('POST', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = {
                id: '065dfe50-d29d-4b55-a0fd-30868d7dd26c',
                model: 'model.vmf',
                account: 'mit',
                project: 'afv',
                saved: false,
                lastModified: '2014-06-20T04:09:45.738Z',
                created: '2014-06-20T04:09:45.738Z',
            };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        server.respondWith('PATCH', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = {
                id: '065dfe50-d29d-4b55-a0fd-30868d7dd26c',
                model: 'model.vmf',
                account: 'mit',
                project: 'afv',
                saved: false,
                lastModified: '2014-06-20T04:09:45.738Z',
                created: '2014-06-20T04:09:45.738Z',
            };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });

        server.respondImmediately = true;
    });

    after(() => {
        server.restore();
        document.cookie = `${SESSION_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });

    describe('Create', () => {
        const MODEL = 'model.vmf';
        const WORLD_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.WORLD, scopeKey: 123456789123456 };
        const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };
        const OPTIONALS = {
            trackingKey: 'tracking-key-123456',
            readLock: ROLE.AUTHOR,
            writeLock: ROLE.AUTHOR,
            accountShortName: 'some-account',
            projectShortName: 'some-project',
        };
        it('Should do a POST', async() => await runAdapter.create(MODEL, WORLD_SCOPE).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        }));
        it('Should have authorization', async() => await runAdapter.create(MODEL, WORLD_SCOPE).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL', async() => await runAdapter.create(MODEL, WORLD_SCOPE).then(() => {
            const req = server.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run`);
        }));
        it('Should have authorization', async() => await runAdapter.create(MODEL, WORLD_SCOPE).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should pass the run options to the request', async() => await runAdapter.create(MODEL, WORLD_SCOPE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            expect(reqBody.scope).to.exist;
            expect(reqBody.scope.scopeBoundary).to.equal(WORLD_SCOPE.scopeBoundary);
            expect(reqBody.scope.scopeKey).to.equal(WORLD_SCOPE.scopeKey);
            expect(reqBody.permit).to.exist;
            expect(reqBody.permit.readLock).to.equal(OPTIONALS.readLock);
            expect(reqBody.permit.writeLock).to.equal(OPTIONALS.writeLock);
            expect(reqBody.trackingKey).to.equal(OPTIONALS.trackingKey);
            expect(reqBody.modelFile).to.equal(MODEL);
            expect(reqBody.morphology).to.equal('MANY');
            expect(reqBody.ephemeral).to.equal(OPTIONALS.ephemeral);
            expect(reqBody.modelContext).to.be.an('object').that.is.empty;
            expect(reqBody.executionContext).to.be.an('object').that.is.empty;

            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${OPTIONALS.accountShortName}/${OPTIONALS.projectShortName}/run`);
        }));
        it('Should use PARTICIPANT when a lock is undefined with a WORLD scope', async() => await runAdapter.create(MODEL, WORLD_SCOPE).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            expect(reqBody.permit.readLock).to.equal(ROLE.PARTICIPANT);
        }));
        it('Should not provide a userKey with a WORLD scope', async() => await runAdapter.create(MODEL, WORLD_SCOPE).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            expect(reqBody.scope.userKey).to.not.exist;
        }));
        it('Should use USER when a lock is undefined with GROUP scope', async() => await runAdapter.create(MODEL, GROUP_SCOPE).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            expect(reqBody.permit.readLock).to.equal(ROLE.USER);
        }));
        it('Should use the session\'s userKey as an userKey when not provided one for GROUP scope ', async() => await runAdapter.create(MODEL, GROUP_SCOPE).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            expect(reqBody.scope.userKey).to.equal(authAdapter.getLocalSession().userKey);
        }));
    });
    describe('Clone', () => {
        const OPTIONALS = { trackingKey: 'tracking-key-123456' };
        const RUN_KEY = '123456789';
        it('Should do a POST', async() => await runAdapter.clone(RUN_KEY, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        }));
        it('Should have authorization', async() => await runAdapter.clone(RUN_KEY, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL', async() => await runAdapter.clone(RUN_KEY, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/clone/${RUN_KEY}`);
        }));
        it('Should pass the options to the request body', async() => await runAdapter.clone(RUN_KEY, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            (reqBody.trackingKey).should.equal(OPTIONALS.trackingKey);
        }));
    });
    describe('Restore', () => {
        const RUN_KEY = '123456789';
        it('Should do a POST', async() => await runAdapter.restore(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        }));
        it('Should have authorization', async() => await runAdapter.restore(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL', async() => await runAdapter.restore(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/restore/${RUN_KEY}`);
        }));
    });
    describe('Rewind', () => {
        const RUN_KEY = '123456789';
        it('Should do a POST', async() => await runAdapter.rewind(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        }));
        it('Should have authorization', async() => await runAdapter.rewind(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL', async() => await runAdapter.rewind(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/rewind/${RUN_KEY}`);
        }));
    });
    describe('Update', () => {
        const UPDATE = {
            trackingKey: 'tracking-key-123456',
            readLock: 'AUTHOR',
            writeLock: 'AUTHOR',
            marked: true,
            hidden: true,
            closed: false,
        };
        const RUN_KEY = '123456789';
        it('Should do a PATCH', async() => await runAdapter.update(RUN_KEY, UPDATE).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        }));
        it('Should have authorization', async() => await runAdapter.update(RUN_KEY, UPDATE).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL', async() => await runAdapter.update(RUN_KEY, UPDATE).then(() => {
            const req = server.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/${RUN_KEY}`);
        }));
        it('Should pass the options to the request body', async() => await runAdapter.update(RUN_KEY, UPDATE).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            expect(reqBody.readLock).to.equal(UPDATE.readLock);
            expect(reqBody.writeLock).to.equal(UPDATE.writeLock);
            expect(reqBody.trackingKey).to.equal(UPDATE.trackingKey);
            expect(reqBody.marked).to.equal(UPDATE.marked);
            expect(reqBody.hidden).to.equal(UPDATE.hidden);
            expect(reqBody.closed).to.equal(UPDATE.closed);
        }));
        it('Should properly omit options that aren\'t passed in', async() => await runAdapter.update(RUN_KEY, { marked: true }).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            expect(reqBody.marked).to.equal(true);
            expect(reqBody).to.not.have.any.keys('readLock', 'writeLock', 'trackingKey', 'hidden', 'closed');
        }));
    });
    describe('Remove', () => {
        const RUN_KEY = '123456789';
        it('Should do a DELETE', async() => await runAdapter.remove(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        }));
        it('Should have authorization', async() => await runAdapter.remove(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL', async() => await runAdapter.remove(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/${RUN_KEY}`);
        }));
    });
    describe('Get', () => {
        const RUN_KEY = '123456789';
        it('Should do a GET', async() => await runAdapter.get(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        }));
        it('Should have authorization', async() => await runAdapter.get(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL', async() => await runAdapter.get(RUN_KEY).then(() => {
            const req = server.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/${RUN_KEY}`);
        }));
    });
    describe('Query', () => {
        const MODEL = 'model.vmf';
        const SCOPE = {
            scopeBoundary: 'PROJECT',
            scopeKey: '123456789',
        };
        const OPTIONALS = {
            filter: ['var.vartest=23', 'var.trackingKey=1234', 'var.something#else@here'],
            sort: ['-run.created', '+run.trackingKey'],
            first: '20',
            max: '15',
            timeout: '20',
            metadata: ['includedvar1', 'inludedvar2'],
        };
        it('Should do a GET', async() => await runAdapter.query(MODEL, SCOPE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        }));
        it('Should have authorization', async() => await runAdapter.query(MODEL, SCOPE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL', async() => await runAdapter.query(MODEL, SCOPE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${MODEL}`);
            const searchParams = new URLSearchParams(search);
            searchParams.get('filter').split(';').forEach((f) => expect(f).to.satisfy((f) => f.startsWith('var.') || f.startsWith('meta.')));
            searchParams.get('meta').split(';').forEach((p, i) => expect(p).to.equal(OPTIONALS.metadata[i]));
            searchParams.get('sort').split(';').forEach((s) => expect(decodeURIComponent(s)).to.satisfy((s) => s.startsWith('-') || s.startsWith('+')));
            searchParams.get('sort').split(';').forEach((s) => expect(decodeURIComponent(s)).to.satisfy((s) => s.includes('run.')));
            expect(searchParams.get('first')).to.equal(OPTIONALS.first);
            expect(searchParams.get('max')).to.equal(OPTIONALS.max);
            expect(searchParams.get('timeout')).to.equal(OPTIONALS.timeout);
        }));
    });
    describe('Introspect', () => {
        const MODEL = 'test-model.py';
        it('Should do a GET', async() => await runAdapter.introspect(MODEL).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        }));
        it('Should have authorization', async() => await runAdapter.introspect(MODEL).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL', async() => await runAdapter.introspect(MODEL).then(() => {
            const req = server.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/introspect/${MODEL}`);
        }));
    });
    describe('Operation', () => {
        const OPTIONALS = {
            timeout: '12345',
            ritual: RITUAL.REANIMATE,
        };
        const RUN_KEY = '123456789';
        const RUN_KEYS = ['123456789', '987654321'];
        const NAME = 'test-operation';
        const ARGUMENTS = ['arg1', 'arg2', 'arg3'];

        it('Should do a GET', async() => await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        }));
        it('Should have authorization', async() => await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL with one runKey', async() => await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/operation/${RUN_KEY}`);
            const searchParams = new URLSearchParams(search);
            searchParams.get('timeout').should.equal(OPTIONALS.timeout);
            searchParams.get('ritual').should.equal(OPTIONALS.ritual);
        }));
        it('Should create a proper URL with multiple runKeys', async() => await runAdapter.operation(RUN_KEYS, NAME, ARGUMENTS, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/operation`);
            const searchParams = new URLSearchParams(search);

            RUN_KEYS.forEach((key) => expect(searchParams.getAll('runKey')).to.include(key));
            expect(searchParams.get('timeout')).to.equal(OPTIONALS.timeout);
            expect(searchParams.get('ritual')).to.be.null;
        }));
    });
    describe('Get Variables', () => {
        const OPTIONALS = {
            timeout: '12345',
            ritual: RITUAL.REANIMATE,
        };
        const RUN_KEY = '123456789';
        const RUN_KEYS = ['123456789', '987654321'];
        const VARIABLES = ['var1', 'var2', 'var3'];
        it('Should do a GET', async() => await runAdapter.getVariables(RUN_KEY, VARIABLES, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        }));
        it('Should have authorization', async() => await runAdapter.getVariables(RUN_KEY, VARIABLES, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL; single runKey', async() => await runAdapter.getVariables(RUN_KEY, VARIABLES, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/variable/${RUN_KEY}`);
            const searchParams = new URLSearchParams(search);

            searchParams.get('timeout').should.equal(OPTIONALS.timeout);
            searchParams.get('ritual').should.equal(OPTIONALS.ritual);
            searchParams.get('include').should.equal(VARIABLES.join(';'));
        }));
        it('Should create a proper URL; multiple runKeys', async() => await runAdapter.getVariables(RUN_KEYS, VARIABLES, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/variable`);
            const searchParams = new URLSearchParams(search);

            RUN_KEYS.forEach((key) => expect(searchParams.getAll('runKey')).to.include(key));
            expect(searchParams.get('include')).to.equal(VARIABLES.join(';'));
            expect(searchParams.get('timeout')).to.equal(OPTIONALS.timeout);
            expect(searchParams.get('ritual')).to.be.null;
        }));
    });
    describe('Get Variable', () => {
        const OPTIONALS = {
            timeout: '12345',
            ritual: RITUAL.REANIMATE,
        };
        const RUN_KEY = '123456789';
        const RUN_KEYS = ['123456789', '987654321'];
        const VARIABLE = 'var1';
        const VARIABLES = ['var1', 'var2', 'var3'];
        it('Should do a GET', async() => await runAdapter.getVariable(RUN_KEY, VARIABLE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        }));
        it('Should have authorization', async() => await runAdapter.getVariable(RUN_KEY, VARIABLE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL; single runKey', async() => await runAdapter.getVariable(RUN_KEY, VARIABLE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/variable/${RUN_KEY}/${VARIABLE}`);
            const searchParams = new URLSearchParams(search);

            searchParams.get('timeout').should.equal(OPTIONALS.timeout);
            searchParams.get('ritual').should.equal(OPTIONALS.ritual);
        }));
        it('Should create a proper URL; multiple runKeys, single variable', async() => await runAdapter.getVariable(RUN_KEYS, VARIABLE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/variable`);
            const searchParams = new URLSearchParams(search);

            RUN_KEYS.forEach((key) => expect(searchParams.getAll('runKey')).to.include(key));
            expect(searchParams.get('include')).to.equal(VARIABLE);
            expect(searchParams.get('timeout')).to.equal(OPTIONALS.timeout);
            expect(searchParams.get('ritual')).to.be.null;
        }));
        it('Should create a proper URL; single runKey, multiple variables', async() => await runAdapter.getVariable(RUN_KEY, VARIABLES, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/variable/${RUN_KEY}`);
            const searchParams = new URLSearchParams(search);

            searchParams.get('timeout').should.equal(OPTIONALS.timeout);
            searchParams.get('ritual').should.equal(OPTIONALS.ritual);
            searchParams.get('include').should.equal(VARIABLES.join(';'));
        }));
        it('Should create a proper URL; multiple runKeys, multiple variables', async() => await runAdapter.getVariable(RUN_KEYS, VARIABLES, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/variable`);
            const searchParams = new URLSearchParams(search);

            RUN_KEYS.forEach((key) => expect(searchParams.getAll('runKey')).to.include(key));
            expect(searchParams.get('include')).to.equal(VARIABLES.join(';'));
            expect(searchParams.get('timeout')).to.equal(OPTIONALS.timeout);
            expect(searchParams.get('ritual')).to.be.null;
        }));
    });
    describe('Update Variable', () => {
        const OPTIONALS = {
            timeout: '12345',
            ritual: RITUAL.REANIMATE,
        };
        const UPDATE = {
            'varname#selector@dialect': 123456,
            'varname2#selector2@dialect2': 654987,
            'varname3#selector3@dialect3': 987654,
        };
        const RUN_KEY = '123456789';
        const RUN_KEYS = ['123456789', '987654321'];
        it('Should do a PATCH', async() => await runAdapter.updateVariables(RUN_KEY, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        }));
        it('Should have authorization', async() => await runAdapter.updateVariables(RUN_KEY, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL; single RUN_KEY', async() => await runAdapter.updateVariables(RUN_KEY, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/variable/${RUN_KEY}`);
            const searchParams = new URLSearchParams(search);

            searchParams.get('timeout').should.equal(OPTIONALS.timeout);
            searchParams.get('ritual').should.equal(OPTIONALS.ritual);
        }));
        it('Should create a proper URL; multiple RUN_KEYs', async() => await runAdapter.updateVariables(RUN_KEYS, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/variable`);
            const searchParams = new URLSearchParams(search);

            RUN_KEYS.forEach((key) => expect(searchParams.getAll('runKey')).to.include(key));
            expect(searchParams.get('timeout')).to.equal(OPTIONALS.timeout);
            expect(searchParams.get('ritual')).to.be.null;
        }));
        it('Should pass the Body appropriately', async() => await runAdapter.updateVariables(RUN_KEY, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            Object.keys(UPDATE).forEach((key) => reqBody[key].should.equal(UPDATE[key]));
        }));
    });
    describe('Get Metadata', () => {
        const OPTIONALS = {
            timeout: '12345',
            ritual: RITUAL.REANIMATE,
        };
        const RUN_KEY = '123456789';
        const RUN_KEYS = ['123456789', '987654321'];
        const METADATA = ['var1', 'var2', 'var3'];
        it('Should do a GET', async() => await runAdapter.getMetadata(RUN_KEY, METADATA, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        }));
        it('Should have authorization', async() => await runAdapter.getMetadata(RUN_KEY, METADATA, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL; single runKey', async() => await runAdapter.getMetadata(RUN_KEY, METADATA, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/meta/${RUN_KEY}`);
            const searchParams = new URLSearchParams(search);

            searchParams.get('timeout').should.equal(OPTIONALS.timeout);
            searchParams.get('ritual').should.equal(OPTIONALS.ritual);
        }));
        it('Should create a proper URL; multiple runKeys', async() => await runAdapter.getMetadata(RUN_KEYS, METADATA, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/meta`);
            const searchParams = new URLSearchParams(search);

            RUN_KEYS.forEach((key) => expect(searchParams.getAll('runKey')).to.include(key));
            expect(searchParams.get('include')).to.equal(METADATA.join(';'));
            expect(searchParams.get('timeout')).to.equal(OPTIONALS.timeout);
            expect(searchParams.get('ritual')).to.be.null;
        }));
    });
    describe('Update Metadata', () => {
        const OPTIONALS = {

            timeout: '12345',
            ritual: RITUAL.REANIMATE,
        };
        const RUN_KEY = '123456789';
        const RUN_KEYS = ['123456789', '987654321'];
        const UPDATE = {
            'varname#selector@dialect': 123456,
            'varname2#selector2@dialect2': 654987,
            'varname3#selector3@dialect3': 987654,
        };
        it('Should do a PATCH', async() => await runAdapter.updateMetadata(RUN_KEY, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        }));
        it('Should have authorization', async() => await runAdapter.updateMetadata(RUN_KEY, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL; single runKey', async() => await runAdapter.updateMetadata(RUN_KEY, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/meta/${RUN_KEY}`);
            const searchParams = new URLSearchParams(search);

            searchParams.get('timeout').should.equal(OPTIONALS.timeout);
            searchParams.get('ritual').should.equal(OPTIONALS.ritual);
        }));
        it('Should create a proper URL; multiple runKeys', async() => await runAdapter.updateMetadata(RUN_KEYS, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/meta`);
            const searchParams = new URLSearchParams(search);

            RUN_KEYS.forEach((key) => expect(searchParams.getAll('runKey')).to.include(key));
            expect(searchParams.get('timeout')).to.equal(OPTIONALS.timeout);
            expect(searchParams.get('ritual')).to.be.null;
        }));
        it('Should pass the Body appropriately', async() => await runAdapter.updateMetadata(RUN_KEY, UPDATE, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);
            Object.keys(UPDATE).forEach((key) => reqBody[key].should.equal(UPDATE[key]));
        }));
    });
    describe('Action', () => {
        const OPTIONALS = {
            timeout: '12345',
            ritual: RITUAL.REANIMATE,
        };
        const RUN_KEY = '123456789';
        const RUN_KEYS = ['123456789', '987654321'];
        const ACTIONS = [
            { objectType: 'GET', val1: 'example1'},
            { objectType: 'SET', val1: 'example1'},
            { objectType: 'PROC', val1: 'example1'},
        ];
        it('Should do a POST', async() => await runAdapter.action(RUN_KEY, ACTIONS, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        }));
        it('Should have authorization', async() => await runAdapter.action(RUN_KEY, ACTIONS, OPTIONALS).then(() => {
            const req = server.requests.pop();
            req.requestHeaders.authorization.should.equal(`Bearer ${SESSION.token}`);
        }));
        it('Should create a proper URL; single runKey', async() => await runAdapter.action(RUN_KEY, ACTIONS, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/action/${RUN_KEY}`);
            const searchParams = new URLSearchParams(search);

            searchParams.get('timeout').should.equal(OPTIONALS.timeout);
            searchParams.get('ritual').should.equal(OPTIONALS.ritual);
        }));
        it('Should create a proper URL; multiple runKeys', async() => await runAdapter.action(RUN_KEYS, ACTIONS, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ENDPOINTS.accountShortName}/${ENDPOINTS.projectShortName}/run/action`);
            const searchParams = new URLSearchParams(search);

            RUN_KEYS.forEach((key) => expect(searchParams.getAll('runKey')).to.include(key));
            expect(searchParams.get('timeout')).to.equal(OPTIONALS.timeout);
            expect(searchParams.get('ritual')).to.be.null;
        }));
        it('Should pass the body appropriately', async() => await runAdapter.action(RUN_KEY, ACTIONS, OPTIONALS).then(() => {
            const req = server.requests.pop();
            const reqBody = JSON.parse(req.requestBody);

            ACTIONS.forEach((action, idx) => Object.keys(action).forEach((key) => reqBody[idx][key].should.equal(action[key])));
        }));
    });
});

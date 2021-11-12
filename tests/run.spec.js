import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './common';
chai.use(require('sinon-chai'));


describe('Run API Service', () => {
    const { config, runAdapter, authAdapter, SCOPE_BOUNDARY, ROLE, RITUAL } = epicenter;
    let fakeServer;
    const testedMethods = [];

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondWith('DELETE', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'content-type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('GET', /(.*)\/run/, function(xhr, id) {
            const RESPONSE = { values: [/* Need values here to account for built-in pagination */] };
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

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('runAdapter.create', () => {
        const MODEL = 'model.vmf';
        const WORLD_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.WORLD, scopeKey: 123456789123456 };
        const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };
        it('Should do a POST', async() => {
            await runAdapter.create(MODEL, WORLD_SCOPE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await runAdapter.create(MODEL, WORLD_SCOPE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run URL', async() => {
            await runAdapter.create(MODEL, WORLD_SCOPE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.create(MODEL, WORLD_SCOPE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run`);
        });
        it('Should pass the run to the request body', async() => {
            await runAdapter.create(MODEL, WORLD_SCOPE, {
                readLock: ROLE.AUTHOR,
                writeLock: ROLE.AUTHOR,
                userKey: 'userkey',
                ephemeral: true,
                trackingKey: 'trackingkey',
            });
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.have.property('scope');
            body.scope.scopeBoundary.should.equal(WORLD_SCOPE.scopeBoundary);
            body.scope.scopeKey.should.equal(WORLD_SCOPE.scopeKey);
            body.should.have.property('permit');
            body.permit.readLock.should.equal(ROLE.AUTHOR);
            body.permit.writeLock.should.equal(ROLE.AUTHOR);
            body.trackingKey.should.equal('trackingkey');
            body.modelFile.should.equal(MODEL);
            body.morphology.should.equal('MANY');
            body.ephemeral.should.equal(true);
            body.modelContext.should.be.an('object').that.is.empty;
            body.executionContext.should.be.an('object').that.is.empty;
        });
        it('Should have read lock default to participant when using world scope', async() => {
            await runAdapter.create(MODEL, WORLD_SCOPE);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.permit.readLock.should.equal(ROLE.PARTICIPANT);
        });
        it('Should not provide a userKey with a world scope', async() => {
            await runAdapter.create(MODEL, WORLD_SCOPE);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.scope.should.not.have.property('userKey');
        });
        it('Should use a user read lock when creating with a group scope', async() => {
            await runAdapter.create(MODEL, GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.permit.readLock.should.equal(ROLE.USER);
        });
        it('Should use the session\'s user key as when one is not provided one for group scope ', async() => {
            await runAdapter.create(MODEL, GROUP_SCOPE);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.scope.userKey.should.equal(authAdapter.getLocalSession().userKey);
        });
        testedMethods.push('create');
    });
    describe('runAdapter.clone', () => {
        const RUN_KEY = 'runkey';
        it('Should do a POST', async() => {
            await runAdapter.clone(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await runAdapter.clone(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/clone/runKey URL', async() => {
            await runAdapter.clone(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/clone/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.clone(RUN_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/clone/${RUN_KEY}`);
        });
        it('Should pass the appropriate options to the request body', async() => {
            await runAdapter.clone(RUN_KEY, {
                trackingKey: 'trackingkey',
                ephemeral: true,
            });
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.trackingKey.should.equal('trackingkey');
            body.ephemeral.should.equal(true);
            body.modelContext.should.be.an('object').that.is.empty;
            body.executionContext.should.be.an('object').that.is.empty;
        });
        testedMethods.push('clone');
    });
    describe('runAdapter.restore', () => {
        const RUN_KEY = 'runkey';
        it('Should do a POST', async() => {
            await runAdapter.restore(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await runAdapter.restore(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/restore/runKey URL', async() => {
            await runAdapter.restore(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/restore/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.restore(RUN_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/restore/${RUN_KEY}`);
        });
        it('Should pass the appropriate options to the request body', async() => {
            await runAdapter.restore(RUN_KEY, { ephemeral: true });
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.ephemeral.should.equal(true);
            body.modelContext.should.be.an('object').that.is.empty;
            body.executionContext.should.be.an('object').that.is.empty;
        });
        testedMethods.push('restore');
    });
    describe('runAdapter.rewind', () => {
        const RUN_KEY = 'runkey';
        const STEPS = 2;
        it('Should do a POST', async() => {
            await runAdapter.rewind(RUN_KEY, STEPS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await runAdapter.rewind(RUN_KEY, STEPS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/rewind/runKey URL', async() => {
            await runAdapter.rewind(RUN_KEY, STEPS);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/rewind/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.rewind(RUN_KEY, STEPS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/rewind/${RUN_KEY}`);
        });
        it('Should pass the appropriate options to the request body', async() => {
            await runAdapter.rewind(RUN_KEY, STEPS, { ephemeral: true });
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.rewindCount.should.equal(STEPS);
            body.ephemeral.should.equal(true);
            body.modelContext.should.be.an('object').that.is.empty;
        });
        testedMethods.push('rewind');
    });
    describe('runAdapter.update', () => {
        const UPDATE = {
            trackingKey: 'trackingkey',
            readLock: ROLE.AUTHOR,
            writeLock: ROLE.AUTHOR,
            marked: true,
            hidden: true,
            closed: false,
        };
        const PARSED_UPDATE = {
            trackingKey: 'trackingkey',
            permit: {
                readLock: ROLE.AUTHOR,
                writeLock: ROLE.AUTHOR,
            },
            marked: true,
            hidden: true,
            closed: false,
        };
        const RUN_KEY = 'runkey';
        it('Should do a PATCH', async() => {
            await runAdapter.update(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        });
        it('Should have authorization', async() => {
            await runAdapter.update(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/runKey URL', async() => {
            await runAdapter.update(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.update(RUN_KEY, UPDATE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/${RUN_KEY}`);
        });
        it('Should pass the update to the request body in the appropriate format', async() => {
            await runAdapter.update(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.deep.equal(PARSED_UPDATE);
        });
        it('Should properly omit options that aren\'t passed in', async() => {
            await runAdapter.update(RUN_KEY, { marked: true });
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.marked.should.equal(true);
            body.should.not.have.any.keys('permit', 'trackingKey', 'hidden', 'closed');
        });
        testedMethods.push('update');
    });
    describe('runAdapter.remove', () => {
        const RUN_KEY = 'runkey';
        it('Should do a DELETE', async() => {
            await runAdapter.remove(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });
        it('Should have authorization', async() => {
            await runAdapter.remove(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/runKey URL', async() => {
            await runAdapter.remove(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.remove(RUN_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/${RUN_KEY}`);
        });
        testedMethods.push('remove');
    });
    describe('runAdapter.get', () => {
        const RUN_KEY = 'runkey';
        it('Should do a GET', async() => {
            await runAdapter.get(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await runAdapter.get(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/runKey URL', async() => {
            await runAdapter.get(RUN_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.get(RUN_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/${RUN_KEY}`);
        });
        testedMethods.push('get');
    });
    describe('runAdapter.query', () => {
        const MODEL = 'model.vmf';
        const SCOPE = {
            scopeBoundary: 'PROJECT',
            scopeKey: '123456789',
        };
        const OPTIONS = {
            filter: ['var.vartest=23', 'var.trackingKey=1234', 'var.something#else@here'],
            sort: ['-run.created', '+run.trackingKey'],
            first: 20,
            max: 15,
            timeout: 20,
            variables: ['includedvar1', 'inludedvar2'],
            metadata: ['meta1', 'meta2'],
        };
        it('Should do a GET', async() => {
            await runAdapter.query(MODEL, OPTIONS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await runAdapter.query(MODEL, OPTIONS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/in/groupName[/episodeName]/modelFile URL', async() => {
            const EPISODE_NAME = 'myepisodename';
            await runAdapter.query(MODEL, OPTIONS);
            const req1 = fakeServer.requests.pop();
            req1.url.should.include(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/in/${SESSION.groupName}/${MODEL}`);
            await runAdapter.query(MODEL, { episodeName: EPISODE_NAME });
            const req2 = fakeServer.requests.pop();
            req2.url.should.include(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/in/${SESSION.groupName}/${EPISODE_NAME}/${MODEL}`);
        });
        it('Should use the run/scopeBoundary/scopeKey/modelFile URL when a scope is provided', async() => {
            await runAdapter.query(MODEL, { scope: SCOPE });
            const req = fakeServer.requests.pop();
            const { scopeBoundary, scopeKey } = SCOPE;
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/${scopeBoundary}/${scopeKey}/${MODEL}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.query(MODEL, OPTIONS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.include(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/in/${SESSION.groupName}/${MODEL}`);
        });
        it('Should pass in query options as a part of the search parameters (query string)', async() => {
            await runAdapter.query(MODEL, OPTIONS);
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('filter').should.equal(OPTIONS.filter.join(';'));
            searchParams.get('sort').should.equal(OPTIONS.sort.join(';'));
            searchParams.get('var').should.equal(OPTIONS.variables.join(';'));
            searchParams.get('meta').should.equal(OPTIONS.metadata.join(';'));
            searchParams.get('first').should.equal(OPTIONS.first.toString());
            searchParams.get('max').should.equal(OPTIONS.max.toString());
            searchParams.get('timeout').should.equal(OPTIONS.timeout.toString());
        });
        testedMethods.push('query');
    });
    describe('runAdapter.getWithStrategy', () => {
        const MODEL = 'model.vmf';
        const SCOPE = { scopeBoundary: 'PROJECT', scopeKey: '123456789' };
        const OPTIONALS = {};

        const ARGS = [MODEL, SCOPE, OPTIONALS];
        const STRATEGIES = [
            'reuse-across-sessions',
            'reuse-never',
        ];

        STRATEGIES.forEach((strategy) => {
            it('Should have authorization', async() => {
                await runAdapter.getWithStrategy(strategy, ...ARGS);
                const req = fakeServer.requests.pop();
                req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
            });
        });

        describe('reuse-across-sessions', () => {
            before(() => {
                fakeServer.respondWith('GET', /(.*)\/run/, function(xhr, id) {
                    const RESPONSE = { values: [{ runKey: 123456789 }] };
                    xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
                });
            });

            const STRATEGY = 'reuse-across-sessions';

            it('Should do a GET', async() => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const res = fakeServer.requests.pop();
                res.method.toUpperCase().should.equal('GET');
            });

            it('Should use the run/scopeBoundary/scopeKey/modelFile URL', async() => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const req = fakeServer.requests.pop();
                const { scopeBoundary, scopeKey } = SCOPE;
                const url = req.url.split('?')[0];
                url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/${scopeBoundary}/${scopeKey}/${MODEL}`);
            });

            it('Should query for the most recent run', async() => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const req = fakeServer.requests.pop();
                const search = req.url.split('?')[1];
                const searchParams = new URLSearchParams(search);
                searchParams.get('sort').should.equal('-run.created');
                searchParams.get('max').should.equal('1');
            });

            describe('no existing run in scope', () => {
                before(() => {
                    fakeServer.respondWith('GET', /(.*)\/run/, function(xhr, id) {
                        const RESPONSE = { values: [] };
                        xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
                    });
                });
                it('Should do a GET then a POST', async() => {
                    await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                    const [get, post] = fakeServer.requests.slice(-2);
                    get.method.toUpperCase().should.equal('GET');
                    post.method.toUpperCase().should.equal('POST');
                });
                it('Should GET from run/scopeBoundary/scopeKey/modelFile URL, then POST to /run ', async() => {
                    await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                    const [get, post] = fakeServer.requests.slice(-2);
                    const { scopeBoundary, scopeKey } = SCOPE;
                    const queryURL = get.url.split('?')[0];
                    queryURL.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/${scopeBoundary}/${scopeKey}/${MODEL}`);
                    post.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run`);
                });
            });
        });

        describe('reuse-never', () => {
            const STRATEGY = 'reuse-never';
            const WORLD_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.WORLD, scopeKey: 123456789123456 };
            const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };
            it('Should do a POST', async() => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const req = fakeServer.requests.pop();
                req.method.toUpperCase().should.equal('POST');
            });
            it('Should use the run URL', async() => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const req = fakeServer.requests.pop();
                req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run`);
            });
            it('Should support generic URL options', async() => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, WORLD_SCOPE, GENERIC_OPTIONS);
                const req = fakeServer.requests.pop();
                const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
                req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run`);
            });
            it('Should pass the run to the request body', async() => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, WORLD_SCOPE, {
                    readLock: ROLE.AUTHOR,
                    writeLock: ROLE.AUTHOR,
                    userKey: 'userkey',
                    ephemeral: true,
                    trackingKey: 'trackingkey',
                });
                const req = fakeServer.requests.pop();
                const body = JSON.parse(req.requestBody);
                body.should.have.property('scope');
                body.scope.scopeBoundary.should.equal(WORLD_SCOPE.scopeBoundary);
                body.scope.scopeKey.should.equal(WORLD_SCOPE.scopeKey);
                body.should.have.property('permit');
                body.permit.readLock.should.equal(ROLE.AUTHOR);
                body.permit.writeLock.should.equal(ROLE.AUTHOR);
                body.trackingKey.should.equal('trackingkey');
                body.modelFile.should.equal(MODEL);
                body.morphology.should.equal('MANY');
                body.ephemeral.should.equal(true);
                body.modelContext.should.be.an('object').that.is.empty;
                body.executionContext.should.be.an('object').that.is.empty;
            });
            it('Should have read lock default to participant when using world scope', async() => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, WORLD_SCOPE);
                const req = fakeServer.requests.pop();
                const body = JSON.parse(req.requestBody);
                body.permit.readLock.should.equal(ROLE.PARTICIPANT);
            });
            it('Should not provide a userKey with a world scope', async() => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, WORLD_SCOPE);
                const req = fakeServer.requests.pop();
                const body = JSON.parse(req.requestBody);
                body.scope.should.not.have.property('userKey');
            });
            it('Should use a user read lock when creating with a group scope', async() => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE);
                const req = fakeServer.requests.pop();
                const body = JSON.parse(req.requestBody);
                body.permit.readLock.should.equal(ROLE.USER);
            });
            it('Should use the session\'s user key as when one is not provided one for group scope ', async() => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE);
                const req = fakeServer.requests.pop();
                const body = JSON.parse(req.requestBody);
                body.scope.userKey.should.equal(authAdapter.getLocalSession().userKey);
            });
        });
        testedMethods.push('getWithStrategy');
    });
    describe('runAdapter.introspect', () => {
        const MODEL = 'test-model.py';
        it('Should do a GET', async() => {
            await runAdapter.introspect(MODEL);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await runAdapter.introspect(MODEL);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/introspect/modelFile URL', async() => {
            await runAdapter.introspect(MODEL);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/introspect/${MODEL}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.introspect(MODEL, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/introspect/${MODEL}`);
        });
        testedMethods.push('introspect');
    });
    describe('runAdapter.operation', () => {
        const RUN_KEY = '123456789';
        const NAME = 'test-operation';
        const ARGUMENTS = ['arg1', 'arg2', 'arg3'];

        it('Should do a POST', async() => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/operation/runKey URL', async() => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/operation/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/operation/${RUN_KEY}`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            const OPTIONS = { timeout: 300, ritual: RITUAL.REANIMATE };
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS, OPTIONS);
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('timeout').should.equal(OPTIONS.timeout.toString());
            searchParams.get('ritual').should.equal(OPTIONS.ritual.toString());
        });
        it('Should handle the use of multiple run keys in the URL search parameters', async() => {
            await runAdapter.operation([RUN_KEY, '987654321'], NAME, ARGUMENTS);
            const req = fakeServer.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/operation`);
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('runKey').should.deep.equal([RUN_KEY, '987654321']);
        });
        it('Should set ritual to undefined when using mutiple run keys', async() => {
            await runAdapter.operation([RUN_KEY, '987654321'], NAME, ARGUMENTS, { ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.has('ritual').should.equal(false);
        });
        it('Should pass the operation to the request body', async() => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.name.should.equal(NAME);
            body.arguments.should.deep.equal(ARGUMENTS);
        });
        testedMethods.push('operation');
    });
    describe('runAdapter.getVariables', () => {
        const RUN_KEY = '123456789';
        const VARIABLES = ['var1', 'var2', 'var3'];
        it('Should do a GET', async() => {
            await runAdapter.getVariables(RUN_KEY, VARIABLES);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await runAdapter.getVariables(RUN_KEY, VARIABLES);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/variable/runKey URL', async() => {
            await runAdapter.getVariables(RUN_KEY, VARIABLES);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/variable/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.getVariables(RUN_KEY, VARIABLES, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/variable/${RUN_KEY}`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            await runAdapter.getVariables(RUN_KEY, VARIABLES, { timeout: 300, ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('include').should.equal(VARIABLES.join(';'));
            searchParams.get('timeout').should.equal('300');
            searchParams.get('ritual').should.equal(RITUAL.REANIMATE);
        });
        it('Should handle the use of multiple run keys in the URL search parameters', async() => {
            await runAdapter.getVariables([RUN_KEY, '987654321'], VARIABLES);
            const req = fakeServer.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/variable`);
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('runKey').should.deep.equal([RUN_KEY, '987654321']);
        });
        it('Should set ritual to undefined when using mutiple run keys', async() => {
            await runAdapter.getVariables([RUN_KEY, '987654321'], VARIABLES, { ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.has('ritual').should.equal(false);
        });
        testedMethods.push('getVariables');
    });
    describe('runAdapter.getVariable', () => {
        const RUN_KEY = '123456789';
        const VARIABLE = 'var1';
        it('Should do a GET', async() => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/variable/runKey/variableName URL', async() => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/variable/${RUN_KEY}/${VARIABLE}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/variable/${RUN_KEY}/${VARIABLE}`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE, { timeout: 300, ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('timeout').should.equal('300');
            searchParams.get('ritual').should.equal(RITUAL.REANIMATE);
        });
        it('Should handle multiple run keys in the URL search parameters', async() => {
            await runAdapter.getVariable([RUN_KEY, '987654321'], VARIABLE);
            const req = fakeServer.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/variable`);
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('runKey').should.deep.equal([RUN_KEY, '987654321']);
        });
        it('Should handle multiple variables in the URL search parameters', async() => {
            await runAdapter.getVariable(RUN_KEY, [VARIABLE, 'var2']);
            const req = fakeServer.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/variable/${RUN_KEY}`);
            const searchParams = new URLSearchParams(search);
            searchParams.get('include').should.equal([VARIABLE, 'var2'].join(';'));
        });
        it('Should handle multiple run keys and multiple variables in the URL search parameters', async() => {
            await runAdapter.getVariable([RUN_KEY, '987654321'], [VARIABLE, 'var2']);
            const req = fakeServer.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/variable`);
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('runKey').should.deep.equal([RUN_KEY, '987654321']);
            searchParams.get('include').should.equal([VARIABLE, 'var2'].join(';'));
        });
        testedMethods.push('getVariable');
    });
    describe('runAdapter.updateVariables', () => {
        const UPDATE = {
            'varname1#selector1@dialect1': 123456,
            'varname2#selector2@dialect2': 654987,
            'varname3#selector3@dialect3': 987654,
        };
        const RUN_KEY = '123456789';
        it('Should do a PATCH', async() => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        });
        it('Should have authorization', async() => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/variable/runKey URL', async() => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/variable/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/variable/${RUN_KEY}`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE, { timeout: 300, ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('timeout').should.equal('300');
            searchParams.get('ritual').should.equal(RITUAL.REANIMATE);
        });
        it('Should handle multiple run keys in the URL search parameters', async() => {
            await runAdapter.updateVariables([RUN_KEY, '987654321'], UPDATE);
            const req = fakeServer.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/variable`);
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('runKey').should.deep.equal([RUN_KEY, '987654321']);
        });
        it('Should set ritual to undefined when using mutiple run keys', async() => {
            await runAdapter.updateVariables([RUN_KEY, '987654321'], UPDATE, { ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.has('ritual').should.equal(false);
        });
        it('Should pass the variables update to the request body', async() => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.be.deep.equal(UPDATE);
        });
        testedMethods.push('updateVariables');
    });
    describe('runAdapter.getMetadata', () => {
        const RUN_KEY = '123456789';
        const METADATA = ['meta1', 'meta2', 'meta3'];
        it('Should do a GET', async() => {
            await runAdapter.getMetadata(RUN_KEY, METADATA);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await runAdapter.getMetadata(RUN_KEY, METADATA);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/meta/runKey URL', async() => {
            await runAdapter.getMetadata(RUN_KEY, METADATA);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/meta/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.getMetadata(RUN_KEY, METADATA, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/meta/${RUN_KEY}`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            await runAdapter.getMetadata(RUN_KEY, METADATA, { timeout: 300, ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('timeout').should.equal('300');
            searchParams.get('ritual').should.equal(RITUAL.REANIMATE);
        });
        it('Should handle multiple run keys in the URL search parameters', async() => {
            await runAdapter.getMetadata([RUN_KEY, '987654321'], METADATA);
            const req = fakeServer.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/meta`);
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('runKey').should.deep.equal([RUN_KEY, '987654321']);
        });
        it('Should set ritual to undefined when using mutiple run keys', async() => {
            await runAdapter.getMetadata([RUN_KEY, '987654321'], METADATA, { ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.has('ritual').should.equal(false);
        });
        testedMethods.push('getMetadata');
    });
    describe('runAdapter.updateMetadata', () => {
        const RUN_KEY = '123456789';
        const UPDATE = {
            meta1: 123456,
            meta2: 654987,
            meta3: 987654,
        };
        it('Should do a PATCH', async() => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        });
        it('Should have authorization', async() => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/meta/runKey URL', async() => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/meta/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/meta/${RUN_KEY}`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE, { timeout: 300, ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('timeout').should.equal('300');
            searchParams.get('ritual').should.equal(RITUAL.REANIMATE);
        });
        it('Should handle multiple run keys in the URL search parameters', async() => {
            await runAdapter.updateMetadata([RUN_KEY, '987654321'], UPDATE);
            const req = fakeServer.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/meta`);
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('runKey').should.deep.equal([RUN_KEY, '987654321']);
        });
        it('Should set ritual to undefined when using mutiple run keys', async() => {
            await runAdapter.updateMetadata([RUN_KEY, '987654321'], UPDATE, { ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.has('ritual').should.equal(false);
        });
        it('Should pass the metadata update to the request body', async() => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.be.deep.equal(UPDATE);
        });
        testedMethods.push('updateMetadata');
    });
    describe('runAdapter.action', () => {
        const RUN_KEY = '123456789';
        const ACTIONS = [
            { objectType: 'get', name: 'name1' },
            { objectType: 'set', name: 'name1', value: 'value1' },
            { objectType: 'execute', name: 'name1' },
        ];
        it('Should do a POST', async() => {
            await runAdapter.action(RUN_KEY, ACTIONS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await runAdapter.action(RUN_KEY, ACTIONS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/action/runKey URL', async() => {
            await runAdapter.action(RUN_KEY, ACTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/action/${RUN_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.action(RUN_KEY, ACTIONS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/action/${RUN_KEY}`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            await runAdapter.action(RUN_KEY, ACTIONS, { timeout: 300, ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('timeout').should.equal('300');
            searchParams.get('ritual').should.equal(RITUAL.REANIMATE);
        });
        it('Should handle multiple run keys in the URL search parameters', async() => {
            await runAdapter.action([RUN_KEY, '987654321'], ACTIONS);
            const req = fakeServer.requests.pop();
            const [url, search] = req.url.split('?');
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/action`);
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('runKey').should.deep.equal([RUN_KEY, '987654321']);
        });
        it('Should set ritual to undefined when using mutiple run keys', async() => {
            await runAdapter.action([RUN_KEY, '987654321'], ACTIONS, { ritual: RITUAL.REANIMATE });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.has('ritual').should.equal(false);
        });
        it('Should pass the action list to the request body', async() => {
            await runAdapter.action(RUN_KEY, ACTIONS);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.be.deep.equal(ACTIONS);
        });
        testedMethods.push('action');
    });
    describe('runAdapter.retrieveFromWorld', () => {
        const WORLD_KEY = 'worldkey';
        const MODEL = 'model.py';
        it('Should do a POST', async() => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/world/worldKey URL', async() => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/world/${WORLD_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/world/${WORLD_KEY}`);
        });
        it('Should use participant as the default for read/write locks', async() => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.permit.readLock.should.equal(ROLE.PARTICIPANT);
            body.permit.writeLock.should.equal(ROLE.PARTICIPANT);
        });
        it('Should pass creation options to the request body', async() => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, {
                readLock: ROLE.AUTHOR,
                writeLock: ROLE.AUTHOR,
                ephemeral: true,
                trackingKey: 'trackingkey',
            });
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.have.property('permit');
            body.permit.readLock.should.equal(ROLE.AUTHOR);
            body.permit.writeLock.should.equal(ROLE.AUTHOR);
            body.trackingKey.should.equal('trackingkey');
            body.modelFile.should.equal(MODEL);
            body.morphology.should.equal('MANY');
            body.ephemeral.should.equal(true);
            body.modelContext.should.be.an('object').that.is.empty;
            body.executionContext.should.be.an('object').that.is.empty;
        });
        testedMethods.push('retrieveFromWorld');
    });
    describe('runAdapter.removeFromWorld', () => {
        const WORLD_KEY = 'worldkey';
        it('Should do a DELETE', async() => {
            await runAdapter.removeFromWorld(WORLD_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });
        it('Should have authorization', async() => {
            await runAdapter.removeFromWorld(WORLD_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the run/world/worldKey URL', async() => {
            await runAdapter.removeFromWorld(WORLD_KEY);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/run/world/${WORLD_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await runAdapter.removeFromWorld(WORLD_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/world/${WORLD_KEY}`);
        });
        testedMethods.push('removeFromWorld');
    });

    it('Should not have any untested methods', () => {
        chai.expect(runAdapter).to.have.all.keys(...testedMethods);
    });
});

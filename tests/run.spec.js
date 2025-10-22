import {
    it,
    expect,
    describe,
    afterAll,
    beforeAll,
    beforeEach,
} from 'vitest';
import {
    ACCOUNT,
    PROJECT,
    SESSION,
    OK_CODE,
    createFetchMock,
    GENERIC_OPTIONS,
    testedMethods,
    config,
    authAdapter,
    runAdapter,
    SCOPE_BOUNDARY,
    ROLE,
    RITUAL,
    getAuthHeader,
    getPermitHeader,
    getFunctionKeys,
} from './common';

describe('runAdapter', () => {
    let capturedRequests = [];
    let mockSetup;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    beforeAll(() => {
        mockSetup = createFetchMock();
        capturedRequests = mockSetup.capturedRequests;
    });

    beforeEach(() => {
        capturedRequests.length = 0;
        authAdapter.setLocalSession(SESSION);
    });

    afterAll(() => {
        mockSetup.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('runAdapter.create', () => {
        const MODEL = 'model.vmf';
        const WORLD_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.WORLD, scopeKey: 123456789123456 };
        const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };

        it('Should do a POST', async () => {
            await runAdapter.create(MODEL, WORLD_SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.create(MODEL, WORLD_SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run URL', async () => {
            await runAdapter.create(MODEL, WORLD_SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.create(MODEL, WORLD_SCOPE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run`);
        });

        it('Should pass the run to the request body', async () => {
            await runAdapter.create(MODEL, WORLD_SCOPE, {
                readLock: ROLE.AUTHOR,
                writeLock: ROLE.AUTHOR,
                userKey: 'userkey',
                ephemeral: true,
                trackingKey: 'trackingkey',
                allowChannel: true,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('scope');
            expect(body.scope.scopeBoundary).toBe(WORLD_SCOPE.scopeBoundary);
            expect(body.scope.scopeKey).toBe(WORLD_SCOPE.scopeKey);
            expect(body).toHaveProperty('permit');
            expect(body.permit.readLock).toBe(ROLE.AUTHOR);
            expect(body.permit.writeLock).toBe(ROLE.AUTHOR);
            expect(body.trackingKey).toBe('trackingkey');
            expect(body.modelFile).toBe(MODEL);
            expect(body.morphology).toBe('MANY');
            expect(body.ephemeral).toBe(true);
            expect(body.modelContext).toEqual({});
            expect(body.executionContext).toEqual({});
            expect(body.allowChannel).toBe(true);
        });

        it('Should not provide a userKey with a world scope', async () => {
            await runAdapter.create(MODEL, WORLD_SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.scope).not.toHaveProperty('userKey');
        });

        it('Should use the session\'s user key as when one is not provided one for group scope ', async () => {
            await runAdapter.create(MODEL, GROUP_SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.scope.userKey).toBe(authAdapter.getLocalSession().userKey);
        });

        describe('Permits', () => {
            it('Should include a confirmation header if permit specified', async () => {
                await runAdapter.create(MODEL, GROUP_SCOPE, { readLock: ROLE.USER });
                const req1 = capturedRequests[capturedRequests.length - 1];
                expect(getPermitHeader(req1.requestHeaders)).toBeTruthy();

                await runAdapter.create(MODEL, GROUP_SCOPE, { writeLock: ROLE.PARTICIPANT });
                const req2 = capturedRequests[capturedRequests.length - 1];
                expect(getPermitHeader(req2.requestHeaders)).toBeTruthy();
            });

            it('Should forward only the specified parts of a permit', async () => {
                await runAdapter.create(MODEL, GROUP_SCOPE, { readLock: ROLE.USER });
                const req1 = capturedRequests[capturedRequests.length - 1];
                const body1 = JSON.parse(req1.options.body);
                expect(body1.permit.readLock).toBe(ROLE.USER);
                expect(body1.permit).not.toHaveProperty('writeLock');

                await runAdapter.create(MODEL, GROUP_SCOPE, { writeLock: ROLE.PARTICIPANT });
                const req2 = capturedRequests[capturedRequests.length - 1];
                const body2 = JSON.parse(req2.options.body);
                expect(body2.permit.writeLock).toBe(ROLE.PARTICIPANT);
                expect(body2.permit).not.toHaveProperty('readLock');
            });

            it('Should forward full permit with confirmation header if specified', async () => {
                await runAdapter.create(MODEL, GROUP_SCOPE, {
                    readLock: ROLE.USER,
                    writeLock: ROLE.PARTICIPANT,
                });
                const req = capturedRequests[capturedRequests.length - 1];
                const body = JSON.parse(req.options.body);
                expect(body.permit.readLock).toBe(ROLE.USER);
                expect(body.permit.writeLock).toBe(ROLE.PARTICIPANT);
                expect(getPermitHeader(req.requestHeaders)).toBeTruthy();
            });

            it('Should send no permit if none specified', async () => {
                await runAdapter.create(MODEL, GROUP_SCOPE);
                const req = capturedRequests[capturedRequests.length - 1];
                const body = JSON.parse(req.options.body);
                expect(body).not.toHaveProperty('permit');
            });

            it('Should merge confirmation header with provided headers if permit specified', async () => {
                await runAdapter.create(MODEL, GROUP_SCOPE, {
                    readLock: ROLE.USER,
                    writeLock: ROLE.PARTICIPANT,
                    headers: { 'accept-language': 'en-US' },
                });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getPermitHeader(req.requestHeaders)).toBeTruthy();
                expect(req.requestHeaders['accept-language']).toBe('en-US');
            });

            it('Should forward provided headers if no permit specified', async () => {
                await runAdapter.create(MODEL, GROUP_SCOPE, {
                    headers: { 'accept-language': 'en-US' },
                });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.requestHeaders['accept-language']).toBe('en-US');
            });
        });

        testedMethods.add('create');
    });

    describe('runAdapter.clone', () => {
        const RUN_KEY = 'runkey';

        it('Should do a POST', async () => {
            await runAdapter.clone(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.clone(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/clone/runKey URL', async () => {
            await runAdapter.clone(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/clone/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.clone(RUN_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/clone/${RUN_KEY}`);
        });

        it('Should pass the appropriate options to the request body', async () => {
            await runAdapter.clone(RUN_KEY, {
                trackingKey: 'trackingkey',
                ephemeral: true,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.trackingKey).toBe('trackingkey');
            expect(body.ephemeral).toBe(true);
            expect(body.modelContext).toEqual({});
            expect(body.executionContext).toEqual({});
        });

        testedMethods.add('clone');
    });

    describe('runAdapter.restore', () => {
        const RUN_KEY = 'runkey';

        it('Should do a POST', async () => {
            await runAdapter.restore(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.restore(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/restore/runKey URL', async () => {
            await runAdapter.restore(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/restore/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.restore(RUN_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/restore/${RUN_KEY}`);
        });

        it('Should pass the appropriate options to the request body', async () => {
            await runAdapter.restore(RUN_KEY, { ephemeral: true });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.ephemeral).toBe(true);
            expect(body.modelContext).toEqual({});
            expect(body.executionContext).toEqual({});
        });

        testedMethods.add('restore');
    });

    describe('runAdapter.rewind', () => {
        const RUN_KEY = 'runkey';
        const STEPS = 2;

        it('Should do a POST', async () => {
            await runAdapter.rewind(RUN_KEY, STEPS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.rewind(RUN_KEY, STEPS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/rewind/runKey URL', async () => {
            await runAdapter.rewind(RUN_KEY, STEPS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/rewind/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.rewind(RUN_KEY, STEPS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/rewind/${RUN_KEY}`);
        });

        it('Should pass the appropriate options to the request body', async () => {
            await runAdapter.rewind(RUN_KEY, STEPS, { ephemeral: true });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.rewindCount).toBe(STEPS);
            expect(body.ephemeral).toBe(true);
            expect(body.modelContext).toEqual({});
        });

        testedMethods.add('rewind');
    });

    describe('runAdapter.update', () => {
        const UPDATE = {
            trackingKey: 'trackingkey',
            readLock: ROLE.AUTHOR,
            writeLock: ROLE.AUTHOR,
            marked: true,
            hidden: true,
            closed: false,
            allowChannel: true,
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
            allowChannel: true,
        };
        const RUN_KEY = 'runkey';

        it('Should do a PATCH', async () => {
            await runAdapter.update(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await runAdapter.update(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/runKey URL', async () => {
            await runAdapter.update(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.update(RUN_KEY, UPDATE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/${RUN_KEY}`);
        });

        it('Should pass the update to the request body in the appropriate format', async () => {
            await runAdapter.update(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(PARSED_UPDATE);
        });

        it('Should properly omit options that aren\'t passed in', async () => {
            await runAdapter.update(RUN_KEY, { marked: true });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.marked).toBe(true);
            expect(body).not.toHaveProperty('permit');
            expect(body).not.toHaveProperty('trackingKey');
            expect(body).not.toHaveProperty('hidden');
            expect(body).not.toHaveProperty('closed');
        });

        testedMethods.add('update');
    });

    describe('runAdapter.remove', () => {
        const RUN_KEY = 'runkey';

        it('Should do a DELETE', async () => {
            await runAdapter.remove(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await runAdapter.remove(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/runKey URL', async () => {
            await runAdapter.remove(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.remove(RUN_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/${RUN_KEY}`);
        });

        testedMethods.add('remove');
    });

    describe('runAdapter.get', () => {
        const RUN_KEY = 'runkey';

        it('Should do a GET', async () => {
            await runAdapter.get(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await runAdapter.get(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/runKey URL', async () => {
            await runAdapter.get(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.get(RUN_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/${RUN_KEY}`);
        });

        testedMethods.add('get');
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

        it('Should do a GET', async () => {
            await runAdapter.query(MODEL, OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await runAdapter.query(MODEL, OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/in/groupName[/episodeName]/modelFile URL', async () => {
            const EPISODE_NAME = 'myepisodename';
            await runAdapter.query(MODEL, OPTIONS);
            const req1 = capturedRequests[capturedRequests.length - 1];
            expect(req1.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/in/${SESSION.groupName}/${MODEL}`);
            await runAdapter.query(MODEL, { episodeName: EPISODE_NAME });
            const req2 = capturedRequests[capturedRequests.length - 1];
            expect(req2.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/in/${SESSION.groupName}/${EPISODE_NAME}/${MODEL}`);
        });

        it('Should use the run/scopeBoundary/scopeKey/modelFile URL when a scope is provided', async () => {
            await runAdapter.query(MODEL, { scope: SCOPE });
            const req = capturedRequests[capturedRequests.length - 1];
            const { scopeBoundary, scopeKey } = SCOPE;
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/${scopeBoundary}/${scopeKey}/${MODEL}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.query(MODEL, OPTIONS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/in/${SESSION.groupName}/${MODEL}`);
        });

        it('Should pass in query options as a part of the search parameters (query string)', async () => {
            await runAdapter.query(MODEL, OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('filter')).toBe(OPTIONS.filter.join(';'));
            expect(searchParams.get('sort')).toBe(OPTIONS.sort.join(';'));
            expect(searchParams.get('var')).toBe(OPTIONS.variables.join(';'));
            expect(searchParams.get('meta')).toBe(OPTIONS.metadata.join(';'));
            expect(searchParams.get('first')).toBe(OPTIONS.first.toString());
            expect(searchParams.get('max')).toBe(OPTIONS.max.toString());
            expect(searchParams.get('timeout')).toBe(OPTIONS.timeout.toString());
        });

        testedMethods.add('query');
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
            it('Should have authorization', async () => {
                await runAdapter.getWithStrategy(strategy, ...ARGS);
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
            });
        });

        describe('reuse-across-sessions', () => {
            const STRATEGY = 'reuse-across-sessions';

            it('Should do a GET', async () => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const res = capturedRequests[capturedRequests.length - 1];
                expect(res.options.method.toUpperCase()).toBe('GET');
            });

            it('Should use the run/scopeBoundary/scopeKey/modelFile URL', async () => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const req = capturedRequests[capturedRequests.length - 1];
                const { scopeBoundary, scopeKey } = SCOPE;
                const url = req.url.split('?')[0];
                expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/${scopeBoundary}/${scopeKey}/${MODEL}`);
            });

            it('Should query for the most recent run', async () => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const req = capturedRequests[capturedRequests.length - 1];
                const search = req.url.split('?')[1];
                const searchParams = new URLSearchParams(search);
                expect(searchParams.get('sort')).toBe('-run.created');
                expect(searchParams.get('max')).toBe('1');
            });

            describe('no existing run in scope', () => {
                beforeEach(() => {
                    // Override the mock to return empty results for these tests
                    mockSetup.restore();
                    mockSetup = createFetchMock({
                        '/run/': {
                            status: OK_CODE,
                            body: {
                                firstResult: 0,
                                maxResults: 1,
                                totalResults: 0,
                                values: [],
                            },
                        },
                    });
                    capturedRequests = mockSetup.capturedRequests;
                });

                it('Should do a GET then a POST', async () => {
                    await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                    // eslint-disable-next-line no-magic-numbers
                    const [get, post] = capturedRequests.slice(-2);
                    expect(get.options.method.toUpperCase()).toBe('GET');
                    expect(post.options.method.toUpperCase()).toBe('POST');
                });

                it('Should GET from run/scopeBoundary/scopeKey/modelFile URL, then POST to /run ', async () => {
                    await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                    // eslint-disable-next-line no-magic-numbers
                    const [get, post] = capturedRequests.slice(-2);
                    const { scopeBoundary, scopeKey } = SCOPE;
                    const queryURL = get.url.split('?')[0];
                    expect(queryURL).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/${scopeBoundary}/${scopeKey}/${MODEL}`);
                    expect(post.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run`);
                });
            });
        });

        describe('reuse-never', () => {
            const STRATEGY = 'reuse-never';
            const WORLD_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.WORLD, scopeKey: 123456789123456 };
            const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };

            it('Should do a POST', async () => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.options.method.toUpperCase()).toBe('POST');
            });

            it('Should use the run URL', async () => {
                await runAdapter.getWithStrategy(STRATEGY, ...ARGS);
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run`);
            });

            it('Should support generic URL options', async () => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, WORLD_SCOPE, GENERIC_OPTIONS);
                const req = capturedRequests[capturedRequests.length - 1];
                const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
                expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run`);
            });

            it('Should pass the run to the request body', async () => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, WORLD_SCOPE, {
                    readLock: ROLE.AUTHOR,
                    writeLock: ROLE.AUTHOR,
                    userKey: 'userkey',
                    ephemeral: true,
                    trackingKey: 'trackingkey',
                });
                const req = capturedRequests[capturedRequests.length - 1];
                const body = JSON.parse(req.options.body);
                expect(body).toHaveProperty('scope');
                expect(body.scope.scopeBoundary).toBe(WORLD_SCOPE.scopeBoundary);
                expect(body.scope.scopeKey).toBe(WORLD_SCOPE.scopeKey);
                expect(body).toHaveProperty('permit');
                expect(body.permit.readLock).toBe(ROLE.AUTHOR);
                expect(body.permit.writeLock).toBe(ROLE.AUTHOR);
                expect(body.trackingKey).toBe('trackingkey');
                expect(body.modelFile).toBe(MODEL);
                expect(body.morphology).toBe('MANY');
                expect(body.ephemeral).toBe(true);
                expect(body.modelContext).toEqual({});
                expect(body.executionContext).toEqual({});
            });

            it('Should not provide a userKey with a world scope', async () => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, WORLD_SCOPE);
                const req = capturedRequests[capturedRequests.length - 1];
                const body = JSON.parse(req.options.body);
                expect(body.scope).not.toHaveProperty('userKey');
            });

            it('Should use the session\'s user key as when one is not provided one for group scope ', async () => {
                await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE);
                const req = capturedRequests[capturedRequests.length - 1];
                const body = JSON.parse(req.options.body);
                expect(body.scope.userKey).toBe(authAdapter.getLocalSession().userKey);
            });

            describe('Permits', () => {
                it('Should include a confirmation header if permit specified', async () => {
                    await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE, { readLock: ROLE.USER });
                    const req1 = capturedRequests[capturedRequests.length - 1];
                    expect(getPermitHeader(req1.requestHeaders)).toBeTruthy();

                    await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE, { writeLock: ROLE.PARTICIPANT });
                    const req2 = capturedRequests[capturedRequests.length - 1];
                    expect(getPermitHeader(req2.requestHeaders)).toBeTruthy();
                });

                it('Should forward only the specified parts of a permit', async () => {
                    await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE, { readLock: ROLE.USER });
                    const req1 = capturedRequests[capturedRequests.length - 1];
                    const body1 = JSON.parse(req1.options.body);
                    expect(body1.permit.readLock).toBe(ROLE.USER);
                    expect(body1.permit).not.toHaveProperty('writeLock');

                    await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE, { writeLock: ROLE.PARTICIPANT });
                    const req2 = capturedRequests[capturedRequests.length - 1];
                    const body2 = JSON.parse(req2.options.body);
                    expect(body2.permit.writeLock).toBe(ROLE.PARTICIPANT);
                    expect(body2.permit).not.toHaveProperty('readLock');
                });

                it('Should forward full permit with confirmation header if specified', async () => {
                    await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE, {
                        readLock: ROLE.USER,
                        writeLock: ROLE.PARTICIPANT,
                    });
                    const req = capturedRequests[capturedRequests.length - 1];
                    const body = JSON.parse(req.options.body);
                    expect(body.permit.readLock).toBe(ROLE.USER);
                    expect(body.permit.writeLock).toBe(ROLE.PARTICIPANT);
                    expect(getPermitHeader(req.requestHeaders)).toBeTruthy();
                });

                it('Should send no permit if none specified', async () => {
                    await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE);
                    const req = capturedRequests[capturedRequests.length - 1];
                    const body = JSON.parse(req.options.body);
                    expect(body).not.toHaveProperty('permit');
                });

                it('Should merge confirmation header with provided headers if permit specified', async () => {
                    await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE, {
                        readLock: ROLE.USER,
                        writeLock: ROLE.PARTICIPANT,
                        headers: { 'accept-language': 'en-US' },
                    });
                    const req = capturedRequests[capturedRequests.length - 1];
                    expect(getPermitHeader(req.requestHeaders)).toBeTruthy();
                    expect(req.requestHeaders['accept-language']).toBe('en-US');
                });

                it('Should forward provided headers if no permit specified', async () => {
                    await runAdapter.getWithStrategy(STRATEGY, MODEL, GROUP_SCOPE, {
                        headers: { 'accept-language': 'en-US' },
                    });
                    const req = capturedRequests[capturedRequests.length - 1];
                    expect(req.requestHeaders['accept-language']).toBe('en-US');
                });
            });
        });

        testedMethods.add('getWithStrategy');
    });

    describe('runAdapter.introspect', () => {
        const MODEL = 'test-model.py';

        it('Should do a GET', async () => {
            await runAdapter.introspect(MODEL);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await runAdapter.introspect(MODEL);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/introspect/model/modelFile URL', async () => {
            await runAdapter.introspect(MODEL);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/introspect/model/${MODEL}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.introspect(MODEL, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/introspect/model/${MODEL}`);
        });

        testedMethods.add('introspect');
    });

    describe('runAdapter.introspectWithRunKey', () => {
        const RUN_KEY = 'runKey';

        it('Should do a GET', async () => {
            await runAdapter.introspectWithRunKey(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await runAdapter.introspectWithRunKey(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/introspect/runKey URL', async () => {
            await runAdapter.introspectWithRunKey(RUN_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/introspect/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.introspectWithRunKey(RUN_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/introspect/${RUN_KEY}`);
        });

        testedMethods.add('introspectWithRunKey');
    });

    describe('runAdapter.operation', () => {
        const RUN_KEY = '123456789';
        const NAME = 'test-operation';
        const ARGUMENTS = ['arg1', 'arg2', 'arg3'];

        it('Should do a POST', async () => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/operation/runKey URL', async () => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/operation/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/operation/${RUN_KEY}`);
        });

        it('Should pass non-generic options to URL search parameters', async () => {
            const OPTIONS = { timeout: 300, ritual: RITUAL.REANIMATE };
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS, OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('timeout')).toBe(OPTIONS.timeout.toString());
            expect(searchParams.get('ritual')).toBe(OPTIONS.ritual.toString());
        });

        it('Should handle the use of multiple run keys in the URL search parameters', async () => {
            await runAdapter.operation([RUN_KEY, '987654321'], NAME, ARGUMENTS, { ritual: RITUAL.EXORCISE });
            const req = capturedRequests[capturedRequests.length - 1];
            const [url, search] = req.url.split('?');
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/operation`);
            const searchParams = new URLSearchParams(search);
            expect(searchParams.getAll('runKey')).toEqual([RUN_KEY, '987654321']);
        });

        it('Should set ritual to undefined when using mutiple run keys', async () => {
            await runAdapter.operation([RUN_KEY, '987654321'], NAME, ARGUMENTS, { ritual: RITUAL.REANIMATE });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.has('ritual')).toBe(false);
        });

        it('Should pass the operation to the request body', async () => {
            await runAdapter.operation(RUN_KEY, NAME, ARGUMENTS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.name).toBe(NAME);
            expect(body.arguments).toEqual(ARGUMENTS);
        });

        testedMethods.add('operation');
    });

    describe('runAdapter.getVariables', () => {
        const RUN_KEY = '123456789';
        const RUN_KEY_2 = '123456789';
        const VARIABLES = ['var1', 'var2', 'var3'];

        it('Should do a POST', async () => {
            await runAdapter.getVariables(RUN_KEY, VARIABLES);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.getVariables(RUN_KEY, VARIABLES);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/variable/runkey URL for single runs', async () => {
            await runAdapter.getVariables(RUN_KEY, VARIABLES);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/variable/${RUN_KEY}`);
        });

        it('Should use the run/variable URL for multiple runs', async () => {
            await runAdapter.getVariables([RUN_KEY, RUN_KEY_2], VARIABLES, { ritual: RITUAL.EXORCISE });
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/variable`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.getVariables(RUN_KEY, VARIABLES, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/variable/${RUN_KEY}`);
        });

        it('Should pass non-generic options to body', async () => {
            const TIMEOUT = 300;
            await runAdapter.getVariables(RUN_KEY, VARIABLES, { timeout: TIMEOUT, ritual: RITUAL.REANIMATE });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.ritual).toBe(RITUAL.REANIMATE);
            expect(body.timeout).toBe(TIMEOUT);
        });

        it('Should handle the use of multiple run keys in the request body', async () => {
            await runAdapter.getVariables([RUN_KEY, '987654321'], VARIABLES, { ritual: RITUAL.EXORCISE });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.runKey).toEqual([RUN_KEY, '987654321']);
        });

        it('Should set ritual to undefined when using mutiple run keys', async () => {
            await runAdapter.getVariables([RUN_KEY, '987654321'], VARIABLES, { ritual: RITUAL.REANIMATE });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(Object.hasOwn(body, 'ritual')).toBe(false);
        });

        testedMethods.add('getVariables');
    });

    describe('runAdapter.getVariable', () => {
        const RUN_KEY = '123456789';
        const VARIABLE = 'var1';

        it('Should do a GET', async () => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/variable/runKey/variableName URL', async () => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/variable/${RUN_KEY}/${VARIABLE}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/variable/${RUN_KEY}/${VARIABLE}`);
        });

        it('Should pass non-generic options to URL search parameters', async () => {
            await runAdapter.getVariable(RUN_KEY, VARIABLE, { timeout: 300, ritual: RITUAL.REANIMATE });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('timeout')).toBe('300');
            expect(searchParams.get('ritual')).toBe(RITUAL.REANIMATE);
        });

        it('Should handle multiple run keys in the request body', async () => {
            await runAdapter.getVariable([RUN_KEY, '987654321'], VARIABLE, { ritual: RITUAL.EXORCISE });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.runKey).toEqual([RUN_KEY, '987654321']);
        });

        it('Should handle multiple variables in the request body', async () => {
            await runAdapter.getVariable(RUN_KEY, [VARIABLE, 'var2']);
            const req = capturedRequests[capturedRequests.length - 1];
            const [url] = req.url.split('?');
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/variable/${RUN_KEY}`);
            const body = JSON.parse(req.options.body);
            expect(body.include).toBe([VARIABLE, 'var2'].join(';'));
        });

        it('Should handle multiple run keys and multiple variables in the request body', async () => {
            await runAdapter.getVariable([RUN_KEY, '987654321'], [VARIABLE, 'var2'], { ritual: RITUAL.EXORCISE });
            const req = capturedRequests[capturedRequests.length - 1];
            const [url] = req.url.split('?');
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/variable`);
            const body = JSON.parse(req.options.body);
            expect(body.include).toBe([VARIABLE, 'var2'].join(';'));
            expect(body.runKey).toEqual([RUN_KEY, '987654321']);
        });

        testedMethods.add('getVariable');
    });

    describe('runAdapter.updateVariables', () => {
        const UPDATE = {
            'varname1#selector1@dialect1': 123456,
            'varname2#selector2@dialect2': 654987,
            'varname3#selector3@dialect3': 987654,
        };
        const RUN_KEY = '123456789';

        it('Should do a PATCH', async () => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/variable/runKey URL', async () => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/variable/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/variable/${RUN_KEY}`);
        });

        it('Should pass non-generic options to URL search parameters', async () => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE, { timeout: 300, ritual: RITUAL.REANIMATE });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('timeout')).toBe('300');
            expect(searchParams.get('ritual')).toBe(RITUAL.REANIMATE);
        });

        it('Should handle multiple run keys in the URL search parameters', async () => {
            await runAdapter.updateVariables([RUN_KEY, '987654321'], UPDATE, { ritual: RITUAL.EXORCISE });
            const req = capturedRequests[capturedRequests.length - 1];
            const [url, search] = req.url.split('?');
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/variable`);
            const searchParams = new URLSearchParams(search);
            expect(searchParams.getAll('runKey')).toEqual([RUN_KEY, '987654321']);
        });

        it('Should set ritual to undefined when using mutiple run keys', async () => {
            await runAdapter.updateVariables([RUN_KEY, '987654321'], UPDATE, { ritual: RITUAL.REANIMATE });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.has('ritual')).toBe(false);
        });

        it('Should pass the variables update to the request body', async () => {
            await runAdapter.updateVariables(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(UPDATE);
        });

        testedMethods.add('updateVariables');
    });

    describe('runAdapter.getMetadata', () => {
        const RUN_KEY = '123456789';
        const METADATA = ['meta1', 'meta2', 'meta3'];

        it('Should do a POST', async () => {
            await runAdapter.getMetadata(RUN_KEY, METADATA);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.getMetadata(RUN_KEY, METADATA);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/meta URL', async () => {
            await runAdapter.getMetadata(RUN_KEY, METADATA);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/meta`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.getMetadata(RUN_KEY, METADATA, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/meta`);
        });

        it('Should handle multiple run keys in the request body', async () => {
            await runAdapter.getMetadata([RUN_KEY, '987654321'], METADATA);
            const req = capturedRequests[capturedRequests.length - 1];
            const [url] = req.url.split('?');
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/meta`);
            const body = JSON.parse(req.options.body);
            expect(body.runKey).toEqual([RUN_KEY, '987654321']);
        });

        testedMethods.add('getMetadata');
    });

    describe('runAdapter.updateMetadata', () => {
        const RUN_KEY = '123456789';
        const UPDATE = {
            meta1: 123456,
            meta2: 654987,
            meta3: 987654,
        };

        it('Should do a PATCH', async () => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/meta/runKey URL', async () => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/meta/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/meta/${RUN_KEY}`);
        });

        it('Should pass non-generic options to URL search parameters', async () => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE, { timeout: 300 });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('timeout')).toBe('300');
        });

        it('Should handle multiple run keys in the URL search parameters', async () => {
            await runAdapter.updateMetadata([RUN_KEY, '987654321'], UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const [url, search] = req.url.split('?');
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/meta`);
            const searchParams = new URLSearchParams(search);
            expect(searchParams.getAll('runKey')).toEqual([RUN_KEY, '987654321']);
        });

        it('Should pass the metadata update to the request body', async () => {
            await runAdapter.updateMetadata(RUN_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(UPDATE);
        });

        testedMethods.add('updateMetadata');
    });

    describe('runAdapter.action', () => {
        const RUN_KEY = '123456789';
        const ACTIONS = [
            { objectType: 'get', name: 'name1' },
            { objectType: 'set', name: 'name1', value: 'value1' },
            { objectType: 'execute', name: 'name1' },
        ];

        it('Should do a POST', async () => {
            await runAdapter.action(RUN_KEY, ACTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.action(RUN_KEY, ACTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/action/runKey URL', async () => {
            await runAdapter.action(RUN_KEY, ACTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/action/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.action(RUN_KEY, ACTIONS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/action/${RUN_KEY}`);
        });

        it('Should pass non-generic options to URL search parameters', async () => {
            await runAdapter.action(RUN_KEY, ACTIONS, { timeout: 300, ritual: RITUAL.REANIMATE });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('timeout')).toBe('300');
            expect(searchParams.get('ritual')).toBe(RITUAL.REANIMATE);
        });

        it('Should handle multiple run keys in the URL search parameters', async () => {
            await runAdapter.action([RUN_KEY, '987654321'], ACTIONS, { ritual: RITUAL.EXORCISE });
            const req = capturedRequests[capturedRequests.length - 1];
            const [url, search] = req.url.split('?');
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/action`);
            const searchParams = new URLSearchParams(search);
            expect(searchParams.getAll('runKey')).toEqual([RUN_KEY, '987654321']);
        });

        it('Should set ritual to undefined when using mutiple run keys', async () => {
            await runAdapter.action([RUN_KEY, '987654321'], ACTIONS, { ritual: RITUAL.REANIMATE });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.has('ritual')).toBe(false);
        });

        it('Should pass the action list to the request body', async () => {
            await runAdapter.action(RUN_KEY, ACTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(ACTIONS);
        });

        testedMethods.add('action');
    });

    describe('runAdapter.retrieveFromWorld', () => {
        const WORLD_KEY = 'worldkey';
        const MODEL = 'model.py';

        it('Should do a POST', async () => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/world/worldKey URL', async () => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/world/${WORLD_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/world/${WORLD_KEY}`);
        });

        it('Should pass creation options to the request body', async () => {
            await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, {
                readLock: ROLE.AUTHOR,
                writeLock: ROLE.AUTHOR,
                ephemeral: true,
                trackingKey: 'trackingkey',
                allowChannel: true,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('permit');
            expect(body.permit.readLock).toBe(ROLE.AUTHOR);
            expect(body.permit.writeLock).toBe(ROLE.AUTHOR);
            expect(body.trackingKey).toBe('trackingkey');
            expect(body.modelFile).toBe(MODEL);
            expect(body.morphology).toBe('MANY');
            expect(body.ephemeral).toBe(true);
            expect(body.modelContext).toEqual({});
            expect(body.executionContext).toEqual({});
            expect(body.allowChannel).toBe(true);
        });

        describe('Permits', () => {
            it('Should include a confirmation header if permit specified', async () => {
                await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, { readLock: ROLE.USER });
                const req1 = capturedRequests[capturedRequests.length - 1];
                expect(getPermitHeader(req1.requestHeaders)).toBeTruthy();

                await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, { writeLock: ROLE.PARTICIPANT });
                const req2 = capturedRequests[capturedRequests.length - 1];
                expect(getPermitHeader(req2.requestHeaders)).toBeTruthy();
            });

            it('Should forward only the specified parts of a permit', async () => {
                await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, { readLock: ROLE.USER });
                const req1 = capturedRequests[capturedRequests.length - 1];
                const body1 = JSON.parse(req1.options.body);
                expect(body1.permit.readLock).toBe(ROLE.USER);
                expect(body1.permit).not.toHaveProperty('writeLock');

                await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, { writeLock: ROLE.PARTICIPANT });
                const req2 = capturedRequests[capturedRequests.length - 1];
                const body2 = JSON.parse(req2.options.body);
                expect(body2.permit.writeLock).toBe(ROLE.PARTICIPANT);
                expect(body2.permit).not.toHaveProperty('readLock');
            });

            it('Should forward full permit with confirmation header if specified', async () => {
                await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, {
                    readLock: ROLE.USER,
                    writeLock: ROLE.PARTICIPANT,
                });
                const req = capturedRequests[capturedRequests.length - 1];
                const body = JSON.parse(req.options.body);
                expect(body.permit.readLock).toBe(ROLE.USER);
                expect(body.permit.writeLock).toBe(ROLE.PARTICIPANT);
                expect(getPermitHeader(req.requestHeaders)).toBeTruthy();
            });

            it('Should send no permit if none specified', async () => {
                await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL);
                const req = capturedRequests[capturedRequests.length - 1];
                const body = JSON.parse(req.options.body);
                expect(body).not.toHaveProperty('permit');
            });

            it('Should merge confirmation header with provided headers if permit specified', async () => {
                await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, {
                    readLock: ROLE.USER,
                    writeLock: ROLE.PARTICIPANT,
                    headers: { 'accept-language': 'en-US' },
                });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getPermitHeader(req.requestHeaders)).toBeTruthy();
                expect(req.requestHeaders['accept-language']).toBe('en-US');
            });

            it('Should forward provided headers if no permit specified', async () => {
                await runAdapter.retrieveFromWorld(WORLD_KEY, MODEL, {
                    headers: { 'accept-language': 'en-US' },
                });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.requestHeaders['accept-language']).toBe('en-US');
            });
        });

        testedMethods.add('retrieveFromWorld');
    });

    describe('runAdapter.removeFromWorld', () => {
        const WORLD_KEY = 'worldkey';

        it('Should do a DELETE', async () => {
            await runAdapter.removeFromWorld(WORLD_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await runAdapter.removeFromWorld(WORLD_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/world/worldKey URL', async () => {
            await runAdapter.removeFromWorld(WORLD_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/world/${WORLD_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.removeFromWorld(WORLD_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/world/${WORLD_KEY}`);
        });

        testedMethods.add('removeFromWorld');
    });

    describe('runAdapter.createSingular', () => {
        const MODEL = 'model.vmf';

        it('Should do a POST', async () => {
            await runAdapter.createSingular(MODEL);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.createSingular(MODEL);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the singular run URL', async () => {
            await runAdapter.createSingular(MODEL);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/singular`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.createSingular(MODEL, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/singular`);
        });

        it('Should pass the run to the request body', async () => {
            await runAdapter.createSingular(MODEL, {
                readLock: ROLE.AUTHOR,
                writeLock: ROLE.AUTHOR,
                ephemeral: true,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('permit');
            expect(body.permit.readLock).toBe(ROLE.AUTHOR);
            expect(body.permit.writeLock).toBe(ROLE.AUTHOR);
            expect(body.modelFile).toBe(MODEL);
            expect(body.ephemeral).toBe(true);
            expect(body.modelContext).toEqual({});
            expect(body.executionContext).toEqual({});
        });

        describe('Permits', () => {
            it('Should include a confirmation header if permit specified', async () => {
                await runAdapter.createSingular(MODEL, { readLock: ROLE.USER });
                const req1 = capturedRequests[capturedRequests.length - 1];
                expect(getPermitHeader(req1.requestHeaders)).toBeTruthy();

                await runAdapter.createSingular(MODEL, { writeLock: ROLE.PARTICIPANT });
                const req2 = capturedRequests[capturedRequests.length - 1];
                expect(getPermitHeader(req2.requestHeaders)).toBeTruthy();
            });

            it('Should forward only the specified parts of a permit', async () => {
                await runAdapter.createSingular(MODEL, { readLock: ROLE.USER });
                const req1 = capturedRequests[capturedRequests.length - 1];
                const body1 = JSON.parse(req1.options.body);
                expect(body1.permit.readLock).toBe(ROLE.USER);
                expect(body1.permit).not.toHaveProperty('writeLock');

                await runAdapter.createSingular(MODEL, { writeLock: ROLE.PARTICIPANT });
                const req2 = capturedRequests[capturedRequests.length - 1];
                const body2 = JSON.parse(req2.options.body);
                expect(body2.permit.writeLock).toBe(ROLE.PARTICIPANT);
                expect(body2.permit).not.toHaveProperty('readLock');
            });

            it('Should forward full permit with confirmation header if specified', async () => {
                await runAdapter.createSingular(MODEL, {
                    readLock: ROLE.USER,
                    writeLock: ROLE.PARTICIPANT,
                });
                const req = capturedRequests[capturedRequests.length - 1];
                const body = JSON.parse(req.options.body);
                expect(body.permit.readLock).toBe(ROLE.USER);
                expect(body.permit.writeLock).toBe(ROLE.PARTICIPANT);
                expect(getPermitHeader(req.requestHeaders)).toBeTruthy();
            });

            it('Should send no permit if none specified', async () => {
                await runAdapter.createSingular(MODEL);
                const req = capturedRequests[capturedRequests.length - 1];
                const body = JSON.parse(req.options.body);
                expect(body).not.toHaveProperty('permit');
            });

            it('Should merge confirmation header with provided headers if permit specified', async () => {
                await runAdapter.createSingular(MODEL, {
                    readLock: ROLE.USER,
                    writeLock: ROLE.PARTICIPANT,
                    headers: { 'accept-language': 'en-US' },
                });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getPermitHeader(req.requestHeaders)).toBeTruthy();
                expect(req.requestHeaders['accept-language']).toBe('en-US');
            });

            it('Should forward provided headers if no permit specified', async () => {
                await runAdapter.createSingular(MODEL, {
                    headers: { 'accept-language': 'en-US' },
                });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.requestHeaders['accept-language']).toBe('en-US');
            });
        });

        testedMethods.add('createSingular');
    });

    describe('runAdapter.getSingularRunKey', () => {
        it('Should do a GET', async () => {
            await runAdapter.getSingularRunKey();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await runAdapter.getSingularRunKey();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the singular run URL', async () => {
            await runAdapter.getSingularRunKey();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/singular/key`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.getSingularRunKey(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/singular/key`);
        });

        testedMethods.add('getSingularRunKey');
    });

    describe('runAdapter.migrate', () => {
        const RUN_KEY = 'testRunKey123';
        const EPISODE_KEY = 'testEpisodeKey123';

        it('Should do a POST', async () => {
            await runAdapter.migrate(RUN_KEY, EPISODE_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await runAdapter.migrate(RUN_KEY, EPISODE_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the run/migrate/episodeKey/runKey URL', async () => {
            await runAdapter.migrate(RUN_KEY, EPISODE_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/run/migrate/to/${EPISODE_KEY}/${RUN_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await runAdapter.migrate(RUN_KEY, EPISODE_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/run/migrate/to/${EPISODE_KEY}/${RUN_KEY}`);
        });

        it('Should pass the appropriate options to the request body', async () => {
            await runAdapter.migrate(RUN_KEY, EPISODE_KEY, {
                trackingKey: 'trackingkey',
                ephemeral: true,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.trackingKey).toBe('trackingkey');
            expect(body.ephemeral).toBe(true);
            expect(body.modelContext).toEqual({});
            expect(body.executionContext).toEqual({});
        });

        testedMethods.add('migrate');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(runAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

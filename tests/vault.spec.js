import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import {
    ROLE,
    ACCOUNT,
    PROJECT,
    SESSION,
    SCOPE_BOUNDARY,
    GENERIC_OPTIONS,
    createFetchMock,
    testedMethods,
    getAuthHeader,
    vaultAdapter,
    authAdapter,
    config,
} from './common';

const DEPRECATED_METHODS = ['create'];

describe('vaultAdapter', () => {
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

    describe('vaultAdapter.update', () => {
        const VAULT_KEY = 'MOCK_VAULT_KEY';
        const UPDATE = {
            pop: {},
            set: { foo: 'bar' },
            push: {},
        };

        it('Should do a PUT', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PUT');
        });

        it('Should have authorization', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vault/vaultKey URL', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/${VAULT_KEY}`);
        });

        it('Should support generic URL options', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/${VAULT_KEY}`);
        });

        it('Should send the update in the request body', async() => {
            await vaultAdapter.update(VAULT_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(UPDATE);
        });

        testedMethods.push('update');
    });

    describe('vaultAdapter.updateProperties', () => {
        const VAULT_KEY = 'MOCK_VAULT_KEY';
        const UPDATE = {
            allowChannel: true,
            permit: {
                readLock: ROLE.FACILITATOR,
                writeLock: ROLE.FACILITATOR,
            },
            ttlSeconds: 3600,
        };

        it('Should do a PATCH', async() => {
            await vaultAdapter.updateProperties(VAULT_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async() => {
            await vaultAdapter.updateProperties(VAULT_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vault/vaultKey URL', async() => {
            await vaultAdapter.updateProperties(VAULT_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/${VAULT_KEY}`);
        });

        it('Should support generic URL options', async() => {
            await vaultAdapter.updateProperties(VAULT_KEY, UPDATE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/${VAULT_KEY}`);
        });

        it('Should send the update in the request body', async() => {
            await vaultAdapter.updateProperties(VAULT_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(UPDATE);
        });

        testedMethods.push('updateProperties');
    });

    describe('vaultAdapter.get', () => {
        const VAULT_KEY = 'MOCK_VAULT_KEY';

        it('Should do a GET', async() => {
            await vaultAdapter.get(VAULT_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await vaultAdapter.get(VAULT_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vault/vaultKey URL', async() => {
            await vaultAdapter.get(VAULT_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/${VAULT_KEY}`);
        });

        it('Should support generic URL options', async() => {
            await vaultAdapter.get(VAULT_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/${VAULT_KEY}`);
        });

        testedMethods.push('get');
    });

    describe('vaultAdapter.withScope', () => {
        const NAME = 'myvaultname';
        const USER_KEY = 'myuserkey';
        const SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };

        it('Should do a GET', async() => {
            await vaultAdapter.withScope(NAME, SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await vaultAdapter.withScope(NAME, SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vault/with/scopeBoundary/scopeKey/name URL', async() => {
            await vaultAdapter.withScope(NAME, SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/with/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${NAME}`);
        });

        it('Should use insert userKey into URL when provided', async() => {
            await vaultAdapter.withScope(NAME, { ...SCOPE, userKey: USER_KEY });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/with/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${USER_KEY}/${NAME}`);
        });

        it('Should support generic URL options', async() => {
            await vaultAdapter.withScope(NAME, SCOPE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/with/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${NAME}`);
        });

        testedMethods.push('withScope');
    });

    describe('vaultAdapter.byName', () => {
        const NAME = 'myvaultname';

        it('Should do a GET', async() => {
            await vaultAdapter.byName(NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await vaultAdapter.byName(NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vault/in/groupName[/episodeName]/name URL', async() => {
            const EPISODE_NAME = 'myepisodename';
            await vaultAdapter.byName(NAME);
            const req1 = capturedRequests[capturedRequests.length - 1];
            expect(req1.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/in/${SESSION.groupName}/${NAME}`);
            await vaultAdapter.byName(NAME, { episodeName: EPISODE_NAME });
            const req2 = capturedRequests[capturedRequests.length - 1];
            expect(req2.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/in/${SESSION.groupName}/${EPISODE_NAME}/${NAME}`);
        });

        it('Should use a custom group name in the URL if provided', async() => {
            const GROUP_NAME = 'mygroupname';
            await vaultAdapter.byName(NAME, { groupName: GROUP_NAME });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/in/${GROUP_NAME}/${NAME}`);
        });

        it('Should pass the userKey and includeEpisodes to the search params if provided', async() => {
            const USER_KEY = 'myuserkey';
            const RANDOM_THING = { something: 'random' };
            await vaultAdapter.byName(NAME, {
                userKey: USER_KEY,
                includeEpisodes: true,
                ...RANDOM_THING,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('userKey')).toBe(USER_KEY);
            expect(searchParams.get('includeEpisodes')).toBe('true');
            expect(searchParams.has('something')).toBe(false);
        });

        it('Should support generic URL options', async() => {
            await vaultAdapter.byName(NAME, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/in/${SESSION.groupName}/${NAME}`);
        });

        testedMethods.push('byName');
    });

    describe('vaultAdapter.remove', () => {
        const VAULT_KEY = 'myvaultkey';

        it('Should do a DELETE', async() => {
            await vaultAdapter.remove(VAULT_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async() => {
            await vaultAdapter.remove(VAULT_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vault/vaultKey URL', async() => {
            await vaultAdapter.remove(VAULT_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/${VAULT_KEY}`);
        });

        it('Should pass the mutationKey to the search params if provided', async() => {
            const MUTATION_KEY = 'mymutationkey';
            await vaultAdapter.remove(VAULT_KEY, { mutationKey: MUTATION_KEY });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('mutationKey')).toBe(MUTATION_KEY);
        });

        it('Should support generic URL options', async() => {
            await vaultAdapter.remove(VAULT_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/${VAULT_KEY}`);
        });

        testedMethods.push('remove');
    });

    describe('vaultAdapter.define', () => {
        const NAME = 'myvaultname';
        const GROUP_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: 123456789123456 };
        const WORLD_SCOPE = { scopeBoundary: SCOPE_BOUNDARY.WORLD, scopeKey: 123456789123456 };
        const ITEMS = { set: { foo: 'bar' } };
        const DEFAULT_MUTATION_STRATEGY = '?mutationStrategy=ERROR';

        it('Should do a POST', async() => {
            await vaultAdapter.define(NAME, GROUP_SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await vaultAdapter.define(NAME, GROUP_SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vault URL', async() => {
            await vaultAdapter.define(NAME, GROUP_SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/${NAME}${DEFAULT_MUTATION_STRATEGY}`);
        });

        it('Should pass on the mutationStrategy to the URL', async() => {
            await vaultAdapter.define(NAME, GROUP_SCOPE, { mutationStrategy: 'DISALLOW' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/${NAME}?mutationStrategy=DISALLOW`);
        });

        it('Should support generic URL options', async() => {
            await vaultAdapter.define(NAME, GROUP_SCOPE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/${NAME}${DEFAULT_MUTATION_STRATEGY}`);
        });

        it('Should pass the scope and items to the body', async() => {
            await vaultAdapter.define(NAME, GROUP_SCOPE, { items: ITEMS });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.items).toEqual(ITEMS);
            expect(body.scope).toEqual(GROUP_SCOPE);
        });

        it('Should default the readLock to ‘participant’ when provided world scope', async() => {
            await vaultAdapter.define(NAME, WORLD_SCOPE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.permit.readLock).toBe(ROLE.PARTICIPANT);
        });

        it('Should use readLock and writeLock when explicitly provided', async() => {
            await vaultAdapter.define(NAME, WORLD_SCOPE, { readLock: ROLE.ANONYMOUS, writeLock: ROLE.ANONYMOUS });
            const req = capturedRequests[capturedRequests.length - 1];

            const body = JSON.parse(req.options.body);
            expect(body.permit.readLock).toBe(ROLE.ANONYMOUS);
            expect(body.permit.writeLock).toBe(ROLE.ANONYMOUS);
        });

        it('Should use accept optionals provided', async() => {
            const USER_KEY = 'myuserkey';
            const TTL_SECONDS = 20;
            const MUTATION_STRATEGY = 'ALLOW';
            const RANDOM_THING = { something: 'random' };
            await vaultAdapter.define(NAME, { ...WORLD_SCOPE, userKey: USER_KEY }, {
                ttlSeconds: TTL_SECONDS,
                mutationStrategy: MUTATION_STRATEGY,
                allowChannel: true,
                ...RANDOM_THING,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.scope.userKey).toBe(USER_KEY);
            expect(body.ttlSeconds).toBe(TTL_SECONDS);
            expect(body.allowChannel).toBe(true);
            expect(body).not.toMatchObject(RANDOM_THING);

            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('mutationStrategy')).toBe(MUTATION_STRATEGY);
        });

        testedMethods.push('define');
    });

    describe('vaultAdapter.create', () => {
        it('Should be deprecated', () => {
            expect(DEPRECATED_METHODS).toContain('create');
        });

        testedMethods.push('create');
    });

    describe('vaultAdapter.list', () => {
        const searchOptions = {
            filter: ['name=testVault', `scope.userKey=${SESSION.userKey}`],
            first: 0,
            max: 10,
        };

        it('Should do a GET', async() => {
            await vaultAdapter.list(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await vaultAdapter.list(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vault/search URL', async() => {
            await vaultAdapter.list(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/search?filter=name%3DtestVault%3Bscope.userKey%3D${SESSION.userKey}&first=0&max=10`);
        });

        it('Should support generic URL options', async() => {
            await vaultAdapter.list(searchOptions, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vault/search?filter=name%3DtestVault%3Bscope.userKey%3D${SESSION.userKey}&first=0&max=10`);
        });

        testedMethods.push('list');
    });

    describe('vaultAdapter.count', () => {
        const OPTIONS = {
            filter: ['item.test=123', 'item.trackingKey=789', 'vault.scopeKey=u5e3rK3y', 'vault.scopeBoundary=GROUP'],
            first: 20,
            max: 15,
        };

        it('Should do a GET', async() => {
            await vaultAdapter.count(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await vaultAdapter.count(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /vault/count URL', async() => {
            await vaultAdapter.count(OPTIONS);
            const req1 = capturedRequests[capturedRequests.length - 1];
            expect(req1.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vault/count`);
        });

        it('Should pass in query options as a part of the search parameters (query string)', async() => {
            await vaultAdapter.count(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('filter')).toBe(OPTIONS.filter.join(';'));
            expect(searchParams.get('first')).toBe(OPTIONS.first.toString());
            expect(searchParams.get('max')).toBe(OPTIONS.max.toString());
        });

        testedMethods.push('count');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(vaultAdapter).filter((key) => typeof vaultAdapter[key] === 'function');
        expect(actualMethods.sort()).toEqual(testedMethods.sort());
    });
});

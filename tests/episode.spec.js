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
    GENERIC_OPTIONS,
    createFetchMock,
    testedMethods,
    getAuthHeader,
    authAdapter,
    episodeAdapter,
    config,
} from './common';

describe('episodeAdapter', () => {
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

    describe('episodeAdapter.create', () => {
        const name = 'my-episode';
        const groupName = 'my-group';

        it('Should do a POST', async() => {
            await episodeAdapter.create(name, groupName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await episodeAdapter.create(name, groupName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the episode URL with groupName', async() => {
            await episodeAdapter.create(name, groupName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/episode/${groupName}`);
        });

        it('Should support generic URL options', async() => {
            await episodeAdapter.create(name, groupName, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/episode/${groupName}`);
        });

        it('Should pass name to the request body', async() => {
            await episodeAdapter.create(name, groupName);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('name', name);
        });

        it('Should pass optional parameters to the request body', async() => {
            const optionals = {
                draft: true,
                runLimit: 20,
                category: 'test-category',
            };
            await episodeAdapter.create(name, groupName, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('draft', optionals.draft);
            expect(body).toHaveProperty('runLimit', optionals.runLimit);
            expect(body).toHaveProperty('category', optionals.category);
        });

        testedMethods.push('create');
    });

    describe('episodeAdapter.get', () => {
        const episodeKey = 'EPISODE_KEY';

        it('Should do a GET', async() => {
            await episodeAdapter.get(episodeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await episodeAdapter.get(episodeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the episode URL with episodeKey', async() => {
            await episodeAdapter.get(episodeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/episode/${episodeKey}`);
        });

        it('Should support generic URL options', async() => {
            await episodeAdapter.get(episodeKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/episode/${episodeKey}`);
        });

        testedMethods.push('get');
    });

    describe('episodeAdapter.query', () => {
        const searchOptions = {
            filter: ['name|=one|two', 'draft=false'],
            sort: ['+episode.created'],
            first: 0,
            max: 10,
        };

        it('Should do a GET', async() => {
            await episodeAdapter.query(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await episodeAdapter.query(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the episode/search URL', async() => {
            await episodeAdapter.query(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/episode/search`);
        });

        it('Should support generic URL options', async() => {
            await episodeAdapter.query(searchOptions, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/episode/search`);
        });

        it('Should pass query parameters', async() => {
            await episodeAdapter.query(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('filter=');
            expect(req.url).toContain('sort=');
            expect(req.url).toContain('first=0');
            expect(req.url).toContain('max=10');
        });

        testedMethods.push('query');
    });

    describe('episodeAdapter.forGroup', () => {
        const groupKey = 'GROUP_KEY';

        it('Should do a GET', async() => {
            await episodeAdapter.forGroup(groupKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await episodeAdapter.forGroup(groupKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the episode/in URL with groupKey', async() => {
            await episodeAdapter.forGroup(groupKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/episode/in/${groupKey}`);
        });

        it('Should support generic URL options', async() => {
            await episodeAdapter.forGroup(groupKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/episode/in/${groupKey}`);
        });

        testedMethods.push('forGroup');
    });

    describe('episodeAdapter.withName', () => {
        const name = 'my-episode';

        it('Should do a GET', async() => {
            await episodeAdapter.withName(name);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await episodeAdapter.withName(name);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the episode/with URL with session groupName and episode name', async() => {
            await episodeAdapter.withName(name);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/episode/with/${SESSION.groupName}/${name}`);
        });

        it('Should use provided groupName when specified', async() => {
            const groupName = 'custom-group';
            await episodeAdapter.withName(name, { groupName });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/episode/with/${groupName}/${name}`);
        });

        it('Should support generic URL options', async() => {
            await episodeAdapter.withName(name, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/episode/with/${SESSION.groupName}/${name}`);
        });

        testedMethods.push('withName');
    });

    describe('episodeAdapter.remove', () => {
        const episodeKey = 'EPISODE_KEY';

        it('Should do a DELETE', async() => {
            await episodeAdapter.remove(episodeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async() => {
            await episodeAdapter.remove(episodeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the episode URL with episodeKey', async() => {
            await episodeAdapter.remove(episodeKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/episode/${episodeKey}`);
        });

        it('Should support generic URL options', async() => {
            await episodeAdapter.remove(episodeKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/episode/${episodeKey}`);
        });

        testedMethods.push('remove');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(episodeAdapter).filter((key) => typeof episodeAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

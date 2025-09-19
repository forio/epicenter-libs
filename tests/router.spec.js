import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import { ACCOUNT, PROJECT, SESSION, createFetchMock, config, authAdapter, Router, errorManager, getAuthHeader } from './common';


describe('Router Tests', () => {
    let capturedRequests = [];
    let mockSetup;

    beforeAll(() => {
        mockSetup = createFetchMock();
        capturedRequests = mockSetup.capturedRequests;
    });

    beforeEach(() => {
        capturedRequests.length = 0;
    });

    afterAll(() => {
        mockSetup.restore();

        /* Since this test file messes w/ configuration, we should reset
         * it back to the appropriate values for other the .spec.js files */
        config.loadBrowser();
        config.accountShortName = ACCOUNT;
        config.projectShortName = PROJECT;
        config.useProjectProxy = false;
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
            expect(typeof router.server).toBe('undefined');
            expect(typeof router.useProjectProxy).toBe('undefined');
            expect(typeof router.accountShortName).toBe('undefined');
            expect(typeof router.projectShortName).toBe('undefined');
            expect(typeof router.version).toBe('undefined');
        });

        it('Should use the configuration values when no URI components are set', async() => {
            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            const { apiProtocol, apiHost, apiVersion, accountShortName, projectShortName } = config;
            expect(req.url).toBe(`${apiProtocol}://${apiHost}/api/v${apiVersion}/${accountShortName}/${projectShortName}/run`);
        });

        it('Should also use configuration values retroactively', async() => {
            config.apiProtocol = 'http';
            config.apiHost = 'mydomain.com';
            config.accountShortName = 'something';
            config.projectShortName = 'else';

            await router.get('/run');
            const req1 = capturedRequests[capturedRequests.length - 1];
            expect(req1.url).toBe('http://mydomain.com/api/v3/something/else/run');

            config.loadBrowser();
            config.accountShortName = ACCOUNT;
            config.projectShortName = PROJECT;

            await router.get('/run');
            const req2 = capturedRequests[capturedRequests.length - 1];
            expect(req2.url).toBe(`https://forio.com/api/v3/${ACCOUNT}/${PROJECT}/run`);
        });

        it('Should route calls to the project proxy server', async() => {
            config.useProjectProxy = true;

            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://forio.com/proxy/${ACCOUNT}/${PROJECT}/api/v3/${ACCOUNT}/${PROJECT}/run`);

            config.useProjectProxy = false;

            await router.get('/run');
            const req2 = capturedRequests[capturedRequests.length - 1];
            expect(req2.url).toBe(`https://forio.com/api/v3/${ACCOUNT}/${PROJECT}/run`);
        });

        it('Should ignore configuration values when URI components are provided directly to the router', async() => {
            router.server = 'https://mydomain.com';
            router.accountShortName = 'anything';
            router.projectShortName = 'else';

            config.accountShortName = ACCOUNT;
            config.projectShortName = PROJECT;

            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe('https://mydomain.com/api/v3/anything/else/run');

            config.useProjectProxy = false;
            router.useProjectProxy = true;

            await router.get('/run');
            const req2 = capturedRequests[capturedRequests.length - 1];
            expect(req2.url).toBe('https://mydomain.com/proxy/anything/else/api/v3/anything/else/run');
        });

        describe('Routing Options', () => {
            it('Should accept routing options overrides from adapter methods', async() => {
                config.accountShortName = ACCOUNT;
                config.projectShortName = PROJECT;

                await router.get('/run', { accountShortName: 'something', projectShortName: 'else' });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe('https://forio.com/api/v3/something/else/run');

                await router.delete('/run', { accountShortName: 'something', projectShortName: 'else' });
                const req2 = capturedRequests[capturedRequests.length - 1];
                expect(req2.url).toBe('https://forio.com/api/v3/something/else/run');

                await router.patch('/run', { accountShortName: 'something', projectShortName: 'else' });
                const req3 = capturedRequests[capturedRequests.length - 1];
                expect(req3.url).toBe('https://forio.com/api/v3/something/else/run');

                await router.post('/run', { accountShortName: 'something', projectShortName: 'else' });
                const req4 = capturedRequests[capturedRequests.length - 1];
                expect(req4.url).toBe('https://forio.com/api/v3/something/else/run');

                await router.put('/run', { accountShortName: 'something', projectShortName: 'else' });
                const req5 = capturedRequests[capturedRequests.length - 1];
                expect(req5.url).toBe('https://forio.com/api/v3/something/else/run');

                await router.get('/run', { useProjectProxy: true });
                const req6 = capturedRequests[capturedRequests.length - 1];
                expect(req6.url).toBe(`https://forio.com/proxy/${ACCOUNT}/${PROJECT}/api/v3/${ACCOUNT}/${PROJECT}/run`);
            });

            it('Should prioritize method overrides over router instance properties', async() => {
                router.accountShortName = 'something';
                router.projectShortName = 'else';
                router.apiHost = 'mydomain.com';

                await router.get('/run', { apiHost: 'forio.com', accountShortName: 'foo', projectShortName: 'bar' });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe('https://forio.com/api/v3/foo/bar/run');
            });

            it('Should prioritize method overrides over configuration values', async() => {
                config.accountShortName = 'something';
                config.projectShortName = 'else';

                await router.get('/run', { accountShortName: 'foo', projectShortName: 'bar' });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe('https://forio.com/api/v3/foo/bar/run');

                config.useProjectProxy = false;

                await router.get('/run', { accountShortName: 'foo', projectShortName: 'bar', useProjectProxy: true });
                const req2 = capturedRequests[capturedRequests.length - 1];
                expect(req2.url).toBe('https://forio.com/proxy/foo/bar/api/v3/foo/bar/run');
            });

            it('Should accept configuration from config, router instance, and method overrides', async() => {
                config.accountShortName = 'something';
                router.projectShortName = 'else';

                await router.get('/run', { server: 'https://mydomain.com' });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe('https://mydomain.com/api/v3/something/else/run');
            });

            it('Should not affect subsequent requests', async() => {
                config.accountShortName = ACCOUNT;
                config.projectShortName = PROJECT;

                await router.get('/run', { accountShortName: 'foo', projectShortName: 'bar' });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe('https://forio.com/api/v3/foo/bar/run');

                await router.get('/run');
                const req2 = capturedRequests[capturedRequests.length - 1];
                expect(req2.url).toBe(`https://forio.com/api/v3/${ACCOUNT}/${PROJECT}/run`);
            });
        });
    });

    describe('Network Calls', () => {
        it('Should make a GET call when calling \'get\'', async() => {
            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should make a POST call when calling \'post\'', async() => {
            await router.post('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should make a DELETE call when calling \'delete\'', async() => {
            await router.delete('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should make a PATCH call when calling \'patch\'', async() => {
            await router.patch('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should make a PUT call when calling \'put\'', async() => {
            await router.put('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PUT');
        });
    });
    
    describe('Search Parameters', () => {

        it('Should accept URLSearchParams', async() => {
            router.searchParams = new URLSearchParams('?foo=foo&bar=bar');
            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            expect(search).toBe('foo=foo&bar=bar');
        });

        it('Should accept strings for search parameters', async() => {
            router.searchParams = '?foo=foo&bar=bar';
            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            expect(search).toBe('foo=foo&bar=bar');
        });

        it('Should accept arrayed tuples', async() => {
            router.searchParams = [['foo', 'foo'], ['bar', 'bar']];
            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            expect(search).toBe('foo=foo&bar=bar');
        });

        it('Should accept objects', async() => {
            router.searchParams = { foo: 'foo', bar: 'bar' };
            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            expect(search).toBe('foo=foo&bar=bar');
        });

        it('Should accept objects with arrayed values', async() => {
            router.searchParams = { foo: 'foo', bar: ['bar', 'baz'] };
            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            expect(search).toBe('foo=foo&bar=bar&bar=baz');
        });
    });

    describe('\'with\' Functions', () => {
        it('Should have \'with\' functions for server, project proxy, account, project, and search params', () => {
            expect(typeof router.withServer).toBe('function');
            expect(typeof router.withProjectProxy).toBe('function');
            expect(typeof router.withAccountShortName).toBe('function');
            expect(typeof router.withProjectShortName).toBe('function');
            expect(typeof router.withSearchParams).toBe('function');
        });

        it('Should return the router instance', () => {
            expect(router.withServer()).toBe(router);
            expect(router.withProjectProxy()).toBe(router);
            expect(router.withAccountShortName()).toBe(router);
            expect(router.withProjectShortName()).toBe(router);
            expect(router.withSearchParams()).toBe(router);
        });

        it('Should set any values that are not undefined', async() => {
            router.accountShortName = 'something';
            router.projectShortName = 'else';
            router.withAccountShortName(undefined);
            router.withProjectShortName('');
            expect(router.accountShortName).toBe('something');
            expect(router.projectShortName).toBe('');

            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe('https://forio.com/api/v3/something//run');

            router.accountShortName = 'something';
            router.projectShortName = 'else';
            router.withProjectProxy(true);

            await router.get('/run');
            const req2 = capturedRequests[capturedRequests.length - 1];
            expect(req2.url).toBe('https://forio.com/proxy/something/else/api/v3/something/else/run');

            router.withProjectProxy(false);

            await router.get('/run');
            const req3 = capturedRequests[capturedRequests.length - 1];
            expect(req3.url).toBe('https://forio.com/api/v3/something/else/run');
        });
    });

    describe('Authorization', () => {
        it('Should use a \'Authorization\' header by default if a session exists', async() => {
            await router.get('/run');
            const req1 = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req1.requestHeaders)).toBeFalsy();
            authAdapter.setLocalSession(SESSION);
            await router.get('/run');
            const req2 = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req2.requestHeaders)).toBeTruthy();
        });

        it('Should use the auth token in the session', async() => {
            authAdapter.setLocalSession(SESSION);
            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should support overrides from the config', async() => {
            config.authOverride = 'bananas';
            await router.get('/run');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe('bananas');
        });

        it('Should support includeAuthorization: false', async() => {
            await router.get('/run', { includeAuthorization: false });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBeFalsy();
        });
    });

    describe('Pagination', () => {
        it('Should return payloads with \'prev\', \'next\', and \'all\' functions', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            expect(typeof page.prev).toBe('function');
            expect(typeof page.next).toBe('function');
            expect(typeof page.all).toBe('function');
        });

        it('Should return contain the values for the first page in .values', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            expect(page.values).toEqual(['one', 'two', 'three']);
        });

        it('Should return the next page when calling .next', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            const nextValues = await page.next();
            expect(nextValues).toEqual(['four', 'five', 'six']);
            expect(page.values).toEqual(['four', 'five', 'six']);
        });

        it('Should return the previous page when calling .prev', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            await page.next();
            await page.next();
            const prevValues = await page.prev();
            expect(prevValues).toEqual(['four', 'five', 'six']);
            expect(page.values).toEqual(['four', 'five', 'six']);
        });

        it('Should return all values when calling .all (regardless of what page you\'re currently on)', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            await page.next();
            const allValues = await page.all();
            expect(allValues).toEqual([
                'one', 'two', 'three',
                'four', 'five', 'six',
                'seven', 'eight', 'nine',
                'ten',
            ]);
        });

        it('Should return all values after an index, if one is provided in .all', async() => {
            const MAX = 3;
            const page = await router
                .withSearchParams({ first: 0, max: MAX })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            const allValues = await page.all(MAX);
            expect(allValues).toEqual([
                'four', 'five', 'six',
                'seven', 'eight', 'nine',
                'ten',
            ]);
        });

        it('Should append to an array if one is provided', async() => {
            const MAX = 3;
            const page = await router
                .withSearchParams({ first: 0, max: MAX })
                .get('/pagination', { paginated: true })
                .then(({ body }) => body);

            const allValues = await page.all(MAX, ['foo', 'bar', 'baz']);
            expect(allValues).toEqual([
                'foo', 'bar', 'baz',
                'four', 'five', 'six',
                'seven', 'eight', 'nine',
                'ten',
            ]);
        });

        it('Should use the parsePage function if one is provided', async() => {
            const page = await router
                .withSearchParams({ first: 0, max: 3 })
                .get('/pagination', {
                    paginated: true,
                    parsePage: (strings) => strings.map((s) => s.length),
                })
                .then(({ body }) => body);

            expect(page.values).toEqual(['one'.length, 'two'.length, 'three'.length]);
        });
    });

    describe('Inert Requests', () => {
        it('Should call the errorManager to handle non-inert requests', async() => {
            const handleSpy = vi.spyOn(errorManager, 'handle');
            try {
                await router.get('/unauthorized', { inert: true });
            } catch (error) {
                /* Do nothing, it should error here */
            }
            expect(handleSpy).not.toHaveBeenCalled();

            try {
                await router.get('/unauthorized');
            } catch (error) {
                /* Do nothing, it should error here */
            }
            expect(handleSpy).toHaveBeenCalled();
            handleSpy.mockRestore();
        });
    });
});

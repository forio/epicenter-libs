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
    SCOPE_BOUNDARY,
    GENERIC_OPTIONS,
    createFetchMock,
    testedMethods,
    config,
    authAdapter,
    assetAdapter,
    getFunctionKeys,
} from './common';

describe('assetAdapter', () => {
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
    });

    afterAll(() => {
        mockSetup.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('assetAdapter.create', () => {
        const file = 'test-file.txt';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.WORLD,
            scopeKey: 'WORLD_KEY',
        };

        it('Should do a POST', async () => {
            await assetAdapter.create(file, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should use the asset URL', async () => {
            await assetAdapter.create(file, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.create(file, scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset`);
        });

        it('Should pass the asset details to the request body', async () => {
            const optionals = {
                readLock: 'FACILITATOR',
                writeLock: 'FACILITATOR',
                ttlSeconds: 3600,
            };
            await assetAdapter.create(file, scope, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('file');
            expect(body.file).toBe(file);
            expect(body).toHaveProperty('scope');
            expect(body.scope.scopeBoundary).toBe(scope.scopeBoundary);
            expect(body.scope.scopeKey).toBe(scope.scopeKey);
            expect(body).toHaveProperty('permit');
            expect(body.permit.readLock).toBe(optionals.readLock);
            expect(body.permit.writeLock).toBe(optionals.writeLock);
            expect(body).toHaveProperty('ttlSeconds');
            expect(body.ttlSeconds).toBe(optionals.ttlSeconds);
        });

        it('Should include userKey in scope if provided', async () => {
            const scopeWithUser = {
                ...scope,
                userKey: 'USER_KEY',
            };
            await assetAdapter.create(file, scopeWithUser);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.scope).toHaveProperty('userKey');
            expect(body.scope.userKey).toBe('USER_KEY');
        });

        it('Should include tokenAccessSeconds as query param if provided', async () => {
            await assetAdapter.create(file, scope, { tokenAccessSeconds: 600 });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('tokenAccessSeconds')).toBe('600');
        });

        testedMethods.add('create');
    });

    describe('assetAdapter.update', () => {
        const file = 'test-file.txt';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.WORLD,
            scopeKey: 'WORLD_KEY',
        };

        it('Should do a PATCH', async () => {
            await assetAdapter.update(file, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should use the asset URL', async () => {
            await assetAdapter.update(file, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.update(file, scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset`);
        });

        it('Should pass the asset details to the request body', async () => {
            const optionals = {
                readLock: 'FACILITATOR',
                writeLock: 'FACILITATOR',
                ttlSeconds: 3600,
            };
            await assetAdapter.update(file, scope, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('file');
            expect(body.file).toBe(file);
            expect(body).toHaveProperty('scope');
            expect(body.scope.scopeBoundary).toBe(scope.scopeBoundary);
            expect(body.scope.scopeKey).toBe(scope.scopeKey);
            expect(body).toHaveProperty('permit');
            expect(body.permit.readLock).toBe(optionals.readLock);
            expect(body.permit.writeLock).toBe(optionals.writeLock);
            expect(body).toHaveProperty('ttlSeconds');
            expect(body.ttlSeconds).toBe(optionals.ttlSeconds);
        });

        it('Should include tokenAccessSeconds as query param if provided', async () => {
            await assetAdapter.update(file, scope, { tokenAccessSeconds: 600 });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('tokenAccessSeconds')).toBe('600');
        });

        testedMethods.add('update');
    });

    describe('assetAdapter.remove', () => {
        const assetKey = 'ASSET_KEY';

        it('Should do a DELETE', async () => {
            await assetAdapter.remove(assetKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should use the asset URL with assetKey', async () => {
            await assetAdapter.remove(assetKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/${assetKey}`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.remove(assetKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset/${assetKey}`);
        });

        testedMethods.add('remove');
    });

    describe('assetAdapter.removeFromScope', () => {
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.WORLD,
            scopeKey: 'WORLD_KEY',
        };

        it('Should do a DELETE', async () => {
            await assetAdapter.removeFromScope(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should use the asset/in URL', async () => {
            await assetAdapter.removeFromScope(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/in/${scope.scopeBoundary}/${scope.scopeKey}`);
        });

        it('Should include userKey in URL if provided', async () => {
            const scopeWithUser = {
                ...scope,
                userKey: 'USER_KEY',
            };
            await assetAdapter.removeFromScope(scopeWithUser);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/in/${scope.scopeBoundary}/${scope.scopeKey}/USER_KEY`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.removeFromScope(scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset/in/${scope.scopeBoundary}/${scope.scopeKey}`);
        });

        testedMethods.add('removeFromScope');
    });

    describe('assetAdapter.get', () => {
        const assetKey = 'ASSET_KEY';

        it('Should do a GET', async () => {
            await assetAdapter.get(assetKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the asset URL with assetKey', async () => {
            await assetAdapter.get(assetKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/${assetKey}`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.get(assetKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset/${assetKey}`);
        });

        testedMethods.add('get');
    });

    describe('assetAdapter.list', () => {
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.WORLD,
            scopeKey: 'WORLD_KEY',
        };

        it('Should do a GET', async () => {
            await assetAdapter.list(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the asset/in URL with wildcard filter', async () => {
            await assetAdapter.list(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/in/${scope.scopeBoundary}/${scope.scopeKey}/*`);
        });

        it('Should include userKey in URL if provided', async () => {
            const scopeWithUser = {
                ...scope,
                userKey: 'USER_KEY',
            };
            await assetAdapter.list(scopeWithUser);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/in/${scope.scopeBoundary}/${scope.scopeKey}/USER_KEY/*`);
        });

        it('Should use custom filter if provided', async () => {
            await assetAdapter.list(scope, { filter: '*.txt' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/in/${scope.scopeBoundary}/${scope.scopeKey}/*.txt`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.list(scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset/in/${scope.scopeBoundary}/${scope.scopeKey}/*`);
        });

        testedMethods.add('list');
    });

    describe('assetAdapter.getURL', () => {
        const assetKey = 'ASSET_KEY';

        it('Should do a GET', async () => {
            await assetAdapter.getURL(assetKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the asset/url URL', async () => {
            await assetAdapter.getURL(assetKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/url/${assetKey}`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.getURL(assetKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset/url/${assetKey}`);
        });

        it('Should include tokenAccessSeconds as query param if provided', async () => {
            await assetAdapter.getURL(assetKey, { tokenAccessSeconds: 600 });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('tokenAccessSeconds')).toBe('600');
        });

        testedMethods.add('getURL');
    });

    describe('assetAdapter.getURLWithScope', () => {
        const file = 'test-file.txt';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.WORLD,
            scopeKey: 'WORLD_KEY',
        };

        it('Should do a GET', async () => {
            await assetAdapter.getURLWithScope(file, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the asset/url/with URL', async () => {
            await assetAdapter.getURLWithScope(file, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/url/with/${scope.scopeBoundary}/${scope.scopeKey}/${file}`);
        });

        it('Should include userKey in URL if provided', async () => {
            const scopeWithUser = {
                ...scope,
                userKey: 'USER_KEY',
            };
            await assetAdapter.getURLWithScope(file, scopeWithUser);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/url/with/${scope.scopeBoundary}/${scope.scopeKey}/USER_KEY/${file}`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.getURLWithScope(file, scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset/url/with/${scope.scopeBoundary}/${scope.scopeKey}/${file}`);
        });

        it('Should include tokenAccessSeconds as query param if provided', async () => {
            await assetAdapter.getURLWithScope(file, scope, { tokenAccessSeconds: 600 });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('tokenAccessSeconds')).toBe('600');
        });

        testedMethods.add('getURLWithScope');
    });

    describe('assetAdapter.download', () => {
        const assetKey = 'ASSET_KEY';

        it('Should do a GET', async () => {
            await assetAdapter.download(assetKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the asset/download URL', async () => {
            await assetAdapter.download(assetKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/download/${assetKey}`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.download(assetKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset/download/${assetKey}`);
        });

        it('Should include tokenAccessSeconds as query param if provided', async () => {
            await assetAdapter.download(assetKey, { tokenAccessSeconds: 600 });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('tokenAccessSeconds')).toBe('600');
        });

        testedMethods.add('download');
    });

    describe('assetAdapter.downloadWithScope', () => {
        const file = 'test-file.txt';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.WORLD,
            scopeKey: 'WORLD_KEY',
        };

        it('Should do a GET', async () => {
            await assetAdapter.downloadWithScope(file, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should use the asset/download/with URL', async () => {
            await assetAdapter.downloadWithScope(file, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/download/with/${scope.scopeBoundary}/${scope.scopeKey}/${file}`);
        });

        it('Should include userKey in URL if provided', async () => {
            const scopeWithUser = {
                ...scope,
                userKey: 'USER_KEY',
            };
            await assetAdapter.downloadWithScope(file, scopeWithUser);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/asset/download/with/${scope.scopeBoundary}/${scope.scopeKey}/USER_KEY/${file}`);
        });

        it('Should support generic URL options', async () => {
            await assetAdapter.downloadWithScope(file, scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/asset/download/with/${scope.scopeBoundary}/${scope.scopeKey}/${file}`);
        });

        it('Should include tokenAccessSeconds as query param if provided', async () => {
            await assetAdapter.downloadWithScope(file, scope, { tokenAccessSeconds: 600 });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('tokenAccessSeconds')).toBe('600');
        });

        testedMethods.add('downloadWithScope');
    });

    describe('assetAdapter.store', () => {
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.WORLD,
            scopeKey: 'WORLD_KEY',
        };
        const mockFile = new File(['test content'], 'test-file.txt', { type: 'text/plain' });

        it('Should call create when asset does not exist', async () => {
            const presignedUrl = 'https://presigned.url/upload';
            mockSetup.restore();
            mockSetup = createFetchMock({
                '/asset': {
                    body: { url: presignedUrl },
                    status: 201,
                },
            });
            capturedRequests = mockSetup.capturedRequests;

            await assetAdapter.store(mockFile, scope);

            const createRequest = capturedRequests.find(
                (req) => req.url.includes('/asset') && req.method === 'POST',
            );
            expect(createRequest).toBeDefined();
            expect(createRequest.options.method).toBe('POST');

            const uploadRequest = capturedRequests.find((req) => req.url === presignedUrl);
            expect(uploadRequest).toBeDefined();
            expect(uploadRequest.options.method).toBe('PUT');
        });

        it('Should call update when asset exists and overwrite is true', async () => {
            const presignedUrl = 'https://presigned.url/upload';
            mockSetup.restore();
            mockSetup = createFetchMock();
            capturedRequests = mockSetup.capturedRequests;

            mockSetup.fetchStub.mockImplementation((url, options = {}) => {
                const normalizedOptions = {
                    method: 'GET',
                    headers: {},
                    ...options,
                };
                const requestObject = {
                    url,
                    options: normalizedOptions,
                    method: normalizedOptions.method,
                };
                capturedRequests.push(requestObject);

                if (url.includes('/asset') && options?.method === 'POST') {
                    return Promise.resolve(new Response(JSON.stringify({ error: 'CONFLICT' }), {
                        status: 409,
                        headers: { 'Content-Type': 'application/json' },
                    }));
                }
                if (url.includes('/asset') && options?.method === 'PATCH') {
                    return Promise.resolve(new Response(JSON.stringify({ url: presignedUrl }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }));
                }
                return Promise.resolve(new Response(JSON.stringify({}), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }));
            });

            await assetAdapter.store(mockFile, scope, { overwrite: true });

            const createRequest = capturedRequests.find(
                (req) => req.url.includes('/asset') && req.method === 'POST',
            );
            expect(createRequest).toBeDefined();

            const updateRequest = capturedRequests.find(
                (req) => req.url.includes('/asset') && req.method === 'PATCH',
            );
            expect(updateRequest).toBeDefined();
        });

        it('Should throw error when asset exists and overwrite is false', async () => {
            mockSetup.restore();
            mockSetup = createFetchMock({
                '/asset': {
                    body: { error: 'CONFLICT' },
                    status: 409,
                },
            });
            capturedRequests = mockSetup.capturedRequests;

            await expect(assetAdapter.store(mockFile, scope, { overwrite: false }))
                .rejects
                .toThrow();
        });

        it('Should pass tokenAccessSeconds to create', async () => {
            const presignedUrl = 'https://presigned.url/upload';
            mockSetup.restore();
            mockSetup = createFetchMock({
                '/asset': {
                    body: { url: presignedUrl },
                    status: 201,
                },
            });
            capturedRequests = mockSetup.capturedRequests;

            await assetAdapter.store(mockFile, scope, { tokenAccessSeconds: 600 });

            const createRequest = capturedRequests.find(
                (req) => req.url.includes('/asset') && req.method === 'POST',
            );
            expect(createRequest).toBeDefined();
            const search = createRequest.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('tokenAccessSeconds')).toBe('600');
        });

        it('Should pass readLock, writeLock, and ttlSeconds to create', async () => {
            const presignedUrl = 'https://presigned.url/upload';
            mockSetup.restore();
            mockSetup = createFetchMock({
                '/asset': {
                    body: { url: presignedUrl },
                    status: 201,
                },
            });
            capturedRequests = mockSetup.capturedRequests;

            const optionals = {
                readLock: 'FACILITATOR',
                writeLock: 'FACILITATOR',
                ttlSeconds: 3600,
            };
            await assetAdapter.store(mockFile, scope, optionals);

            const createRequest = capturedRequests.find(
                (req) => req.url.includes('/asset') && req.method === 'POST',
            );
            expect(createRequest).toBeDefined();
            const body = JSON.parse(createRequest.options.body);
            expect(body.permit.readLock).toBe(optionals.readLock);
            expect(body.permit.writeLock).toBe(optionals.writeLock);
            expect(body.ttlSeconds).toBe(optionals.ttlSeconds);
        });

        it('Should use custom fileName if provided', async () => {
            const presignedUrl = 'https://presigned.url/upload';
            const customFileName = 'custom-name.txt';
            mockSetup.restore();
            mockSetup = createFetchMock({
                '/asset': {
                    body: { url: presignedUrl },
                    status: 201,
                },
            });
            capturedRequests = mockSetup.capturedRequests;

            await assetAdapter.store(mockFile, scope, { fileName: customFileName });

            const createRequest = capturedRequests.find(
                (req) => req.url.includes('/asset') && req.method === 'POST',
            );
            expect(createRequest).toBeDefined();
            const body = JSON.parse(createRequest.options.body);
            expect(body.file).toBe(customFileName);
        });

        testedMethods.add('store');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(assetAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

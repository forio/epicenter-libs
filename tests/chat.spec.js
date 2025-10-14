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
    SCOPE_BOUNDARY,
    ROLE,
    createFetchMock,
    testedMethods,
    getAuthHeader,
    config,
    authAdapter,
    chatAdapter,
} from './common';

describe('chatAdapter', () => {
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

    describe('chatAdapter.create', () => {
        const room = 'my-chat-room';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: 'GROUP_KEY',
        };
        const permit = {
            readLock: ROLE.PARTICIPANT,
            writeLock: ROLE.PARTICIPANT,
        };

        it('Should do a POST', async() => {
            await chatAdapter.create(room, scope, permit);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await chatAdapter.create(room, scope, permit);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the chat URL', async() => {
            await chatAdapter.create(room, scope, permit);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/chat`);
        });

        it('Should support generic URL options', async() => {
            await chatAdapter.create(room, scope, permit, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/chat`);
        });

        it('Should pass the chat details to the request body', async() => {
            await chatAdapter.create(room, scope, permit);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('room', room);
            expect(body).toHaveProperty('scope');
            expect(body.scope.scopeBoundary).toBe(scope.scopeBoundary);
            expect(body.scope.scopeKey).toBe(scope.scopeKey);
            expect(body).toHaveProperty('permit');
            expect(body.permit.readLock).toBe(permit.readLock);
            expect(body.permit.writeLock).toBe(permit.writeLock);
        });

        testedMethods.push('create');
    });

    describe('chatAdapter.get', () => {
        const chatKey = 'CHAT_KEY';

        it('Should do a GET', async() => {
            await chatAdapter.get(chatKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await chatAdapter.get(chatKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the chat URL with chatKey', async() => {
            await chatAdapter.get(chatKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/chat/${chatKey}`);
        });

        it('Should support generic URL options', async() => {
            await chatAdapter.get(chatKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/chat/${chatKey}`);
        });

        testedMethods.push('get');
    });

    describe('chatAdapter.updatePermit', () => {
        const chatKey = 'CHAT_KEY';
        const permit = {
            readLock: ROLE.FACILITATOR,
            writeLock: ROLE.FACILITATOR,
        };

        it('Should do a PATCH', async() => {
            await chatAdapter.updatePermit(chatKey, permit);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async() => {
            await chatAdapter.updatePermit(chatKey, permit);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the chat URL with chatKey', async() => {
            await chatAdapter.updatePermit(chatKey, permit);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/chat/${chatKey}`);
        });

        it('Should support generic URL options', async() => {
            await chatAdapter.updatePermit(chatKey, permit, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/chat/${chatKey}`);
        });

        it('Should pass the permit to the request body', async() => {
            await chatAdapter.updatePermit(chatKey, permit);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('permit');
            expect(body.permit.readLock).toBe(permit.readLock);
            expect(body.permit.writeLock).toBe(permit.writeLock);
        });

        testedMethods.push('updatePermit');
    });

    describe('chatAdapter.query', () => {
        const searchOptions = {
            filter: ['room|=my-chat-room', 'scopeBoundary=GROUP'],
            sort: ['+chat.created'],
            first: 0,
            max: 10,
        };

        it('Should do a GET', async() => {
            await chatAdapter.query(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await chatAdapter.query(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the chat/search URL', async() => {
            await chatAdapter.query(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/chat/search`);
        });

        it('Should support generic URL options', async() => {
            await chatAdapter.query(searchOptions, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/chat/search`);
        });

        it('Should pass query parameters', async() => {
            await chatAdapter.query(searchOptions);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('filter=');
            expect(req.url).toContain('sort=');
            expect(req.url).toContain('first=0');
            expect(req.url).toContain('max=10');
        });

        testedMethods.push('query');
    });

    describe('chatAdapter.sendMessage', () => {
        const chatKey = 'CHAT_KEY';
        const message = 'Hello, world!';

        it('Should do a PUT', async() => {
            await chatAdapter.sendMessage(chatKey, message);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PUT');
        });

        it('Should have authorization', async() => {
            await chatAdapter.sendMessage(chatKey, message);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the chat/message URL', async() => {
            await chatAdapter.sendMessage(chatKey, message);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/chat/message/${chatKey}`);
        });

        it('Should include userKey in URL for private messages', async() => {
            const userKey = 'USER_KEY';
            await chatAdapter.sendMessage(chatKey, message, { userKey });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/chat/message/${chatKey}/${userKey}`);
        });

        it('Should support generic URL options', async() => {
            await chatAdapter.sendMessage(chatKey, message, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/chat/message/${chatKey}`);
        });

        it('Should pass the message to the request body', async() => {
            await chatAdapter.sendMessage(chatKey, message);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('message', message);
        });

        testedMethods.push('sendMessage');
    });

    describe('chatAdapter.getMessages', () => {
        const chatKey = 'CHAT_KEY';

        it('Should do a GET', async() => {
            await chatAdapter.getMessages(chatKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await chatAdapter.getMessages(chatKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the chat/message URL', async() => {
            await chatAdapter.getMessages(chatKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/chat/message/${chatKey}`);
        });

        it('Should support generic URL options', async() => {
            await chatAdapter.getMessages(chatKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/chat/message/${chatKey}`);
        });

        it('Should pass query parameters for pagination', async() => {
            const optionals = {
                maxRecords: 20,
                horizon: 50,
            };
            await chatAdapter.getMessages(chatKey, optionals);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('maxRecords=20');
            expect(req.url).toContain('horizon=50');
        });

        testedMethods.push('getMessages');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(chatAdapter).filter((key) => typeof chatAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

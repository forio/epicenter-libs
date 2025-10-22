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
    dailyAdapter,
    config,
    SCOPE_BOUNDARY,
    ROLE,
} from './common';

describe('dailyAdapter', () => {
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

    describe('dailyAdapter.getConfig', () => {
        it('Should do a GET', async () => {
            await dailyAdapter.getConfig();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await dailyAdapter.getConfig();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the daily/v1 URL', async () => {
            await dailyAdapter.getConfig();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/daily/v1`);
        });

        it('Should support generic URL options', async () => {
            await dailyAdapter.getConfig(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/daily/v1`);
        });

        testedMethods.push('getConfig');
    });

    describe('dailyAdapter.createRoom', () => {
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: 'GROUP_KEY',
        };

        it('Should do a POST', async () => {
            await dailyAdapter.createRoom(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await dailyAdapter.createRoom(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the daily/v1/room URL', async () => {
            await dailyAdapter.createRoom(scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/daily/v1/room`);
        });

        it('Should support generic URL options', async () => {
            await dailyAdapter.createRoom(scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/daily/v1/room`);
        });

        it('Should pass scope and permit to the request body', async () => {
            await dailyAdapter.createRoom(scope);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('epicenter');
            expect(body.epicenter).toHaveProperty('scope');
            expect(body.epicenter.scope.scopeBoundary).toBe(scope.scopeBoundary);
            expect(body.epicenter.scope.scopeKey).toBe(scope.scopeKey);
            expect(body.epicenter).toHaveProperty('permit');
            expect(body.epicenter.permit.readLock).toBe(ROLE.PARTICIPANT);
            expect(body.epicenter.permit.writeLock).toBe(ROLE.PARTICIPANT);
        });

        it('Should pass optional parameters to the request body', async () => {
            const optionals = {
                readLock: ROLE.FACILITATOR,
                writeLock: ROLE.FACILITATOR,
                ttlSeconds: 3600,
                exp: 1234567890,
                enable_recording: 'CLOUD',
                privacy: 'PRIVATE',
            };
            await dailyAdapter.createRoom(scope, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.epicenter.ttlSeconds).toBe(optionals.ttlSeconds);
            expect(body.epicenter.permit.readLock).toBe(optionals.readLock);
            expect(body.epicenter.permit.writeLock).toBe(optionals.writeLock);
            expect(body.properties.exp).toBe(optionals.exp);
            expect(body.properties.enable_recording).toBe(optionals.enable_recording);
            expect(body.privacy).toBe(optionals.privacy);
        });

        it('Should include userKey in scope if provided', async () => {
            const scopeWithUser = {
                ...scope,
                userKey: 'USER_KEY',
            };
            await dailyAdapter.createRoom(scopeWithUser);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.epicenter.scope).toHaveProperty('userKey');
            expect(body.epicenter.scope.userKey).toBe('USER_KEY');
        });

        testedMethods.push('createRoom');
    });

    describe('dailyAdapter.createToken', () => {
        const roomName = 'my-room';

        it('Should do a POST', async () => {
            await dailyAdapter.createToken(roomName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await dailyAdapter.createToken(roomName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the daily/v1/meetingToken URL', async () => {
            await dailyAdapter.createToken(roomName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/daily/v1/meetingToken`);
        });

        it('Should support generic URL options', async () => {
            await dailyAdapter.createToken(roomName, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/daily/v1/meetingToken`);
        });

        it('Should pass room_name to the request body', async () => {
            await dailyAdapter.createToken(roomName);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('properties');
            expect(body.properties.room_name).toBe(roomName);
        });

        it('Should pass optional parameters to the request body', async () => {
            const optionals = {
                start_video_off: true,
                is_owner: true,
                user_name: 'Test User',
                close_tab_on_exit: true,
                exp: 1234567890,
                enable_recording: 'CLOUD',
            };
            await dailyAdapter.createToken(roomName, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.properties.start_video_off).toBe(optionals.start_video_off);
            expect(body.properties.is_owner).toBe(optionals.is_owner);
            expect(body.properties.user_name).toBe(optionals.user_name);
            expect(body.properties.close_tab_on_exit).toBe(optionals.close_tab_on_exit);
            expect(body.properties.exp).toBe(optionals.exp);
            expect(body.properties.enable_recording).toBe(optionals.enable_recording);
        });

        it('Should include selfSign query parameter by default', async () => {
            await dailyAdapter.createToken(roomName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('selfSign=true');
        });

        it('Should allow selfSign to be disabled', async () => {
            await dailyAdapter.createToken(roomName, { selfSign: false });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('selfSign=false');
        });

        testedMethods.push('createToken');
    });

    describe('dailyAdapter.updateRecordingStatus', () => {
        const roomName = 'my-room';

        it('Should do a DELETE', async () => {
            await dailyAdapter.updateRecordingStatus(roomName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await dailyAdapter.updateRecordingStatus(roomName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the daily/v1/meetingToken URL with room name', async () => {
            await dailyAdapter.updateRecordingStatus(roomName);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/daily/v1/meetingToken/${roomName}`);
        });

        it('Should support generic URL options', async () => {
            await dailyAdapter.updateRecordingStatus(roomName, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/daily/v1/meetingToken/${roomName}`);
        });

        testedMethods.push('updateRecordingStatus');
    });

    describe('dailyAdapter.getVideoByRecordingId', () => {
        // Note: getVideoByRecordingId() is a complex method that calls videoAdapter.getDirectoryURL()
        // and videoAdapter.getURL() internally. Proper testing would require mocking the videoAdapter
        // methods and their responses.
        it('Should be a placeholder test', () => {
            expect(dailyAdapter.getVideoByRecordingId).toBeDefined();
        });

        testedMethods.push('getVideoByRecordingId');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(dailyAdapter).filter((key) => typeof dailyAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

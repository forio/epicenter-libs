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
    getAuthHeader,
    testedMethods,
    config,
    authAdapter,
    vonageAdapter,
    SCOPE_BOUNDARY,
    ROLE,
} from './common';

describe('vonageAdapter', () => {
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

    describe('vonageAdapter.getProjectID', () => {
        it('Should do a GET', async () => {
            await vonageAdapter.getProjectID();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await vonageAdapter.getProjectID();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vonage/info URL', async () => {
            await vonageAdapter.getProjectID();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vonage/info`);
        });

        it('Should support generic URL options', async () => {
            await vonageAdapter.getProjectID(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vonage/info`);
        });

        testedMethods.push('getProjectID');
    });

    describe('vonageAdapter.createSession', () => {
        it('Should do a GET', async () => {
            await vonageAdapter.createSession();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await vonageAdapter.createSession();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vonage/session URL', async () => {
            await vonageAdapter.createSession();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vonage/session`);
        });

        it('Should support generic URL options', async () => {
            await vonageAdapter.createSession(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vonage/session`);
        });

        testedMethods.push('createSession');
    });

    describe('vonageAdapter.generateToken', () => {
        const sessionID = '2_MX40NzQwNjQ5Mn5-MTU2MDA0OTY1NjQ2OH5Y1TnZ-fg';

        it('Should do a POST', async () => {
            await vonageAdapter.generateToken(sessionID);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await vonageAdapter.generateToken(sessionID);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vonage/token URL', async () => {
            await vonageAdapter.generateToken(sessionID);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vonage/token`);
        });

        it('Should support generic URL options', async () => {
            await vonageAdapter.generateToken(sessionID, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vonage/token`);
        });

        it('Should include sessionId in the request body', async () => {
            await vonageAdapter.generateToken(sessionID);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.sessionId).toBe(sessionID);
        });

        it('Should include initialLayoutClassList placeholder in the request body', async () => {
            await vonageAdapter.generateToken(sessionID);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.initialLayoutClassList).toEqual(['placeholder']);
        });

        testedMethods.push('generateToken');
    });

    describe('vonageAdapter.startArchive', () => {
        const archiveName = 'my-archive';
        const sessionID = '2_MX40NzQwNjQ5Mn5-MTU2MDA0OTY1NjQ2OH5Y1TnZ-fg';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: SESSION.groupKey,
        };

        it('Should do a POST', async () => {
            await vonageAdapter.startArchive(archiveName, sessionID, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await vonageAdapter.startArchive(archiveName, sessionID, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vonage/archive URL', async () => {
            await vonageAdapter.startArchive(archiveName, sessionID, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vonage/archive`);
        });

        it('Should support generic URL options', async () => {
            await vonageAdapter.startArchive(archiveName, sessionID, scope, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vonage/archive`);
        });

        it('Should include name, sessionId, and scope in the request body', async () => {
            await vonageAdapter.startArchive(archiveName, sessionID, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.name).toBe(archiveName);
            expect(body.sessionId).toBe(sessionID);
            expect(body.scope).toEqual(scope);
        });

        it('Should default permit readLock and writeLock to PARTICIPANT when no userKey', async () => {
            await vonageAdapter.startArchive(archiveName, sessionID, scope);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.permit.readLock).toBe(ROLE.PARTICIPANT);
            expect(body.permit.writeLock).toBe(ROLE.PARTICIPANT);
        });

        it('Should default permit readLock and writeLock to USER when userKey is provided', async () => {
            const scopeWithUser = { ...scope, userKey: SESSION.userKey };
            await vonageAdapter.startArchive(archiveName, sessionID, scopeWithUser);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.permit.readLock).toBe(ROLE.USER);
            expect(body.permit.writeLock).toBe(ROLE.USER);
        });

        it('Should allow custom readLock and writeLock', async () => {
            await vonageAdapter.startArchive(archiveName, sessionID, scope, {
                readLock: ROLE.FACILITATOR,
                writeLock: ROLE.FACILITATOR,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.permit.readLock).toBe(ROLE.FACILITATOR);
            expect(body.permit.writeLock).toBe(ROLE.FACILITATOR);
        });

        it('Should include optional ttlSeconds in the request body', async () => {
            const ttlSeconds = 3600;
            await vonageAdapter.startArchive(archiveName, sessionID, scope, { ttlSeconds });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.ttlSeconds).toBe(ttlSeconds);
        });

        it('Should include optional resolution in the request body', async () => {
            const resolution = '1920x1080';
            await vonageAdapter.startArchive(archiveName, sessionID, scope, { resolution });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.resolution).toBe(resolution);
        });

        testedMethods.push('startArchive');
    });

    describe('vonageAdapter.stopArchive', () => {
        const archiveID = '004355e0-6ed1-4f45-8a32-ede770e39';

        it('Should do a DELETE', async () => {
            await vonageAdapter.stopArchive(archiveID);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await vonageAdapter.stopArchive(archiveID);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the vonage/archive URL with archiveID', async () => {
            await vonageAdapter.stopArchive(archiveID);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/vonage/archive/${archiveID}`);
        });

        it('Should support generic URL options', async () => {
            await vonageAdapter.stopArchive(archiveID, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/vonage/archive/${archiveID}`);
        });

        testedMethods.push('stopArchive');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(vonageAdapter).filter(key => typeof vonageAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

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
    createFetchMock,
    GENERIC_OPTIONS,
    testedMethods,
    config,
    authAdapter,
    fileAdapter,
    getAuthHeader,
    getFunctionKeys,
} from './common';

describe('fileAdapter', () => {
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

    describe('fileAdapter.list', () => {
        it('Should do a GET', async () => {
            await fileAdapter.list();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await fileAdapter.list();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file URL when no filePath is given', async () => {
            await fileAdapter.list();
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file`);
        });

        it('Should use the /file/{filePath} URL when a filePath is given', async () => {
            await fileAdapter.list('models/src');
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/models/src`);
        });

        it('Should pass depth as a query parameter', async () => {
            await fileAdapter.list(undefined, { depth: 3 });
            const req = capturedRequests[capturedRequests.length - 1];
            const searchParams = new URLSearchParams(req.url.split('?')[1]);
            expect(searchParams.get('depth')).toBe('3');
        });

        it('Should omit depth when it is not provided', async () => {
            await fileAdapter.list('models/src');
            const req = capturedRequests[capturedRequests.length - 1];
            const searchParams = new URLSearchParams(req.url.split('?')[1]);
            expect(searchParams.has('depth')).toBe(false);
        });

        it('Should URL-encode reserved characters per path segment while keeping separators', async () => {
            await fileAdapter.list('my models/final report (v2).py');
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/my%20models/final%20report%20(v2).py`);
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.list(undefined, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            const url = req.url.split('?')[0];
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file`);
        });

        testedMethods.add('list');
    });

    describe('fileAdapter.upload', () => {
        const FORM_DATA = new FormData();

        it('Should do a PUT', async () => {
            await fileAdapter.upload(FORM_DATA);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PUT');
        });

        it('Should have authorization', async () => {
            await fileAdapter.upload(FORM_DATA);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file URL when no filePath is given', async () => {
            await fileAdapter.upload(FORM_DATA);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file`);
        });

        it('Should use the /file/{filePath} URL when a filePath is given', async () => {
            await fileAdapter.upload(FORM_DATA, 'models/model.py');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/models/model.py`);
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.upload(FORM_DATA, undefined, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file`);
        });

        testedMethods.add('upload');
    });

    describe('fileAdapter.create', () => {
        const FORM_DATA = new FormData();

        it('Should do a POST', async () => {
            await fileAdapter.create(FORM_DATA);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await fileAdapter.create(FORM_DATA);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file URL when no filePath is given', async () => {
            await fileAdapter.create(FORM_DATA);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file`);
        });

        it('Should use the /file/{filePath} URL when a filePath is given', async () => {
            await fileAdapter.create(FORM_DATA, 'models/model.py');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/models/model.py`);
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.create(FORM_DATA, undefined, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file`);
        });

        testedMethods.add('create');
    });

    describe('fileAdapter.remove', () => {
        it('Should do a DELETE', async () => {
            await fileAdapter.remove();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await fileAdapter.remove();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file URL when no filePath is given', async () => {
            await fileAdapter.remove();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file`);
        });

        it('Should use the /file/{filePath} URL when a filePath is given', async () => {
            await fileAdapter.remove('models/old.py');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/models/old.py`);
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.remove(undefined, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file`);
        });

        testedMethods.add('remove');
    });

    describe('fileAdapter.download', () => {
        const FILE_PATH = 'models/model.py';

        it('Should do a GET', async () => {
            await fileAdapter.download(FILE_PATH);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await fileAdapter.download(FILE_PATH);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file/download/{filePath} URL', async () => {
            await fileAdapter.download(FILE_PATH);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/download/${FILE_PATH}`);
        });

        it('Should pass depth as a query parameter', async () => {
            await fileAdapter.download(FILE_PATH, { depth: 2 });
            const req = capturedRequests[capturedRequests.length - 1];
            const searchParams = new URLSearchParams(req.url.split('?')[1]);
            expect(searchParams.get('depth')).toBe('2');
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.download(FILE_PATH, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            const url = req.url.split('?')[0];
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file/download/${FILE_PATH}`);
        });

        testedMethods.add('download');
    });

    describe('fileAdapter.listByFilter', () => {
        const FILTER = '*.py';

        it('Should do a GET', async () => {
            await fileAdapter.listByFilter(FILTER);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await fileAdapter.listByFilter(FILTER);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file/filter/{filter} URL when no filePath is given', async () => {
            await fileAdapter.listByFilter(FILTER);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/filter/${FILTER}`);
        });

        it('Should use the /file/filter/{filter}/{filePath} URL when a filePath is given', async () => {
            await fileAdapter.listByFilter(FILTER, 'models');
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/filter/${FILTER}/models`);
        });

        it('Should pass depth as a query parameter', async () => {
            await fileAdapter.listByFilter(FILTER, undefined, { depth: 1 });
            const req = capturedRequests[capturedRequests.length - 1];
            const searchParams = new URLSearchParams(req.url.split('?')[1]);
            expect(searchParams.get('depth')).toBe('1');
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.listByFilter(FILTER, undefined, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            const url = req.url.split('?')[0];
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file/filter/${FILTER}`);
        });

        testedMethods.add('listByFilter');
    });

    describe('fileAdapter.compress', () => {
        it('Should do a PATCH', async () => {
            await fileAdapter.compress();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await fileAdapter.compress();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file/compress URL when no filePath is given', async () => {
            await fileAdapter.compress();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/compress`);
        });

        it('Should use the /file/compress/{filePath} URL when a filePath is given', async () => {
            await fileAdapter.compress('models');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/compress/models`);
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.compress(undefined, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file/compress`);
        });

        testedMethods.add('compress');
    });

    describe('fileAdapter.explode', () => {
        it('Should do a PATCH', async () => {
            await fileAdapter.explode();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await fileAdapter.explode();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file/explode URL when no filePath is given', async () => {
            await fileAdapter.explode();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/explode`);
        });

        it('Should use the /file/explode/{filePath} URL when a filePath is given', async () => {
            await fileAdapter.explode('archive.zip');
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/explode/archive.zip`);
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.explode(undefined, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file/explode`);
        });

        testedMethods.add('explode');
    });

    describe('fileAdapter.move', () => {
        const ORIGIN = 'models/old.py';
        const DESTINATION = 'models/new.py';

        it('Should do a PATCH', async () => {
            await fileAdapter.move(ORIGIN, DESTINATION);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await fileAdapter.move(ORIGIN, DESTINATION);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file/move URL', async () => {
            await fileAdapter.move(ORIGIN, DESTINATION);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/move`);
        });

        it('Should pass origin and destination in the request body', async () => {
            await fileAdapter.move(ORIGIN, DESTINATION);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.origin).toBe(ORIGIN);
            expect(body.destination).toBe(DESTINATION);
        });

        it('Should pass includeOrigin in the request body when provided', async () => {
            await fileAdapter.move(ORIGIN, DESTINATION, { includeOrigin: true });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.includeOrigin).toBe(true);
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.move(ORIGIN, DESTINATION, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file/move`);
        });

        testedMethods.add('move');
    });

    describe('fileAdapter.createDirectory', () => {
        const DIR_PATH = 'models/new-folder';

        it('Should do a POST', async () => {
            await fileAdapter.createDirectory(DIR_PATH);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await fileAdapter.createDirectory(DIR_PATH);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /file/directory/{filePath} URL', async () => {
            await fileAdapter.createDirectory(DIR_PATH);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/file/directory/${DIR_PATH}`);
        });

        it('Should support generic URL options', async () => {
            await fileAdapter.createDirectory(DIR_PATH, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/file/directory/${DIR_PATH}`);
        });

        testedMethods.add('createDirectory');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(fileAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

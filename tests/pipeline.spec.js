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
    pipelineAdapter,
    getAuthHeader,
    getFunctionKeys,
} from './common';

describe('pipelineAdapter', () => {
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

    describe('pipelineAdapter.getImages', () => {
        it('Should do a GET', async () => {
            await pipelineAdapter.getImages();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await pipelineAdapter.getImages();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /pipeline/npm/images URL', async () => {
            await pipelineAdapter.getImages();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/pipeline/npm/images`);
        });

        it('Should support generic URL options', async () => {
            await pipelineAdapter.getImages(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/pipeline/npm/images`);
        });

        testedMethods.add('getImages');
    });

    describe('pipelineAdapter.execute', () => {
        const OPERATIONS = [
            { objectType: 'clean' },
            { objectType: 'git', password: 'mytoken', force: false, confirmed: true },
            { objectType: 'npm', nodeVersion: '18', timeoutMinutes: 10, directory: 'src', commands: ['install', 'build'] },
        ];

        it('Should do a POST', async () => {
            await pipelineAdapter.execute(OPERATIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await pipelineAdapter.execute(OPERATIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /pipeline/execute URL', async () => {
            await pipelineAdapter.execute(OPERATIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/pipeline/execute`);
        });

        it('Should support generic URL options', async () => {
            await pipelineAdapter.execute(OPERATIONS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/pipeline/execute`);
        });

        it('Should pass operations in the request body', async () => {
            await pipelineAdapter.execute(OPERATIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.operations).toEqual(OPERATIONS);
        });

        it('Should pass log in the request body when provided', async () => {
            const LOG = 'my-build-log';
            await pipelineAdapter.execute(OPERATIONS, { log: LOG });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.log).toBe(LOG);
        });

        it('Should support a copy operation with items', async () => {
            const COPY_OPERATIONS = [
                {
                    objectType: 'copy',
                    items: [{ location: 'src', from: 'a', to: 'b' }],
                },
            ];
            await pipelineAdapter.execute(COPY_OPERATIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.operations).toEqual(COPY_OPERATIONS);
        });

        testedMethods.add('execute');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(pipelineAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

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
    powerpointAdapter,
    authAdapter,
    config,
    getFunctionKeys,
} from './common';

describe('powerpointAdapter', () => {
    let capturedRequests = [];
    let mockSetup;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    const TEMPLATE_DIRECTORY = 'MODEL';
    const TEMPLATE_PATH = 'en-US-debrief-template.pptx';
    const DOCUMENT_SHADOW = {
        output: 'debrief-slides.pptx',
        environment: {},
        slides: [
            {
                number: 1,
                environment: {
                    tables: [
                        {
                            name: 'Leaderboard',
                            data: [['Rank', 'Name', 'Score']],
                        },
                    ],
                },
            },
        ],
    };

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

    describe('powerpointAdapter.generate', () => {
        it('Should do a PUT', async () => {
            await powerpointAdapter.generate(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PUT');
        });

        it('Should have authorization', async () => {
            await powerpointAdapter.generate(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the powerpoint/templateDirectory/templatePath URL', async () => {
            await powerpointAdapter.generate(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/powerpoint/${TEMPLATE_DIRECTORY}/${TEMPLATE_PATH}`);
        });

        it('Should support generic URL options', async () => {
            await powerpointAdapter.generate(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/powerpoint/${TEMPLATE_DIRECTORY}/${TEMPLATE_PATH}`);
        });

        it('Should send the document shadow in the request body', async () => {
            await powerpointAdapter.generate(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(DOCUMENT_SHADOW);
        });

        it('Should support DATA as a template directory', async () => {
            await powerpointAdapter.generate('DATA', TEMPLATE_PATH, DOCUMENT_SHADOW);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain('/powerpoint/DATA/');
        });

        testedMethods.add('generate');
    });

    describe('powerpointAdapter.stream', () => {
        it('Should do a POST', async () => {
            await powerpointAdapter.stream(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await powerpointAdapter.stream(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the powerpoint/templateDirectory/templatePath URL', async () => {
            await powerpointAdapter.stream(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/powerpoint/${TEMPLATE_DIRECTORY}/${TEMPLATE_PATH}`);
        });

        it('Should support generic URL options', async () => {
            await powerpointAdapter.stream(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/powerpoint/${TEMPLATE_DIRECTORY}/${TEMPLATE_PATH}`);
        });

        it('Should send the document shadow in the request body', async () => {
            await powerpointAdapter.stream(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(DOCUMENT_SHADOW);
        });

        it('Should pass custom headers when provided', async () => {
            const customHeaders = { 'X-Custom-Header': 'test-value' };
            await powerpointAdapter.stream(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW, { headers: customHeaders });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.requestHeaders['X-Custom-Header']).toBe('test-value');
        });

        it('Should return a raw Response', async () => {
            const result = await powerpointAdapter.stream(TEMPLATE_DIRECTORY, TEMPLATE_PATH, DOCUMENT_SHADOW);
            expect(result).toBeInstanceOf(Response);
        });

        testedMethods.add('stream');
    });

    it('Should not have any untested methods', () => {
        const actualMethods = getFunctionKeys(powerpointAdapter);
        expect(actualMethods).toEqual(testedMethods);
    });
});

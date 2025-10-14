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
    videoAdapter,
    SCOPE_BOUNDARY,
} from './common';

describe('videoAdapter', () => {
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

    describe('videoAdapter.remove', () => {
        const videoKey = '0000017e31bb902cfe17615867d5005c5d5f';

        it('Should do a DELETE', async() => {
            await videoAdapter.remove(videoKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async() => {
            await videoAdapter.remove(videoKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the video URL with videoKey', async() => {
            await videoAdapter.remove(videoKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/${videoKey}`);
        });

        it('Should support generic URL options', async() => {
            await videoAdapter.remove(videoKey, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/video/${videoKey}`);
        });

        testedMethods.push('remove');
    });

    describe('videoAdapter.query', () => {
        it('Should do a GET', async() => {
            await videoAdapter.query({});
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async() => {
            await videoAdapter.query({});
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the video/search URL', async() => {
            await videoAdapter.query({});
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/search`);
        });

        it('Should support generic URL options', async() => {
            await videoAdapter.query({}, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toContain(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/video/search`);
        });

        it('Should include filter in query params', async() => {
            await videoAdapter.query({ filter: ['affiliate=VONAGE'] });
            const req = capturedRequests[capturedRequests.length - 1];
            const urlObj = new URL(req.url);
            expect(urlObj.searchParams.get('filter')).toBe('affiliate=VONAGE');
        });

        it('Should include sort in query params', async() => {
            await videoAdapter.query({ sort: ['-created', 'family'] });
            const req = capturedRequests[capturedRequests.length - 1];
            const urlObj = new URL(req.url);
            expect(urlObj.searchParams.get('sort')).toBe('-created;family');
        });

        it('Should include first and max in query params', async() => {
            await videoAdapter.query({ first: 10, max: 20 });
            const req = capturedRequests[capturedRequests.length - 1];
            const urlObj = new URL(req.url);
            expect(urlObj.searchParams.get('first')).toBe('10');
            expect(urlObj.searchParams.get('max')).toBe('20');
        });

        testedMethods.push('query');
    });

    describe('videoAdapter.getURL', () => {
        const file = 'archive.mp4';
        const videoKey = '0000017e31bb902cfe17615867d5005c5d5f';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: SESSION.groupKey,
        };

        describe('with videoKey', () => {
            it('Should do a GET', async() => {
                await videoAdapter.getURL(file, { videoKey });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.options.method.toUpperCase()).toBe('GET');
            });

            it('Should have authorization', async() => {
                await videoAdapter.getURL(file, { videoKey });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
            });

            it('Should use the video/url URL with videoKey and file', async() => {
                await videoAdapter.getURL(file, { videoKey });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/url/${videoKey}/${file}`);
            });

            it('Should support generic URL options', async() => {
                await videoAdapter.getURL(file, { videoKey, ...GENERIC_OPTIONS });
                const req = capturedRequests[capturedRequests.length - 1];
                const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
                expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/video/url/${videoKey}/${file}`);
            });
        });

        describe('with scope/affiliate/family', () => {
            const affiliate = 'VONAGE';
            const family = 'archiveName';

            it('Should do a GET', async() => {
                await videoAdapter.getURL(file, { scope, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.options.method.toUpperCase()).toBe('GET');
            });

            it('Should have authorization', async() => {
                await videoAdapter.getURL(file, { scope, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
            });

            it('Should use the video/url/with URL with scope, affiliate, family, and file', async() => {
                await videoAdapter.getURL(file, { scope, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/url/with/${scope.scopeBoundary}/${scope.scopeKey}/${affiliate}/${family}/${file}`);
            });

            it('Should include userKey in URL when provided', async() => {
                const scopeWithUser = { ...scope, userKey: SESSION.userKey };
                await videoAdapter.getURL(file, { scope: scopeWithUser, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/url/with/${scope.scopeBoundary}/${scope.scopeKey}/${SESSION.userKey}/${affiliate}/${family}/${file}`);
            });

            it('Should support generic URL options', async() => {
                await videoAdapter.getURL(file, { scope, affiliate, family, ...GENERIC_OPTIONS });
                const req = capturedRequests[capturedRequests.length - 1];
                const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
                expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/video/url/with/${scope.scopeBoundary}/${scope.scopeKey}/${affiliate}/${family}/${file}`);
            });
        });

        it('Should throw error when neither videoKey nor scope/affiliate/family are provided', async() => {
            await expect(videoAdapter.getURL(file, {})).rejects.toThrow('Cannot get video URL -- either a video key or scope/affiliate/family specification is required.');
        });

        testedMethods.push('getURL');
    });

    describe('videoAdapter.getDirectoryURL', () => {
        const videoKey = '0000017e31bb902cfe17615867d5005c5d5f';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: SESSION.groupKey,
        };

        describe('with videoKey', () => {
            it('Should do a GET', async() => {
                await videoAdapter.getDirectoryURL({ videoKey });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.options.method.toUpperCase()).toBe('GET');
            });

            it('Should have authorization', async() => {
                await videoAdapter.getDirectoryURL({ videoKey });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
            });

            it('Should use the video/url URL with videoKey', async() => {
                await videoAdapter.getDirectoryURL({ videoKey });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/url/${videoKey}`);
            });

            it('Should support generic URL options', async() => {
                await videoAdapter.getDirectoryURL({ videoKey, ...GENERIC_OPTIONS });
                const req = capturedRequests[capturedRequests.length - 1];
                const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
                expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/video/url/${videoKey}`);
            });
        });

        describe('with scope/affiliate/family', () => {
            const affiliate = 'VONAGE';
            const family = 'archiveName';

            it('Should do a GET', async() => {
                await videoAdapter.getDirectoryURL({ scope, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.options.method.toUpperCase()).toBe('GET');
            });

            it('Should have authorization', async() => {
                await videoAdapter.getDirectoryURL({ scope, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
            });

            it('Should use the video/dir/with URL with scope, affiliate, and family', async() => {
                await videoAdapter.getDirectoryURL({ scope, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/dir/with/${scope.scopeBoundary}/${scope.scopeKey}/${affiliate}/${family}`);
            });

            it('Should include userKey in URL when provided', async() => {
                const scopeWithUser = { ...scope, userKey: SESSION.userKey };
                await videoAdapter.getDirectoryURL({ scope: scopeWithUser, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/dir/with/${scope.scopeBoundary}/${scope.scopeKey}/${SESSION.userKey}/${affiliate}/${family}`);
            });

            it('Should support generic URL options', async() => {
                await videoAdapter.getDirectoryURL({ scope, affiliate, family, ...GENERIC_OPTIONS });
                const req = capturedRequests[capturedRequests.length - 1];
                const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
                expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/video/dir/with/${scope.scopeBoundary}/${scope.scopeKey}/${affiliate}/${family}`);
            });
        });

        it('Should throw error when neither videoKey nor scope/affiliate/family are provided', async() => {
            await expect(videoAdapter.getDirectoryURL({})).rejects.toThrow('Cannot get video URL -- either a video key or scope/affiliate/family specification is required.');
        });

        testedMethods.push('getDirectoryURL');
    });

    describe('videoAdapter.processVideo', () => {
        const videoKey = '0000017e31bb902cfe17615867d5005c5d5f';
        const processors = [
            {
                mediaFormat: 'mp4',
                languageCode: 'en-US',
                objectType: 'transcription',
                mediaFile: 'archive.mp4',
                jobName: 'test-transcription',
            },
        ];

        it('Should do a POST', async() => {
            await videoAdapter.processVideo(videoKey, processors);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async() => {
            await videoAdapter.processVideo(videoKey, processors);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the video/execute URL with videoKey', async() => {
            await videoAdapter.processVideo(videoKey, processors);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/execute/${videoKey}`);
        });

        it('Should support generic URL options', async() => {
            await videoAdapter.processVideo(videoKey, processors, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/video/execute/${videoKey}`);
        });

        it('Should include processors in the request body', async() => {
            await videoAdapter.processVideo(videoKey, processors);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.processors).toEqual(processors);
        });

        it('Should include optional log in the request body', async() => {
            const logFile = 'processing.log';
            await videoAdapter.processVideo(videoKey, processors, { log: logFile });
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.log).toBe(logFile);
        });

        it('Should handle multiple processors', async() => {
            const multipleProcessors = [
                {
                    mediaFormat: 'mp4',
                    languageCode: 'en-US',
                    objectType: 'transcription',
                    mediaFile: 'archive1.mp4',
                    jobName: 'transcription-1',
                },
                {
                    mediaFormat: 'mp3',
                    languageCode: 'es-ES',
                    objectType: 'transcription',
                    mediaFile: 'archive2.mp3',
                    jobName: 'transcription-2',
                    timeoutMinutes: 5,
                },
            ];
            await videoAdapter.processVideo(videoKey, multipleProcessors);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.processors).toEqual(multipleProcessors);
            expect(body.processors.length).toBe(2);
        });

        testedMethods.push('processVideo');
    });

    describe('videoAdapter.download', () => {
        const file = 'archive.mp4';
        const videoKey = '0000017e31bb902cfe17615867d5005c5d5f';
        const scope = {
            scopeBoundary: SCOPE_BOUNDARY.GROUP,
            scopeKey: SESSION.groupKey,
        };

        describe('with videoKey', () => {
            it('Should do a GET', async() => {
                await videoAdapter.download(file, { videoKey });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.options.method.toUpperCase()).toBe('GET');
            });

            it('Should have authorization', async() => {
                await videoAdapter.download(file, { videoKey });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
            });

            it('Should use the video/download URL with videoKey and file', async() => {
                await videoAdapter.download(file, { videoKey });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/download/${videoKey}/${file}`);
            });

            it('Should support generic URL options', async() => {
                await videoAdapter.download(file, { videoKey, ...GENERIC_OPTIONS });
                const req = capturedRequests[capturedRequests.length - 1];
                const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
                expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/video/download/${videoKey}/${file}`);
            });
        });

        describe('with scope/affiliate/family', () => {
            const affiliate = 'VONAGE';
            const family = 'archiveName';

            it('Should do a GET', async() => {
                await videoAdapter.download(file, { scope, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.options.method.toUpperCase()).toBe('GET');
            });

            it('Should have authorization', async() => {
                await videoAdapter.download(file, { scope, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
            });

            it('Should use the video/download/with URL with scope, affiliate, family, and file', async() => {
                await videoAdapter.download(file, { scope, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/download/with/${scope.scopeBoundary}/${scope.scopeKey}/${affiliate}/${family}/${file}`);
            });

            it('Should include userKey in URL when provided', async() => {
                const scopeWithUser = { ...scope, userKey: SESSION.userKey };
                await videoAdapter.download(file, { scope: scopeWithUser, affiliate, family });
                const req = capturedRequests[capturedRequests.length - 1];
                expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/video/download/with/${scope.scopeBoundary}/${scope.scopeKey}/${SESSION.userKey}/${affiliate}/${family}/${file}`);
            });

            it('Should support generic URL options', async() => {
                await videoAdapter.download(file, { scope, affiliate, family, ...GENERIC_OPTIONS });
                const req = capturedRequests[capturedRequests.length - 1];
                const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
                expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/video/download/with/${scope.scopeBoundary}/${scope.scopeKey}/${affiliate}/${family}/${file}`);
            });
        });

        it('Should throw error when neither videoKey nor scope/affiliate/family are provided', async() => {
            await expect(videoAdapter.download(file, {})).rejects.toThrow('Cannot download video -- either a video key or scope/affiliate/family specification is required.');
        });

        testedMethods.push('download');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(videoAdapter).filter((key) => typeof videoAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

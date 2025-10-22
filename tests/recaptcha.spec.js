import {
    it,
    expect,
    describe,
    afterAll,
    beforeAll,
    beforeEach,
} from 'vitest';
import {
    SESSION,
    createFetchMock,
    testedMethods,
    config,
    authAdapter,
    recaptchaAdapter,
} from './common';

describe('recaptchaAdapter', () => {
    let capturedRequests = [];
    let mockSetup;

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

    describe('recaptchaAdapter.google', () => {
        it('Should do a POST', async () => {
            const humanKey = 'RECAPTCHA_KEY';
            await recaptchaAdapter.google(humanKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should use the recaptcha/google  URL', async () => {
            const humanKey = 'RECAPTCHA_KEY';
            const accountShortName = 'epicenter';
            const projectShortName = 'manager';
            await recaptchaAdapter.google(humanKey);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/recaptcha/google`);
        });

        it('Should send the humanKey in the body', async () => {
            const humanKey = 'RECAPTCHA_KEY';
            await recaptchaAdapter.google(humanKey);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.requestBody);
            expect(body.humanKey).toBe(humanKey);
        });

        testedMethods.push('google');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(recaptchaAdapter).filter((key) => typeof recaptchaAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

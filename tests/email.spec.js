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
    emailAdapter,
    config,
} from './common';

describe('emailAdapter', () => {
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

    describe('emailAdapter.sendEmail', () => {
        const groupKey = 'GROUP_KEY';
        const userKey = 'USER_KEY';
        const subject = 'Test Subject';
        const emailBody = 'Test email body';

        it('Should do a POST', async () => {
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the email/user URL', async () => {
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/email/user/${groupKey}/${userKey}`);
        });

        it('Should support generic URL options', async () => {
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/email/user/${groupKey}/${userKey}`);
        });

        it('Should pass subject and body to the request body', async () => {
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('subject', subject);
            expect(body).toHaveProperty('body', emailBody);
        });

        it('Should pass optional parameters to the request body', async () => {
            const optionals = {
                familyNameFirst: 'true',
                html: true,
                attachments: [{
                    encoding: 'BASE_64',
                    data: 'test-data',
                    name: 'test.txt',
                    contentType: 'text/plain',
                }],
            };
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('familyNameFirst', optionals.familyNameFirst);
            expect(body).toHaveProperty('html', optionals.html);
            expect(body).toHaveProperty('attachments');
            expect(body.attachments).toHaveLength(1);
            expect(body.attachments[0].encoding).toBe('BASE_64');
        });

        it('Should append fromUserKey to URL when provided', async () => {
            const fromUserKey = 'FROM_USER_KEY';
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody, { fromUserKey });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`/email/user/${groupKey}/${userKey}/as/${fromUserKey}`);
        });

        it('Should append from address to URL when provided', async () => {
            const from = 'sender@example.com';
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody, { from });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`/email/user/${groupKey}/${userKey}/from/${from}`);
        });

        it('Should append from and replyTo addresses to URL when both provided', async () => {
            const from = 'sender@example.com';
            const replyTo = 'reply@example.com';
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody, { from, replyTo });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`/email/user/${groupKey}/${userKey}/from/${from}/${replyTo}`);
        });

        it('Should prioritize fromUserKey over from when both provided', async () => {
            const fromUserKey = 'FROM_USER_KEY';
            const from = 'sender@example.com';
            await emailAdapter.sendEmail(groupKey, userKey, subject, emailBody, { fromUserKey, from });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toContain(`/as/${fromUserKey}`);
            expect(req.url).not.toContain(`/from/${from}`);
        });

        testedMethods.push('sendEmail');
    });

    describe('emailAdapter.sendEmailToAdmin', () => {
        const adminKey = 'ADMIN_KEY';
        const subject = 'Test Subject';
        const emailBody = 'Test email body';

        it('Should do a POST', async () => {
            await emailAdapter.sendEmailToAdmin(adminKey, subject, emailBody);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await emailAdapter.sendEmailToAdmin(adminKey, subject, emailBody);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the email/admin URL', async () => {
            await emailAdapter.sendEmailToAdmin(adminKey, subject, emailBody);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/email/admin/${adminKey}`);
        });

        it('Should support generic URL options', async () => {
            await emailAdapter.sendEmailToAdmin(adminKey, subject, emailBody, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/email/admin/${adminKey}`);
        });

        it('Should pass subject and body to the request body', async () => {
            await emailAdapter.sendEmailToAdmin(adminKey, subject, emailBody);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('subject', subject);
            expect(body).toHaveProperty('body', emailBody);
        });

        it('Should pass optional parameters to the request body', async () => {
            const optionals = {
                familyNameFirst: 'true',
                html: true,
                attachments: [{
                    encoding: 'HEX',
                    data: 'test-hex-data',
                    name: 'test.bin',
                    contentType: 'application/octet-stream',
                }],
            };
            await emailAdapter.sendEmailToAdmin(adminKey, subject, emailBody, optionals);

            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('familyNameFirst', optionals.familyNameFirst);
            expect(body).toHaveProperty('html', optionals.html);
            expect(body).toHaveProperty('attachments');
            expect(body.attachments).toHaveLength(1);
            expect(body.attachments[0].encoding).toBe('HEX');
        });

        testedMethods.push('sendEmailToAdmin');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(emailAdapter).filter(key => typeof emailAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

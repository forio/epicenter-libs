import { describe, it, expect, beforeEach } from 'vitest';
import {
    createFetchMock,
    registrationAdapter,
    GENERIC_OPTIONS,
    OK_CODE,
    getAuthHeader,
    testedMethods,
    getFunctionKeys,
} from './common.js';

const REGISTRATION_INFO = {
    projectShortName: 'myproject',
    groupName: 'mygroup',
    accountShortName: 'myaccount',
    accountName: 'My Account',
    familyName: 'Doe',
    givenName: 'John',
    projectName: 'My Project',
    email: 'john@example.com',
    groupKey: '00000165ad4e6a3cd22b993340b963820239',
};

const TEAM_REGISTRATION_INFO = {
    accountShortName: 'myaccount',
    accountName: 'My Account',
    familyName: 'Doe',
    givenName: 'Jane',
    email: 'jane@example.com',
};

const REGISTRATION_RESULT = {
    whoAmI: {
        objectType: 'user',
        token: 'sometoken',
        sessionKey: 'somekey',
        timeoutMinutes: 240,
        session: {},
    },
    redirectUrl: 'https://app.example.com/dashboard',
};

describe('registrationAdapter', () => {
    let fetchMock;
    beforeEach(() => {
        fetchMock = createFetchMock({
            '/registration/self/': { body: REGISTRATION_INFO, status: OK_CODE },
            '/registration/invite/': { body: REGISTRATION_INFO, status: OK_CODE },
            '/registration/team/': { body: TEAM_REGISTRATION_INFO, status: OK_CODE },
            '/registration/sso/': { body: {}, status: OK_CODE },
        });
    });

    describe('getSelfRegistrationInfo', () => {
        it('should make a GET request to the correct URL', async () => {
            fetchMock = createFetchMock({
                '/registration/self/mytoken': { body: REGISTRATION_INFO, status: OK_CODE },
            });
            await registrationAdapter.getSelfRegistrationInfo('mytoken', GENERIC_OPTIONS);
            testedMethods.add('getSelfRegistrationInfo');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('GET');
            expect(req.url).toContain('/registration/self/mytoken');
        });

        it('should include the account and project in the URL', async () => {
            fetchMock = createFetchMock({
                '/registration/self/tok': { body: REGISTRATION_INFO, status: OK_CODE },
            });
            await registrationAdapter.getSelfRegistrationInfo('tok', GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            expect(req.url).toContain(GENERIC_OPTIONS.accountShortName);
            expect(req.url).toContain(GENERIC_OPTIONS.projectShortName);
        });

        it('should include auth header', async () => {
            fetchMock = createFetchMock({
                '/registration/self/tok': { body: REGISTRATION_INFO, status: OK_CODE },
            });
            await registrationAdapter.getSelfRegistrationInfo('tok', {
                ...GENERIC_OPTIONS,
                authorization: 'Bearer mytoken',
            });
            const req = fetchMock.capturedRequests[0];
            expect(getAuthHeader(req.requestHeaders)).toBe('Bearer mytoken');
        });
    });

    describe('completeSelfRegistration', () => {
        it('should make a PATCH request to the correct URL', async () => {
            fetchMock = createFetchMock({
                '/registration/self/mytoken': { body: REGISTRATION_RESULT, status: OK_CODE },
            });
            await registrationAdapter.completeSelfRegistration('mytoken', 'mypassword', GENERIC_OPTIONS);
            testedMethods.add('completeSelfRegistration');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('PATCH');
            expect(req.url).toContain('/registration/self/mytoken');
        });

        it('should include password in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/self/tok': { body: REGISTRATION_RESULT, status: OK_CODE },
            });
            await registrationAdapter.completeSelfRegistration('tok', 'secret123', GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.password).toBe('secret123');
        });

        it('should include optional fields in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/self/tok': { body: REGISTRATION_RESULT, status: OK_CODE },
            });
            await registrationAdapter.completeSelfRegistration('tok', 'secret', {
                ...GENERIC_OPTIONS,
                displayName: 'John D.',
                givenName: 'John',
                familyName: 'Doe',
                handle: 'johnd',
            });
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.displayName).toBe('John D.');
            expect(body.givenName).toBe('John');
            expect(body.familyName).toBe('Doe');
            expect(body.handle).toBe('johnd');
        });
    });

    describe('sendSelfRegistrationInvite', () => {
        it('should make a POST request to the correct URL', async () => {
            fetchMock = createFetchMock({
                '/registration/self/groupkey123': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.sendSelfRegistrationInvite('groupkey123', 'user@example.com', GENERIC_OPTIONS);
            testedMethods.add('sendSelfRegistrationInvite');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('POST');
            expect(req.url).toContain('/registration/self/groupkey123');
        });

        it('should include email in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/self/gk': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.sendSelfRegistrationInvite('gk', 'user@example.com', GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.email).toBe('user@example.com');
        });

        it('should include optional fields in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/self/gk': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.sendSelfRegistrationInvite('gk', 'user@example.com', {
                ...GENERIC_OPTIONS,
                linkDestination: 'DASHBOARD',
                modality: 'NONE',
                subject: 'Join us!',
                confirmation: true,
            });
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.linkDestination).toBe('DASHBOARD');
            expect(body.modality).toBe('NONE');
            expect(body.subject).toBe('Join us!');
            expect(body.confirmation).toBe(true);
        });
    });

    describe('getInviteRegistrationInfo', () => {
        it('should make a GET request to the correct URL', async () => {
            fetchMock = createFetchMock({
                '/registration/invite/invitetoken': { body: REGISTRATION_INFO, status: OK_CODE },
            });
            await registrationAdapter.getInviteRegistrationInfo('invitetoken', GENERIC_OPTIONS);
            testedMethods.add('getInviteRegistrationInfo');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('GET');
            expect(req.url).toContain('/registration/invite/invitetoken');
        });

        it('should include the account and project in the URL', async () => {
            fetchMock = createFetchMock({
                '/registration/invite/tok': { body: REGISTRATION_INFO, status: OK_CODE },
            });
            await registrationAdapter.getInviteRegistrationInfo('tok', GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            expect(req.url).toContain(GENERIC_OPTIONS.accountShortName);
            expect(req.url).toContain(GENERIC_OPTIONS.projectShortName);
        });
    });

    describe('completeInviteRegistration', () => {
        it('should make a PATCH request to the correct URL', async () => {
            fetchMock = createFetchMock({
                '/registration/invite/invitetoken': { body: REGISTRATION_RESULT, status: OK_CODE },
            });
            await registrationAdapter.completeInviteRegistration('invitetoken', 'mypassword', GENERIC_OPTIONS);
            testedMethods.add('completeInviteRegistration');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('PATCH');
            expect(req.url).toContain('/registration/invite/invitetoken');
        });

        it('should include password in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/invite/tok': { body: REGISTRATION_RESULT, status: OK_CODE },
            });
            await registrationAdapter.completeInviteRegistration('tok', 'pass456', GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.password).toBe('pass456');
        });

        it('should include optional display fields in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/invite/tok': { body: REGISTRATION_RESULT, status: OK_CODE },
            });
            await registrationAdapter.completeInviteRegistration('tok', 'pass', {
                ...GENERIC_OPTIONS,
                displayName: 'Jane D.',
                handle: 'janed',
            });
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.displayName).toBe('Jane D.');
            expect(body.handle).toBe('janed');
        });
    });

    describe('sendInvite', () => {
        it('should make a POST request to the correct URL', async () => {
            fetchMock = createFetchMock({
                '/registration/invite/groupkey456': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.sendInvite('groupkey456', 'invited@example.com', GENERIC_OPTIONS);
            testedMethods.add('sendInvite');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('POST');
            expect(req.url).toContain('/registration/invite/groupkey456');
        });

        it('should include email in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/invite/gk': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.sendInvite('gk', 'invited@example.com', GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.email).toBe('invited@example.com');
        });

        it('should include optional invite fields in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/invite/gk': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.sendInvite('gk', 'invited@example.com', {
                ...GENERIC_OPTIONS,
                linkDestination: 'MANAGER',
                modality: 'HBP',
                redirectUrl: 'https://app.example.com',
                givenName: 'New',
                familyName: 'User',
            });
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.linkDestination).toBe('MANAGER');
            expect(body.modality).toBe('HBP');
            expect(body.redirectUrl).toBe('https://app.example.com');
            expect(body.givenName).toBe('New');
            expect(body.familyName).toBe('User');
        });
    });

    describe('getTeamRegistrationInfo', () => {
        it('should make a GET request to the correct URL', async () => {
            fetchMock = createFetchMock({
                '/registration/team/teamtoken': { body: TEAM_REGISTRATION_INFO, status: OK_CODE },
            });
            await registrationAdapter.getTeamRegistrationInfo('teamtoken', GENERIC_OPTIONS);
            testedMethods.add('getTeamRegistrationInfo');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('GET');
            expect(req.url).toContain('/registration/team/teamtoken');
        });

        it('should include account and project in URL', async () => {
            fetchMock = createFetchMock({
                '/registration/team/tok': { body: TEAM_REGISTRATION_INFO, status: OK_CODE },
            });
            await registrationAdapter.getTeamRegistrationInfo('tok', GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            expect(req.url).toContain(GENERIC_OPTIONS.accountShortName);
            expect(req.url).toContain(GENERIC_OPTIONS.projectShortName);
        });
    });

    describe('sendTeamInvite', () => {
        it('should make a POST request to the team registration endpoint', async () => {
            fetchMock = createFetchMock({
                '/registration/team': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.sendTeamInvite(
                'Author Name', 'AUTHOR', 'https://example.com', 'newmember@example.com', GENERIC_OPTIONS,
            );
            testedMethods.add('sendTeamInvite');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('POST');
            expect(req.url).toContain('/registration/team');
        });

        it('should include required fields in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/team': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.sendTeamInvite(
                'Jane Author', 'OWNER', 'https://redirect.example.com', 'member@example.com', GENERIC_OPTIONS,
            );
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.invitingAuthor).toBe('Jane Author');
            expect(body.role).toBe('OWNER');
            expect(body.redirectUrl).toBe('https://redirect.example.com');
            expect(body.email).toBe('member@example.com');
        });

        it('should include optional fields in the request body', async () => {
            fetchMock = createFetchMock({
                '/registration/team': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.sendTeamInvite(
                'Jane Author', 'SUPPORT', 'https://redirect.example.com', 'member@example.com', {
                    ...GENERIC_OPTIONS,
                    subject: 'Join our team!',
                    givenName: 'New',
                    familyName: 'Member',
                },
            );
            const req = fetchMock.capturedRequests[0];
            const body = JSON.parse(req.requestBody);
            expect(body.subject).toBe('Join our team!');
            expect(body.givenName).toBe('New');
            expect(body.familyName).toBe('Member');
        });
    });

    describe('getSsoRegistration', () => {
        it('should make a GET request to the SSO registration URL (deprecated)', async () => {
            fetchMock = createFetchMock({
                '/registration/sso/SAML': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.getSsoRegistration('SAML', GENERIC_OPTIONS);
            testedMethods.add('getSsoRegistration');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('GET');
            expect(req.url).toContain('/registration/sso/SAML');
        });
    });

    describe('getSsoAdminRegistration', () => {
        it('should make a GET request to the SSO admin registration URL', async () => {
            fetchMock = createFetchMock({
                '/registration/sso/admin/SAML': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.getSsoAdminRegistration('SAML', GENERIC_OPTIONS);
            testedMethods.add('getSsoAdminRegistration');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('GET');
            expect(req.url).toContain('/registration/sso/admin/SAML');
        });

        it('should include account and project in URL', async () => {
            fetchMock = createFetchMock({
                '/registration/sso/admin/SAML': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.getSsoAdminRegistration('SAML', GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            expect(req.url).toContain(GENERIC_OPTIONS.accountShortName);
            expect(req.url).toContain(GENERIC_OPTIONS.projectShortName);
        });
    });

    describe('getSsoUserRegistration', () => {
        it('should make a GET request to the SSO user registration URL', async () => {
            fetchMock = createFetchMock({
                '/registration/sso/user/SAML': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.getSsoUserRegistration('SAML', GENERIC_OPTIONS);
            testedMethods.add('getSsoUserRegistration');

            const req = fetchMock.capturedRequests[0];
            expect(req.method).toBe('GET');
            expect(req.url).toContain('/registration/sso/user/SAML');
        });

        it('should include account and project in URL', async () => {
            fetchMock = createFetchMock({
                '/registration/sso/user/SAML': { body: {}, status: OK_CODE },
            });
            await registrationAdapter.getSsoUserRegistration('SAML', GENERIC_OPTIONS);
            const req = fetchMock.capturedRequests[0];
            expect(req.url).toContain(GENERIC_OPTIONS.accountShortName);
            expect(req.url).toContain(GENERIC_OPTIONS.projectShortName);
        });
    });

    it('should have tests for all exported functions', () => {
        const allFunctions = getFunctionKeys(registrationAdapter);
        const untestedMethods = [...allFunctions].filter((method) => !testedMethods.has(method));
        expect(untestedMethods).toEqual([]);
    });
});

import {
    it,
    expect,
    describe,
    afterAll,
    beforeAll,
    beforeEach,
} from 'vitest';
import {
    ROLE,
    ACCOUNT,
    PROJECT,
    SESSION,
    GENERIC_OPTIONS,
    createFetchMock,
    getAuthHeader,
    testedMethods,
    groupAdapter,
    authAdapter,
    config,
} from './common';

const DEPRECATED_METHODS = ['search'];

describe('Group APIs', () => {
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
        authAdapter.removeLocalSession();
    });

    describe('groupAdapter.get', () => {
        const GROUP_KEY = SESSION.groupKey;

        it('Should do a GET', async () => {
            await groupAdapter.get();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await groupAdapter.get();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/groupKey URL (using session.groupKey by default)', async () => {
            await groupAdapter.get();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/${GROUP_KEY}`);
        });

        it('Should use a custom groupKey, if provided', async () => {
            await groupAdapter.get({ groupKey: 'mygroupkey' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/mygroupkey`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.get(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/${GROUP_KEY}`);
        });

        it('Should use an updated URL when provided the members augment', async () => {
            await groupAdapter.get({ augment: 'MEMBERS' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/member/${GROUP_KEY}`);
        });

        it('Should use an updated URL when provided the quantized augment', async () => {
            await groupAdapter.get({ augment: 'QUANTIZED' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/quantized/${GROUP_KEY}`);
        });

        testedMethods.push('get');
    });

    describe('groupAdapter.destroy', () => {
        const GROUP_KEY = SESSION.groupKey;

        it('Should do a DELETE', async () => {
            await groupAdapter.destroy(GROUP_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await groupAdapter.destroy(GROUP_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/groupKey URL', async () => {
            await groupAdapter.destroy(GROUP_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/${GROUP_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.destroy(GROUP_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/${GROUP_KEY}`);
        });

        testedMethods.push('destroy');
    });

    describe('groupAdapter.gather', () => {
        it('Should do a GET', async () => {
            await groupAdapter.gather();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await groupAdapter.gather();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group URL', async () => {
            await groupAdapter.gather();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.gather(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group`);
        });

        it('Should support sending an \'expired\' flag', async () => {
            await groupAdapter.gather({ includeExpired: true });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group?includeExpired=true`);
        });

        testedMethods.push('gather');
    });

    describe('groupAdapter.update', () => {
        const GROUP_KEY = SESSION.groupKey;
        const UPDATE = {
            runLimit: 100,
            organization: 'My Testing Organization',
            flightRecorder: {
                start: 1,
                stop: 2,
                enabled: false,
            },
            event: 'My Event',
            allowMembershipChanges: false,
            pricing: {
                amount: 15,
            },
            startDate: new Date().toUTCString(),
            expirationDate: new Date().toUTCString(),
            capacity: 500,
            allowChannel: true,
        };

        it('Should do a PATCH', async () => {
            await groupAdapter.update(GROUP_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await groupAdapter.update(GROUP_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/groupKey URL', async () => {
            await groupAdapter.update(GROUP_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/${GROUP_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.update(GROUP_KEY, UPDATE, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/${GROUP_KEY}`);
        });

        it('Should send the update in the request body', async () => {
            await groupAdapter.update(GROUP_KEY, UPDATE);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(UPDATE);
        });

        testedMethods.push('update');
    });

    describe('groupAdapter.create', () => {
        const GROUP = {
            name: 'groupname',
            runLimit: 100,
            organization: 'My Testing Organization',
            flightRecorder: {
                start: 1,
                stop: 2,
                enabled: false,
            },
            event: 'My Event',
            allowMembershipChanges: false,
            pricing: {
                amount: 15,
            },
            startDate: new Date().toUTCString(),
            expirationDate: new Date().toUTCString(),
            capacity: 500,
            allowChannel: true,
        };

        it('Should do a POST', async () => {
            await groupAdapter.create(GROUP);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await groupAdapter.create(GROUP);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group URL', async () => {
            await groupAdapter.create(GROUP);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.create(GROUP, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group`);
        });

        it('Should pass the group as part of the request body', async () => {
            await groupAdapter.create(GROUP);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toEqual(GROUP);
        });

        testedMethods.push('create');
    });

    describe('groupAdapter.query', () => {
        const OPTIONS = {
            filter: [
                'group.name|=group1|group2',
                'permission.role=FACILITATOR',
                'user.userKey=0123',
            ],
            sort: ['+group.name'],
            first: 0,
            max: 100,
        };

        it('Should do a GET', async () => {
            await groupAdapter.query(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await groupAdapter.query(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group URL', async () => {
            await groupAdapter.query(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/search`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.query(OPTIONS, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/search`);
        });

        it('Should modify URL to contain \'quantized\' when the option is provided', async () => {
            await groupAdapter.query({ ...OPTIONS, quantized: true });
            const req = capturedRequests[capturedRequests.length - 1];
            const url = req.url.split('?')[0];
            expect(url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/quantized/search`);
        });

        it('Should pass in query options as a part of the search parameters (query string)', async () => {
            await groupAdapter.query(OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('filter')).toBe(OPTIONS.filter.join(';'));
            expect(searchParams.get('sort')).toBe(OPTIONS.sort.join(';'));
            expect(searchParams.get('first')).toBe(OPTIONS.first.toString());
            expect(searchParams.get('max')).toBe(OPTIONS.max.toString());
        });

        testedMethods.push('query');
    });

    describe('groupAdapter.search', () => {
        it('Should be deprecated', () => {
            expect(DEPRECATED_METHODS).toContain('search');
        });
        testedMethods.push('search');
    });

    describe('groupAdapter.withGroupName', () => {
        const GROUP_NAME = 'groupname';

        it('Should do a GET', async () => {
            await groupAdapter.withGroupName(GROUP_NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await groupAdapter.withGroupName(GROUP_NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/with/groupName URL', async () => {
            await groupAdapter.withGroupName(GROUP_NAME);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/with/${GROUP_NAME}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.withGroupName(GROUP_NAME, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/with/${GROUP_NAME}`);
        });

        testedMethods.push('withGroupName');
    });

    describe('groupAdapter.forUser', () => {
        const USER_KEY = 'userkey';

        it('Should do a GET', async () => {
            await groupAdapter.forUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await groupAdapter.forUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/member/for/userKey URL', async () => {
            await groupAdapter.forUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/member/for/${USER_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.forUser(USER_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/for/${USER_KEY}`);
        });

        it('Should pass non-generic options to URL search parameters', async () => {
            await groupAdapter.forUser(USER_KEY, {
                includeExpired: false,
                includeAllMembers: true,
                role: ROLE.PARTICIPANT,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('includeExpired')).toBe('false');
            expect(searchParams.get('includeAllMembers')).toBe('true');
            expect(searchParams.get('role')).toBe(ROLE.PARTICIPANT);
        });

        it('Should handle the use of multiple roles in the URL search parameters', async () => {
            await groupAdapter.forUser(USER_KEY, {
                role: [ROLE.PARTICIPANT, ROLE.FACILITATOR],
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.getAll('role')).toEqual([ROLE.PARTICIPANT, ROLE.FACILITATOR]);
        });

        testedMethods.push('forUser');
    });

    describe('groupAdapter.getSessionGroups', () => {
        it('Should do a GET', async () => {
            await groupAdapter.getSessionGroups();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await groupAdapter.getSessionGroups();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/member URL', async () => {
            await groupAdapter.getSessionGroups();
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/member`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.getSessionGroups(GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member`);
        });

        it('Should pass non-generic options to URL search parameters', async () => {
            await groupAdapter.getSessionGroups({
                includeExpired: false,
                role: ROLE.PARTICIPANT,
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.get('includeExpired')).toBe('false');
            expect(searchParams.get('role')).toBe(ROLE.PARTICIPANT);
        });

        it('Should handle the use of multiple roles in the URL search parameters', async () => {
            await groupAdapter.getSessionGroups({
                role: [ROLE.PARTICIPANT, ROLE.FACILITATOR],
            });
            const req = capturedRequests[capturedRequests.length - 1];
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            expect(searchParams.getAll('role')).toEqual([ROLE.PARTICIPANT, ROLE.FACILITATOR]);
        });

        testedMethods.push('getSessionGroups');
    });

    describe('groupAdapter.whitelistUsers', () => {
        const GROUP_KEY = 'mygroupkey';
        const allow = true;
        const emails = ['user1@test.com', 'user2@test.com'];

        it('Should do a POST', async () => {
            await groupAdapter.whitelistUsers(GROUP_KEY, { allow, emails });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await groupAdapter.whitelistUsers(GROUP_KEY, { allow, emails });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/self URL', async () => {
            await groupAdapter.whitelistUsers(GROUP_KEY, { allow, emails });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/self/${GROUP_KEY}`);
        });

        it('Should by default set allow for all users', async () => {
            await groupAdapter.whitelistUsers(GROUP_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.allow).toBe(true);
            expect(body.emails).toEqual(['*']);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.whitelistUsers(GROUP_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/self/${GROUP_KEY}`);
        });

        testedMethods.push('whitelistUsers');
    });

    describe('groupAdapter.getWhitelistedUsers', () => {
        const GROUP_KEY = 'mygroupkey';

        it('Should do a GET', async () => {
            await groupAdapter.getWhitelistedUsers(GROUP_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('GET');
        });

        it('Should have authorization', async () => {
            await groupAdapter.getWhitelistedUsers(GROUP_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/self URL', async () => {
            await groupAdapter.getWhitelistedUsers(GROUP_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/self/${GROUP_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.getWhitelistedUsers(GROUP_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/self/${GROUP_KEY}`);
        });

        testedMethods.push('getWhitelistedUsers');
    });

    describe('groupAdapter.sendRegistrationEmail', () => {
        const GROUP_KEY = 'mygroupkey';
        const email = 'user1@test.com';

        it('Should do a POST', async () => {
            await groupAdapter.sendRegistrationEmail(GROUP_KEY, email);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should use the /registration/self URL', async () => {
            await groupAdapter.sendRegistrationEmail(GROUP_KEY, email);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/registration/self/${GROUP_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.sendRegistrationEmail(GROUP_KEY, email, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/registration/self/${GROUP_KEY}`);
        });

        testedMethods.push('sendRegistrationEmail');
    });

    describe('groupAdapter.selfRegister', () => {
        const REGISTRATION_TOKEN = 'myregistrationtoken';
        const password = 'pass';

        it('Should do a PATCH', async () => {
            await groupAdapter.selfRegister(REGISTRATION_TOKEN, password);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await groupAdapter.selfRegister(REGISTRATION_TOKEN, password);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the /registration/self URL', async () => {
            await groupAdapter.selfRegister(REGISTRATION_TOKEN, password);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/registration/self/${REGISTRATION_TOKEN}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.selfRegister(REGISTRATION_TOKEN, password, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/registration/self/${REGISTRATION_TOKEN}`);
        });

        testedMethods.push('selfRegister');
    });

    describe('groupAdapter.addUser', () => {
        const GROUP_KEY = SESSION.groupKey;
        const USER_KEY = 'myuserkey';

        it('Should do a POST', async () => {
            await groupAdapter.addUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('POST');
        });

        it('Should have authorization', async () => {
            await groupAdapter.addUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/member/groupKey URL (using session.groupKey by default)', async () => {
            await groupAdapter.addUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/member/${GROUP_KEY}`);
        });

        it('Should use a custom groupKey, if provided', async () => {
            await groupAdapter.addUser(USER_KEY, { groupKey: 'mygroupkey' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/member/mygroupkey`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.addUser(USER_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/${GROUP_KEY}`);
        });

        it('Should pass the userKey to the request body as an array', async () => {
            await groupAdapter.addUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(Array.isArray(body)).toBe(true);
            expect(body.map(u => u.userKey)).toEqual([USER_KEY]);
        });

        it('Should by default set user as an available participant', async () => {
            await groupAdapter.addUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body.every(u => u.available)).toBe(true);
            expect(body.every(u => u.role === ROLE.PARTICIPANT)).toBe(true);
        });

        it('Should support adding multiple users', async () => {
            const USER_KEYS = [USER_KEY, 'anotheruserkey'];
            await groupAdapter.addUser(USER_KEYS);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(Array.isArray(body)).toBe(true);
            expect(body.map(u => u.userKey)).toEqual(USER_KEYS);
        });

        testedMethods.push('addUser');
    });

    describe('groupAdapter.updateUser', () => {
        const USER_KEY = 'myuserkey';
        const GROUP_KEY = SESSION.groupKey;
        const update = { role: ROLE.PARTICIPANT, available: true };

        it('Should do a PATCH', async () => {
            await groupAdapter.updateUser(USER_KEY, update);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await groupAdapter.updateUser(USER_KEY, update);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/member/groupKey/userKey URL', async () => {
            await groupAdapter.updateUser(USER_KEY, update);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/member/${GROUP_KEY}/${USER_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.updateUser(USER_KEY, update, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/${GROUP_KEY}/${USER_KEY}`);
        });

        it('Should pass update data in request body', async () => {
            await groupAdapter.updateUser(USER_KEY, update);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('objectType', 'group');
            expect(body).toHaveProperty('role', ROLE.PARTICIPANT);
            expect(body).toHaveProperty('available', true);
        });

        testedMethods.push('updateUser');
    });

    describe('groupAdapter.statusUpdate', () => {
        const GROUP_KEY = SESSION.groupKey;
        const code = 'ACTIVE';
        const message = 'Group is now active';

        it('Should do a PATCH', async () => {
            await groupAdapter.statusUpdate(code, message);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('PATCH');
        });

        it('Should have authorization', async () => {
            await groupAdapter.statusUpdate(code, message);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/status/groupKey URL', async () => {
            await groupAdapter.statusUpdate(code, message);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/status/${GROUP_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.statusUpdate(code, message, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/status/${GROUP_KEY}`);
        });

        it('Should pass code and message in request body', async () => {
            await groupAdapter.statusUpdate(code, message);
            const req = capturedRequests[capturedRequests.length - 1];
            const body = JSON.parse(req.options.body);
            expect(body).toHaveProperty('code', 'ACTIVE');
            expect(body).toHaveProperty('message', 'Group is now active');
        });

        testedMethods.push('statusUpdate');
    });

    describe('groupAdapter.removeUser', () => {
        const GROUP_KEY = SESSION.groupKey;
        const USER_KEY = 'myuserkey';

        it('Should do a DELETE', async () => {
            await groupAdapter.removeUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.options.method.toUpperCase()).toBe('DELETE');
        });

        it('Should have authorization', async () => {
            await groupAdapter.removeUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(getAuthHeader(req.requestHeaders)).toBe(`Bearer ${SESSION.token}`);
        });

        it('Should use the group/member/groupKey/userKey URL (using session.groupKey by default)', async () => {
            await groupAdapter.removeUser(USER_KEY);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/member/${GROUP_KEY}/${USER_KEY}`);
        });

        it('Should use a custom groupKey, if provided', async () => {
            await groupAdapter.removeUser(USER_KEY, { groupKey: 'mygroupkey' });
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/member/mygroupkey/${USER_KEY}`);
        });

        it('Should support generic URL options', async () => {
            await groupAdapter.removeUser(USER_KEY, GENERIC_OPTIONS);
            const req = capturedRequests[capturedRequests.length - 1];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            expect(req.url).toBe(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/${GROUP_KEY}/${USER_KEY}`);
        });

        it('Should support multiple userKeys', async () => {
            await groupAdapter.removeUser([USER_KEY, 'anotheruserkey']);
            const req = capturedRequests[capturedRequests.length - 1];
            expect(req.url).toBe(`https://${config.apiHost}/api/v${config.apiVersion}/${config.accountShortName}/${config.projectShortName}/group/member/${GROUP_KEY}?userKey=${USER_KEY}&userKey=anotheruserkey`);
        });

        testedMethods.push('removeUser');
    });

    it('Should not have any untested methods', () => {
        // Filter out non-function exports (enums, interfaces, etc.)
        const actualMethods = Object.keys(groupAdapter).filter(key => typeof groupAdapter[key] === 'function').sort();
        expect(actualMethods).toEqual(testedMethods.sort());
    });
});

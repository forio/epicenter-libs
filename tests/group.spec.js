import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './constants';
chai.use(require('sinon-chai'));

describe('Group APIs', () => {
    const { config, groupAdapter, authAdapter, ROLE } = epicenter;
    let fakeServer;
    const testedMethods = [];

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondWith('DELETE', /(.*)\/group/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('GET', /(.*)\/group/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('POST', /(.*)\/group/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('PATCH', /(.*)\/group/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('DELETE', /(.*)\/verification/, (xhr, id) => {
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, 'true');
        });
        fakeServer.respondWith('POST', /(.*)\/registration/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('PATCH', /(.*)\/registration/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('groupAdapter.get', () => {
        const GROUP_KEY = SESSION.groupKey;
        it('Should do a GET', async() => {
            await groupAdapter.get();
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await groupAdapter.get();
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/groupKey URL (using session.groupKey by default)', async() => {
            await groupAdapter.get();
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/${GROUP_KEY}`);
        });
        it('Should use a custom groupKey, if provided', async() => {
            await groupAdapter.get({ groupKey: 'mygroupkey' });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/mygroupkey`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.get(GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/${GROUP_KEY}`);
        });
        it('Should use an updated URL when provided the members augment', async() => {
            await groupAdapter.get({ augment: 'MEMBERS' });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/${GROUP_KEY}`);
        });
        it('Should use an updated URL when provided the quantized augment', async() => {
            await groupAdapter.get({ augment: 'QUANTIZED' });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/quantized/${GROUP_KEY}`);
        });
        testedMethods.push('get');
    });
    describe('groupAdapter.destroy', () => {
        const GROUP_KEY = SESSION.groupKey;
        it('Should do a DELETE', async() => {
            await groupAdapter.destroy(GROUP_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });
        it('Should have authorization', async() => {
            await groupAdapter.destroy(GROUP_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/groupKey URL', async() => {
            await groupAdapter.destroy(GROUP_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/${GROUP_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.destroy(GROUP_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/${GROUP_KEY}`);
        });
        testedMethods.push('destroy');
    });
    describe('groupAdapter.gather', () => {
        it('Should do a GET', async() => {
            await groupAdapter.gather();
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await groupAdapter.gather();
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group URL', async() => {
            await groupAdapter.gather();
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.gather(GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group`);
        });
        it('Should support sending an \'expired\' flag', async() => {
            await groupAdapter.gather({ includeExpired: true });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group?includeExpired=true`);
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
        it('Should do a PATCH', async() => {
            await groupAdapter.update(GROUP_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        });
        it('Should have authorization', async() => {
            await groupAdapter.update(GROUP_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/groupKey URL', async() => {
            await groupAdapter.update(GROUP_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/${GROUP_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.update(GROUP_KEY, UPDATE, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/${GROUP_KEY}`);
        });
        it('Should send the update in the request body', async() => {
            await groupAdapter.update(GROUP_KEY, UPDATE);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.deep.equal(UPDATE);
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
        it('Should do a POST', async() => {
            await groupAdapter.create(GROUP);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await groupAdapter.create(GROUP);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group URL', async() => {
            await groupAdapter.create(GROUP);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.create(GROUP, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group`);
        });
        it('Should pass the group as part of the request body', async() => {
            await groupAdapter.create(GROUP);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.be.deep.equal(GROUP);
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
        it('Should do a GET', async() => {
            await groupAdapter.query(OPTIONS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await groupAdapter.query(OPTIONS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group URL', async() => {
            await groupAdapter.query(OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/search`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.query(OPTIONS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/search`);
        });
        it('Should modify URL to contain \'quantized\' when the option is provided', async() => {
            await groupAdapter.query({ ...OPTIONS, quantized: true });
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/quantized/search`);
        });
        it('Should pass in query options as a part of the search parameters (query string)', async() => {
            await groupAdapter.query(OPTIONS);
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('filter').should.equal(OPTIONS.filter.join(';'));
            searchParams.get('sort').should.equal(OPTIONS.sort.join(';'));
            searchParams.get('first').should.equal(OPTIONS.first.toString());
            searchParams.get('max').should.equal(OPTIONS.max.toString());
        });
        testedMethods.push('query');

    });
    describe('groupAdapter.search', () => {
        // TODO -- remove this as groupAdapter.search is DEPRECATED
        testedMethods.push('search');
    });
    describe('groupAdapter.withGroupName', () => {
        const GROUP_NAME = 'groupname';
        it('Should do a GET', async() => {
            await groupAdapter.withGroupName(GROUP_NAME);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await groupAdapter.withGroupName(GROUP_NAME);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/with/groupName URL', async() => {
            await groupAdapter.withGroupName(GROUP_NAME);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/with/${GROUP_NAME}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.withGroupName(GROUP_NAME, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/with/${GROUP_NAME}`);
        });
        testedMethods.push('withGroupName');
    });
    describe('groupAdapter.forUser', () => {
        const USER_KEY = 'userkey';
        it('Should do a GET', async() => {
            await groupAdapter.forUser(USER_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await groupAdapter.forUser(USER_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/member/for/userKey URL', async() => {
            await groupAdapter.forUser(USER_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/for/${USER_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.forUser(USER_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/for/${USER_KEY}`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            await groupAdapter.forUser(USER_KEY, {
                includeExpired: false,
                includeAllMembers: true,
                role: ROLE.PARTICIPANT,
            });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('includeExpired').should.equal('false');
            searchParams.get('includeAllMembers').should.equal('true');
            searchParams.get('role').should.equal(ROLE.PARTICIPANT);
        });
        it('Should handle the use of multiple roles in the URL search parameters', async() => {
            await groupAdapter.forUser(USER_KEY, {
                role: [ROLE.PARTICIPANT, ROLE.FACILITATOR],
            });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('role').should.deep.equal([ROLE.PARTICIPANT, ROLE.FACILITATOR]);
        });
        testedMethods.push('forUser');
    });
    describe('groupAdapter.getSessionGroups', () => {
        it('Should do a GET', async() => {
            await groupAdapter.getSessionGroups();
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await groupAdapter.getSessionGroups();
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/member URL', async() => {
            await groupAdapter.getSessionGroups();
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.getSessionGroups(GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            await groupAdapter.getSessionGroups({
                includeExpired: false,
                role: ROLE.PARTICIPANT,
            });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('includeExpired').should.equal('false');
            searchParams.get('role').should.equal(ROLE.PARTICIPANT);
        });
        it('Should handle the use of multiple roles in the URL search parameters', async() => {
            await groupAdapter.getSessionGroups({
                role: [ROLE.PARTICIPANT, ROLE.FACILITATOR],
            });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('role').should.deep.equal([ROLE.PARTICIPANT, ROLE.FACILITATOR]);
        });
        testedMethods.push('getSessionGroups');
    });
    describe('groupAdapter.whitelistUsers', () => {
        const GROUP_KEY = 'mygroupkey';
        const allow = true;
        const emails = ['user1@test.com', 'user2@test.com'];
        it('Should do a POST', async() => {
            await groupAdapter.whitelistUsers(GROUP_KEY, { allow, emails });
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await groupAdapter.whitelistUsers(GROUP_KEY, { allow, emails });
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/self URL', async() => {
            await groupAdapter.whitelistUsers(GROUP_KEY, { allow, emails });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/self/${GROUP_KEY}`);
        });
        it('Should by default set allow for all users', async() => {
            await groupAdapter.whitelistUsers(GROUP_KEY);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.allow.should.equal(true);
            body.emails.should.deep.equal(['*']);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.whitelistUsers(GROUP_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/self/${GROUP_KEY}`);
        });
        testedMethods.push('whitelistUsers');
    });
    describe('groupAdapter.getWhitelistedUsers', () => {
        const GROUP_KEY = 'mygroupkey';
        it('Should do a GET', async() => {
            await groupAdapter.getWhitelistedUsers(GROUP_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await groupAdapter.getWhitelistedUsers(GROUP_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/self URL', async() => {
            await groupAdapter.getWhitelistedUsers(GROUP_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/self/${GROUP_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.getWhitelistedUsers(GROUP_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/self/${GROUP_KEY}`);
        });
        testedMethods.push('getWhitelistedUsers');
    });
    describe('groupAdapter.sendRegistrationEmail', () => {
        const GROUP_KEY = 'mygroupkey';
        const email = 'user1@test.com';
        it('Should do a POST', async() => {
            await groupAdapter.sendRegistrationEmail(GROUP_KEY, email);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should use the /registration/self URL', async() => {
            await groupAdapter.sendRegistrationEmail(GROUP_KEY, email);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/registration/self/${GROUP_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.sendRegistrationEmail(GROUP_KEY, email, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/registration/self/${GROUP_KEY}`);
        });
        testedMethods.push('sendRegistrationEmail');
    });
    describe('groupAdapter.selfRegister', () => {
        const REGISTRATION_TOKEN = 'myregistrationtoken';
        const password = 'pass';
        it('Should do a PATCH', async() => {
            await groupAdapter.selfRegister(REGISTRATION_TOKEN, password);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('PATCH');
        });
        it('Should have authorization', async() => {
            await groupAdapter.selfRegister(REGISTRATION_TOKEN, password);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the /registration/self URL', async() => {
            await groupAdapter.selfRegister(REGISTRATION_TOKEN, password);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/registration/self/${REGISTRATION_TOKEN}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.selfRegister(REGISTRATION_TOKEN, password, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/registration/self/${REGISTRATION_TOKEN}`);
        });
        testedMethods.push('selfRegister');
    });
    describe('groupAdapter.addUser', () => {
        const GROUP_KEY = SESSION.groupKey;
        const USER_KEY = 'myuserkey';
        it('Should do a POST', async() => {
            await groupAdapter.addUser(USER_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await groupAdapter.addUser(USER_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/member/groupKey URL (using session.groupKey by default)', async() => {
            await groupAdapter.addUser(USER_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/${GROUP_KEY}`);
        });
        it('Should use a custom groupKey, if provided', async() => {
            await groupAdapter.addUser(USER_KEY, { groupKey: 'mygroupkey' });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/mygroupkey`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.addUser(USER_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/${GROUP_KEY}`);
        });
        it('Should pass the userKey to the request body as an array', async() => {
            await groupAdapter.addUser(USER_KEY);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            Array.isArray(body).should.be.true;
            body.map((u) => u.userKey).should.deep.equal([USER_KEY]);
        });
        it('Should by default set user as an available participant', async() => {
            await groupAdapter.addUser(USER_KEY);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.every((u) => u.available).should.be.true;
            body.every((u) => u.role === ROLE.PARTICIPANT).should.be.true;
        });
        it('Should support adding multiple users', async() => {
            const USER_KEYS = [USER_KEY, 'anotheruserkey'];
            await groupAdapter.addUser(USER_KEYS);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            Array.isArray(body).should.be.true;
            body.map((u) => u.userKey).should.deep.equal(USER_KEYS);
        });
        testedMethods.push('addUser');
    });
    describe('groupAdapter.updateUser', () => {
        // TODO -- add tests!!!
        testedMethods.push('updateUser');
    });
    describe('groupAdapter.statusUpdate', () => {
        // TODO -- add tests!!!
        testedMethods.push('statusUpdate');
    });
    describe('groupAdapter.removeUser', () => {
        const GROUP_KEY = SESSION.groupKey;
        const USER_KEY = 'myuserkey';
        it('Should do a DELETE', async() => {
            await groupAdapter.removeUser(USER_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });
        it('Should have authorization', async() => {
            await groupAdapter.removeUser(USER_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/member/groupKey/userKey URL (using session.groupKey by default)', async() => {
            await groupAdapter.removeUser(USER_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/${GROUP_KEY}/${USER_KEY}`);
        });
        it('Should use a custom groupKey, if provided', async() => {
            await groupAdapter.removeUser(USER_KEY, { groupKey: 'mygroupkey' });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/mygroupkey/${USER_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.removeUser(USER_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/${GROUP_KEY}/${USER_KEY}`);
        });
        it('Should support multiple userKeys', async() => {
            await groupAdapter.removeUser([USER_KEY, 'anotheruserkey']);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/${GROUP_KEY}?userKey=${USER_KEY}&userKey=anotheruserkey`);
        });
        testedMethods.push('removeUser');
    });

    it('Should not have any untested methods', () => {
        chai.expect(groupAdapter).to.have.all.keys(...testedMethods);
    });
});

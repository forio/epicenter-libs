import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './common';
chai.use(require('sinon-chai'));

describe('Group API Service', () => {
    const { config, groupAdapter, authAdapter, ROLE } = epicenter;
    let fakeServer;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondWith('DELETE', /(.*)\/group/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'content-type': 'application/json' }, JSON.stringify(RESPONSE));
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
        it('Should use the group/groupKey URL, using the session\'s groupKey by default', async() => {
            await groupAdapter.get();
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/${GROUP_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.get(GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/${GROUP_KEY}`);
        });
        it('Should optionally allow you to pass a specific group key', async() => {
            await groupAdapter.get({ groupKey: '123' });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/123`);
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
            await groupAdapter.gather({ expired: true });
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group?expired=true`);
        });
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
    });
    describe('groupAdapter.search', () => {
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
            await groupAdapter.search(OPTIONS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await groupAdapter.search(OPTIONS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group URL', async() => {
            await groupAdapter.search(OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/search`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.search({ ...OPTIONS, ...GENERIC_OPTIONS });
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/search`);
        });
        it('Should modify URL to contain \'quantized\' when the option is provided', async() => {
            await groupAdapter.search({ ...OPTIONS, quantized: true });
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/quantized/search`);
        });
        it('Should pass in query options as a part of the search parameters (query string)', async() => {
            await groupAdapter.search(OPTIONS);
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('filter').should.equal(OPTIONS.filter.join(';'));
            searchParams.get('sort').should.equal(OPTIONS.sort.join(';'));
            searchParams.get('first').should.equal(OPTIONS.first.toString());
            searchParams.get('max').should.equal(OPTIONS.max.toString());
        });
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
    });
    describe('groupAdapter.forUserKey', () => {
        const USER_KEY = 'userkey';
        it('Should do a GET', async() => {
            await groupAdapter.forUserKey(USER_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await groupAdapter.forUserKey(USER_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/member/for/userKey URL', async() => {
            await groupAdapter.forUserKey(USER_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/for/${USER_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.forUserKey(USER_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/for/${USER_KEY}`);
        });
        it('Should pass non-generic options to URL search parameters', async() => {
            await groupAdapter.forUserKey(USER_KEY, {
                expired: false,
                all: true,
                role: ROLE.PARTICIPANT,
            });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('expired').should.equal('false');
            searchParams.get('all').should.equal('true');
            searchParams.get('role').should.equal(ROLE.PARTICIPANT);
        });
        it('Should handle the use of multiple roles in the URL search parameters', async() => {
            await groupAdapter.forUserKey(USER_KEY, {
                role: [ROLE.PARTICIPANT, ROLE.FACILITATOR],
            });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.getAll('role').should.deep.equal([ROLE.PARTICIPANT, ROLE.FACILITATOR]);
        });
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
                expired: false,
                role: ROLE.PARTICIPANT,
            });
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('expired').should.equal('false');
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
    });
    describe('groupAdapter.register', () => {
        const GROUP_KEY = 'mygroupkey';
        it('Should do a POST', async() => {
            await groupAdapter.register(GROUP_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await groupAdapter.register(GROUP_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/member URL', async() => {
            await groupAdapter.register(GROUP_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/selfRegistration/${GROUP_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.register(GROUP_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/selfRegistration/${GROUP_KEY}`);
        });
    });
    describe('groupAdapter.addUser', () => {
        const GROUP_KEY = 'mygroupkey';
        const USER_KEY = 'myuserkey';
        it('Should do a POST', async() => {
            await groupAdapter.addUser(GROUP_KEY, USER_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await groupAdapter.addUser(GROUP_KEY, USER_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/member URL', async() => {
            await groupAdapter.addUser(GROUP_KEY, USER_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/${GROUP_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.addUser(GROUP_KEY, USER_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/${GROUP_KEY}`);
        });
        it('Should pass the userKey to the request body', async() => {
            await groupAdapter.addUser(GROUP_KEY, USER_KEY);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.userKey.should.equal(USER_KEY);
        });
        it('Should by default set user as an available participant', async() => {
            await groupAdapter.addUser(GROUP_KEY, USER_KEY);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.available.should.equal(true);
            body.role.should.equal(ROLE.PARTICIPANT);
        });
    });
    describe('groupAdapter.removeUser', () => {
        const GROUP_KEY = 'mygroupkey';
        const USER_KEY = 'myuserkey';
        it('Should do a DELETE', async() => {
            await groupAdapter.removeUser(GROUP_KEY, USER_KEY);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('DELETE');
        });
        it('Should have authorization', async() => {
            await groupAdapter.removeUser(GROUP_KEY, USER_KEY);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the group/member/groupKey/userKey URL', async() => {
            await groupAdapter.removeUser(GROUP_KEY, USER_KEY);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/${GROUP_KEY}/${USER_KEY}`);
        });
        it('Should support generic URL options', async() => {
            await groupAdapter.removeUser(GROUP_KEY, USER_KEY, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/group/member/${GROUP_KEY}/${USER_KEY}`);
        });
        it('Should support multiple userKeys', async() => {
            await groupAdapter.removeUser(GROUP_KEY, [USER_KEY, 'anotheruserkey']);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/group/member/${GROUP_KEY}?userKey=${USER_KEY}&userKey=anotheruserkey`);
        });
    });
});

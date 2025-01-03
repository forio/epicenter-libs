// Claude Opus

import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, CREATED_CODE, GENERIC_OPTIONS } from './constants';
chai.use(require('sinon-chai'));

const DEPRECATED_METHODS = ['get'];

describe('Leaderboard APIs', () => {
    const { config, leaderboardAdapter, authAdapter } = epicenter;
    let fakeServer;
    const testedMethods = [];

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create();
        authAdapter.setLocalSession(SESSION);

        fakeServer.respondWith('POST', /(.*)\/leaderboard/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('GET', /(.*)\/leaderboard/, function(xhr, id) {
            const RESPONSE = { /* Doesn't matter what goes here -- just need the fakeServer to respond w/ something */ };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();
        authAdapter.setLocalSession(undefined);
    });

    describe('leaderboardAdapter.update', () => {
        const COLLECTION = 'mycollection';
        const SCOPE = { scopeBoundary: 'group', scopeKey: 'mygroupkey' };
        const SCORES = [{ name: 'score1', quantity: 10 }, { name: 'score2', quantity: 20 }];
        const OPTIONALS = {
            tags: [{ label: 'tag1', content: 'tagcontent1' }],
            allowChannel: true,
        };
        it('Should do a POST', async() => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('POST');
        });
        it('Should have authorization', async() => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the /leaderboard URL', async() => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES);
            const req = fakeServer.requests.pop();
            req.url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/leaderboard`);
        });
        it('Should support generic URL options', async() => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            req.url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/leaderboard`);
        });
        it('Should pass the leaderboard data in the request body', async() => {
            await leaderboardAdapter.update(COLLECTION, SCOPE, SCORES, OPTIONALS);
            const req = fakeServer.requests.pop();
            const body = JSON.parse(req.requestBody);
            body.should.deep.equal({
                collection: COLLECTION,
                scope: {
                    ...SCOPE,
                    userKey: SESSION.userKey,
                },
                scores: SCORES,
                ...OPTIONALS,
            });
        });
        testedMethods.push('update');
    });

    describe('leaderboardAdapter.list', () => {
        const COLLECTION = 'mycollection';
        const SCOPE = { scopeBoundary: 'group', scopeKey: 'mygroupkey' };
        const SEARCH_OPTIONS = {
            filter: ['score.total>10'],
            sort: ['+score.total'],
            first: 0,
            max: 20,
        };

        it('Should do a GET', async() => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the /leaderboard/{scopeBoundary}/{scopeKey}/{collection} URL', async() => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/leaderboard/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${COLLECTION}`);
        });
        it('Should support generic URL options', async() => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            const url = req.url.split('?')[0];
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/leaderboard/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${COLLECTION}`);
        });
        it('Should pass search options in the URL search parameters', async() => {
            await leaderboardAdapter.list(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('filter').should.equal(SEARCH_OPTIONS.filter.join(';'));
            searchParams.get('sort').should.equal(SEARCH_OPTIONS.sort.join(';'));
            searchParams.get('first').should.equal(SEARCH_OPTIONS.first.toString());
            searchParams.get('max').should.equal(SEARCH_OPTIONS.max.toString());
        });
        testedMethods.push('list');
    });

    describe('leaderboardAdapter.getCount', () => {
        const COLLECTION = 'mycollection';
        const SCOPE = { scopeBoundary: 'group', scopeKey: 'mygroupkey' };
        const SEARCH_OPTIONS = {
            filter: ['score.total>10'],
        };

        it('Should do a GET', async() => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = fakeServer.requests.pop();
            req.method.toUpperCase().should.equal('GET');
        });
        it('Should have authorization', async() => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = fakeServer.requests.pop();
            req.requestHeaders.should.have.property('authorization', `Bearer ${SESSION.token}`);
        });
        it('Should use the /leaderboard/count/{scopeBoundary}/{scopeKey}/{collection} URL', async() => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = fakeServer.requests.pop();
            const url = req.url.split('?')[0];
            url.should.equal(`https://${config.apiHost}/api/v${config.apiVersion}/${ACCOUNT}/${PROJECT}/leaderboard/count/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${COLLECTION}`);
        });
        it('Should support generic URL options', async() => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS, GENERIC_OPTIONS);
            const req = fakeServer.requests.pop();
            const { server, accountShortName, projectShortName } = GENERIC_OPTIONS;
            const url = req.url.split('?')[0];
            url.should.equal(`${server}/api/v${config.apiVersion}/${accountShortName}/${projectShortName}/leaderboard/count/${SCOPE.scopeBoundary}/${SCOPE.scopeKey}/${COLLECTION}`);
        });
        it('Should pass search options in the URL search parameters', async() => {
            await leaderboardAdapter.getCount(COLLECTION, SCOPE, SEARCH_OPTIONS);
            const req = fakeServer.requests.pop();
            const search = req.url.split('?')[1];
            const searchParams = new URLSearchParams(search);
            searchParams.get('filter').should.equal(SEARCH_OPTIONS.filter.join(';'));
        });
        testedMethods.push('getCount');
    })

    it('Should not have any untested methods', () => {
        const exportedMethods = Object.keys(leaderboardAdapter);
        const untestedMethods = exportedMethods.filter((method) =>
            !testedMethods.includes(method) && !DEPRECATED_METHODS.includes(method)
        );
        chai.expect(untestedMethods).to.be.empty;
    });
});
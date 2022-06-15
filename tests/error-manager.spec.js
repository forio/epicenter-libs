import sinon from 'sinon';
import chai from 'chai';
import { ACCOUNT, PROJECT, SESSION, OK_CODE, UNAUTHORIZED_CODE, CREATED_CODE } from './constants';
chai.use(require('sinon-chai'));

describe('Error Manager', () => {
    const { config, Router, authAdapter } = epicenter;
    let fakeServer;

    config.accountShortName = ACCOUNT;
    config.projectShortName = PROJECT;

    before(() => {
        fakeServer = sinon.fakeServer.create({logger: str => console.log('Fake server', str)});

        /* Mock erroneous calls */
        fakeServer.respondWith('GET', /(.*)\/unauthorized/, function(xhr, id) {
            /* Authentication invalidated assumes a session currently exists, it's just invalidated, setting one here */
            authAdapter.setLocalSession(SESSION);
            /* Provide call for invalidated authentication to trigger error handler upgrade */
            const RESPONSE = { information: { code: 'AUTHENTICATION_INVALIDATED' } };
            xhr.respond(UNAUTHORIZED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('PATCH', /(.*)\/authentication/, function(xhr, id) {
            /* Upgrade should return new session -- in this case use SSO login method b/c
             * the subsequent retry will always fail and login via SSO doesn't refresh the page (bad for tests) */
            const RESPONSE = { loginMethod: { objectType: 'sso' } };
            xhr.respond(OK_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(RESPONSE));
        });
        fakeServer.respondWith('DELETE', /(.*)\/verification/, (xhr, id) => {
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, 'true');
        });

        fakeServer.respondImmediately = true;
    });

    after(() => {
        fakeServer.restore();

        /* Since this test file messes w/ configuration, we should reset
         * it back to the appropriate values for other the .spec.js files */
        config.loadBrowser();
        config.accountShortName = ACCOUNT;
        config.projectShortName = PROJECT;
        config.authOverride = undefined;
    });

    describe('Error Handlers', () => {
        it('Should by default handle invalidated authentication via a PATCH to upgrade the session and retrying after', async() => {
            try {
                await new Router().get('/unauthorized');
            } catch (error) {
                /* Do nothing, it should error here */
            }
            // const retry = fakeServer.requests.pop();
            // const upgrade = fakeServer.requests.pop();
            // const get = fakeServer.requests.pop();
            
            //WHY IS IT LOGGING OUT TWICE??
            fakeServer.requests.pop(); //https://forio.com/api/v4/forio-dev/epi-v3/verification DELETE
            const retry = fakeServer.requests.pop(); //https://forio.com/api/v3/forio-dev/epi-v3/unauthorized GET
            const logout = fakeServer.requests.pop(); //https://forio.com/api/v3/forio-dev/epi-v3/verification DELETE
            const upgrade = fakeServer.requests.pop(); //https://forio.com/api/v3/forio-dev/epi-v3/authentication PATCH
            const get = fakeServer.requests.pop(); //https://forio.com/api/v3/forio-dev/epi-v3/unauthorized GET
            
            retry.url.should.equal(get.url);

            retry.method.toUpperCase().should.equal('GET');
            get.method.toUpperCase().should.equal('GET');
            upgrade.method.toUpperCase().should.equal('PATCH');
            upgrade.url.should.include('/authentication');
        });
    });
});

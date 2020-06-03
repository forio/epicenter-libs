import sinon from 'sinon';
import chai, { expect } from 'chai';
import { CREATED_CODE, SESSION } from './common';
chai.use(require('sinon-chai'));

describe('Authentication', () => {
    const { config, authAdapter } = epicenter;
    let server;

    before(() => {
        server = sinon.fakeServer.create();
        server.respondWith(/(.*)\/authentication/, (xhr, id) => {
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(SESSION));
        });
        server.respondImmediately = true;
    });

    after(() => {
        server.restore();
    });

    describe('Login Process', () => {
        it('Should Do a POST', async() => {
            await authAdapter.login({
                handle: 'joe',
                password: 'pass',
            })
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('POST');
                });
        });
        it('Should go to the right url', async() => {
            const endpoints = { account: 'forio-dev', project: 'epi-v3' };

            config.accountShortName = endpoints.account;
            config.projectShortName = endpoints.project;

            await authAdapter.login({
                handle: 'joe',
                password: 'pass',
            })
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`${config.apiProtocol}://${config.apiHost}/api/v${config.apiVersion}/${endpoints.account}/${endpoints.project}/authentication`);
                });
        });

        it('Should send requests to body', async() => {
            await authAdapter.login({
                handle: 'joe',
                password: 'pass',
                objectType: 'user',
            })
                .then((res) => {
                    const req = server.requests.pop();
                    req.requestBody.should.equal(JSON.stringify({
                        handle: 'joe',
                        password: 'pass',
                    }));
                });
        });
        it('Should not do a DELETE', async() => {
            server.requests = [];
            await authAdapter.logout()
                .then((res) => {
                    expect(authAdapter.getLocalSession()).to.equal(null);
                    server.requests.should.be.empty;
                });
        });
        it('Should store the authentication payload as the session', async() => {
            await authAdapter.login({
                handle: 'joe',
                password: 'pass',
            }).then((session) => expect(authAdapter.getLocalSession()).to.deep.equal(session));
        });
    });
});

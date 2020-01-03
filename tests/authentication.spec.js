import sinon from 'sinon';
import chai, { expect } from 'chai';
chai.use(require('sinon-chai'));

const OK_CODE = 200;
const CREATED_CODE = 201;

describe('Authentication', () => {
    const { config, identification, authentication } = epicenter;
    let server;
    let token;

    before(() => {
        token = 'tHDEVEueL7tuC8LYRj4lhWhYe3GDreWPzGx';
        server = sinon.fakeServer.create();
        server.respondWith(/(.*)\/config/, (xhr, id) => {
            xhr.respond(
                OK_CODE, { 'content-type': 'application/json' }, JSON.stringify({ api: { host: 'test.forio.com', protocol: 'https' }, clusterId: 'epicenter-test-monolith-1' })
            );
        });

        server.respondWith(/(.*)\/authentication/, (xhr, id) => {
            xhr.respond(CREATED_CODE, { 'Content-Type': 'application/json' }, JSON.stringify(
                { refresh_token: 'snip-refresh', access_token: token, expires: 43199 }
            ));
        });
        server.respondImmediately = true;
    });

    after(() => {
        server.restore();
        token = null;
    });

    describe('Login Process', () => {
        it('should Do a POST', async() => {
            await authentication.login({
                handle: 'joe',
                password: 'pass',
            })
                .then((res) => {
                    const req = server.requests.pop();
                    req.method.toUpperCase().should.equal('POST');
                });
        });
        it('should go to the right url', async() => {
            const endpoints = { account: 'forio-dev', project: 'epi-v3' };

            config.accountShortName = endpoints.account;
            config.projectShortName = endpoints.project;

            await authentication.login({
                handle: 'joe',
                password: 'pass',
                objectType: 'user',
            })
                .then((res) => {
                    const req = server.requests.pop();
                    req.url.should.equal(`https://${config.localConfigHost}/v${config.apiVersion}/${endpoints.account}/${endpoints.project}/authentication`);
                });
        });

        it('should send requests to body', async() => {
            await authentication.login({
                handle: 'joe',
                password: 'pass',
                objectType: 'user',
            })
                .then((res) => {
                    const req = server.requests.pop();
                    req.requestBody.should.equal(JSON.stringify({
                        handle: 'joe',
                        password: 'pass',
                        objectType: 'user',
                    }));
                });
        });
        it('should not do a DELETE', async() => {
            server.requests = [];
            await authentication.logout()
                .then((res) => {
                    expect(identification.session).to.equal(null);
                    server.requests.should.be.empty;
                });
        });
        it('should store the authentication payload as the session', async() => {
            await authentication.login({
                handle: 'joe',
                password: 'pass',
                objectType: 'user',
            }).then((res) => expect(identification.session).to.deep.equal(res.body));
        });
    });
});

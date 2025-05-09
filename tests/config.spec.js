import { ACCOUNT, PROJECT } from './constants';
describe('Global Configuration', () => {
    const { config } = epicenter;
    after(() => {
        config.setContext({
            accountShortName: ACCOUNT,
            projectShortName: PROJECT,
            useProjectProxy: false,
        });
    });
    it('Should be able to detect test site is using localhost', () => {
        config.isLocal().should.be.equal(true);
    });
    it('Should initialize with the proper protocol and host in a test environment', () => {
        config.apiProtocol.should.be.equal('https');
        config.apiHost.should.be.equal('forio.com');
    });
    it('Should accept config object via setContext', () => {
        config.setContext({
            apiProtocol: 'http',
            apiHost: 'localhost',
            useProjectProxy: true,
            accountShortName: 'account',
            projectShortName: 'project',
        });

        config.apiProtocol.should.be.equal('http');
        config.apiHost.should.be.equal('localhost');
        config.useProjectProxy.should.be.equal(true);
        config.accountShortName.should.be.equal('account');
        config.projectShortName.should.be.equal('project');

        config.setContext({
            useProjectProxy: false,
        });

        config.useProjectProxy.should.be.equal(false);
    });
    it('Should ignore sets for apiProtocol when setting values that aren\'t http', () => {
        config.apiProtocol = 'anything else';
        config.apiProtocol.should.not.be.equal('anything else');

        config.setContext({
            apiProtocol: 'anything else',
        });
        config.apiProtocol.should.not.be.equal('anything else');
    });
    it('Should ignore sets for apiVersion', () => {
        config.apiVersion = 100;
        config.apiVersion.should.not.be.equal(100);

        config.setContext({
            apiVersion: 100,
        });
        config.apiVersion.should.not.be.equal(100);
    });
});

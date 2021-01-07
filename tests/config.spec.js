
describe('Global Configuration', () => {
    const { config } = epicenter;
    it('Should be able to detect test site is using local.forio.com', () => {
        config.isLocal().should.be.equal(true);
    });
    it('Should initialize with the proper protocol and host in a test environment', () => {
        config.apiProtocol.should.be.equal('https');
        config.apiHost.should.be.equal('forio.com');
    });
    it('Should ignore sets for apiProtocol when setting values that aren\'t http', () => {
        config.apiProtocol = 'anything else';
        config.apiProtocol.should.not.be.equal('anything else');
    });
    it('Should ignore sets for apiVersion', () => {
        config.apiVersion = 4;
        config.apiVersion.should.not.be.equal(4);
    });
});

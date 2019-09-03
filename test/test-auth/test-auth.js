
const { utility, store, authentication, Channel, channelManager } = epicenter;
const userOne = {
    accountShortName: 'wallace',
    projectShortName: 'project',
    handle: 'wallace-dev0',
    password: 'admin123',
    groupKey: '0000016ccf590d85eecb2373547c5cfd95f2',
    // worldKey: '0000016ccf590d85eecb2373547c5cfd9a7f',
};
const userTwo = {
    accountShortName: 'wallace',
    projectShortName: 'project',
    handle: 'wallace-dev2',
    password: 'admin123',
    groupKey: '0000016ccf590d85eecb2373547c5cfd95f2',
};

describe('Authentication APIs', function() {
    after('Logout afterwards (just in case, to to reset test environment)', function(done) {
        authentication.logout()
            .then(() => done())
            .catch(done);
    });

    it('Should set/unset appropriate token', function(done) {
        authentication.authenticate(userOne)
            .then((res) => chai.expect(store.getItem(utility.AUTH_TOKEN)).to.exist)
            .then(() => authentication.logout())
            .then((res) => chai.expect(store.getItem(utility.AUTH_TOKEN)).to.not.exist)
            .then(() => done())
            .catch(done);
    });

    it('Should properly disconnect you from the channel', function(done) {
        authentication.authenticate(userOne)
            .then((res) => new Channel({
                scopeBoundary: utility.SCOPE_BOUNDARY.GROUP,
                scopeKey: userOne.groupKey,
                pushCategory: utility.PUSH_CATEGORY.PRESENCE,
                update: (message) => console.log(message),
            }).subscribe())
            .then(() => authentication.logout())
            .then((res) => chai.expect(channelManager.cometd.getStatus()).to.equal('disconnected'))
            .then(() => done())
            .catch(done);
    });
});

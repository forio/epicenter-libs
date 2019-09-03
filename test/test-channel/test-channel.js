
const { utility, authentication, Channel, channelManager } = epicenter;
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

describe('Channel APIs', function() {
    it('Unauthenticated access to the channel should throw an error', function(done) {
        const channel = new Channel({
            scopeBoundary: utility.SCOPE_BOUNDARY.GROUP,
            scopeKey: userOne.groupKey,
            pushCategory: utility.PUSH_CATEGORY.PRESENCE,
            update: (message) => console.log(message),
        });

        const failure = () => {};
        const spy = sinon.spy(failure);

        channel.subscribe()
            .then(() => chai.expect(spy.called).to.equal(true), failure)
            .then(() => done())
            .catch(done);
    });

    it('Channel subscribe call should establish a CometD connection if one does not already exist', function(done) {
        const channel = new Channel({
            scopeBoundary: utility.SCOPE_BOUNDARY.GROUP,
            scopeKey: userOne.groupKey,
            pushCategory: utility.PUSH_CATEGORY.PRESENCE,
            update: (message) => console.log(message),
        });
        channelManager.disconnect()
            .then(() => authentication.authenticate(userOne))
            .then(() => channel.subscribe())
            .then(() => chai.expect(channelManager.cometd.getStatus()).to.equal('connected'))
            .then(() => authentication.logout())
            .then(() => done())
            .catch(done);
    });

    it('Disconnect should flush all channel subscriptions', function(done) {
        const channel = new Channel({
            scopeBoundary: utility.SCOPE_BOUNDARY.GROUP,
            scopeKey: userOne.groupKey,
            pushCategory: utility.PUSH_CATEGORY.PRESENCE,
            update: (message) => console.log(message),
        });
        authentication.authenticate(userOne)
            .then((res) => channel.subscribe())
            .then(() => channelManager.disconnect())
            .then(() => chai.expect(channelManager.subscriptions.size).to.equal(0))
            .then(() => authentication.logout())
            .then(() => done())
            .catch(done);
    });
});

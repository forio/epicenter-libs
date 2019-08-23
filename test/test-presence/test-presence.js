const userOne = {
    accountShortName: 'berkent',
    projectShortName: 'foobar',
    handle: 'david.berkman',
    password: 'passw0rd',
    groupKey: '0000016c5387b8d2acbe17f8e6da0ca0a5a2',
};

const userTwo = {
    accountShortName: 'berkent',
    projectShortName: 'foobar',
    handle: 'david.berkman2',
    password: 'passw0rd',
    groupKey: '0000016c5387b8d2acbe17f8e6da0ca0a5a2',
};

describe('Presence APIs', () => {
    let clock;
    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('should alert channel on login', (done) => {
        const cometd = new org.cometd.CometD();
        const onMessage = (message) => {
            console.log(`$$$$$$$$$$$$$$$$0:${JSON.stringify(message)}`);
            console.log(`$$$$$$$$$$$$$$$$1:${message.type}`);
        };
        const onMessageSpy = sinon.spy(onMessage);

        epicenter.authentication.authenticate(userOne).then((res) => {
            cometd.registerExtension('reload', new org.cometd.ReloadExtension());
            const channelManager = new epicenter.channel.ChannelManager(cometd, 'error', false, {
                scopeBoundary: epicenter.utility.ScopeBoundary.GROUP,
                scopeKey: '0000016c5387b8d2acbe17f8e6da0ca0a5a2',
                pushCategory: epicenter.utility.PushCategory.PRESENCE,
                messageCallback: onMessage,
            });
            window.onunload = channelManager.reload;
            return channelManager.handshake();
        })
            .catch((fault) => console.error(JSON.stringify(fault)))
            .then(() => epicenter.authentication.authenticate(userTwo))
            .then((res) => {
                clock.tick(20000);
                chai.expect(onMessageSpy.calledOnce, 'Received no update from channel after 100ms').to.equal(true);
            })
            .then(done)
            .catch(done);
    });

    it('should accurately report the number of users online', (done) => {
        epicenter.presence.forGroup(userOne.groupKey, { accountShortName: userOne.accountShortName }).then((res) => {
            chai.expect(res.body).with.length(2);
        })
            .then(done)
            .catch(done);
    });
});

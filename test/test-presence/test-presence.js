
const { Channel } = epicenter;
const userOne = {
    accountShortName: 'wallace',
    projectShortName: 'project',
    handle: 'wallace-dev0',
    password: 'admin123',
    groupKey: '0000016ccf590d85eecb2373547c5cfd95f2',
    worldKey: '0000016ccf590d85eecb2373547c5cfd9a7f',
};
const userTwo = {
    accountShortName: 'wallace',
    projectShortName: 'project',
    handle: 'wallace-dev2',
    password: 'admin123',
    groupKey: '0000016ccf590d85eecb2373547c5cfd95f2',
};

describe('Presence APIs', function() {
    it('Should accurately report the number of users online in the group', function(done) {
        this.timeout(0);
        const onMessage = (message) => {
            console.log(`$$$$$$$$$$$$$$$$0:${JSON.stringify(message)}`);
            console.log(`$$$$$$$$$$$$$$$$1:${message.type}`);
        };

        let numUsersBefore;
        let numUsersAfter;
        let waitTime;

        // Login as a user without a world & subscribe to the group ch
        epicenter.authentication.authenticate(userTwo)
            .then((res) => {
                const presenceChannel = new Channel({
                    scopeBoundary: epicenter.utility.SCOPE_BOUNDARY.GROUP,
                    scopeKey: userTwo.groupKey,
                    pushCategory: epicenter.utility.PUSH_CATEGORY.PRESENCE,
                    update: onMessage,
                });
                return presenceChannel.subscribe();
            })
            .then(() => epicenter.presence.forGroup(userTwo.groupKey, {
                accountShortName: userTwo.accountShortName,
                projectShortName: userTwo.projectShortName,
            }))
            .then((res) => {
                numUsersBefore = res.body.length;
                waitTime = Math.round(res.body[0].ttlSeconds / 2) * 1000 + 5000;
            })
            .then(() => epicenter.channelManager.disconnect())
            .then(() => new Promise((resolve, reject) => setTimeout(() => resolve(), waitTime)))
            .then(() => epicenter.presence.forGroup(userTwo.groupKey, {
                accountShortName: userTwo.accountShortName,
                projectShortName: userTwo.projectShortName,
            }))
            .then((res) => numUsersAfter = res.body.length)
            .then(() => chai.expect(numUsersBefore).to.equal(numUsersAfter + 1))
            .then(() => done())
            .catch(done);
    });

    it('Should clean up session between authenticates', function(done) {
        this.timeout(0);

        const onMessage = (message) => {
            console.log(`$$$$$$$$$$$$$$$$0:${JSON.stringify(message)}`);
            console.log(`$$$$$$$$$$$$$$$$1:${message.type}`);
        };

        // Login as a user without a world & subscribe to the group ch
        epicenter.authentication.authenticate(userTwo)
            .then((res) => {
                const presenceChannel = new Channel({
                    scopeBoundary: epicenter.utility.SCOPE_BOUNDARY.GROUP,
                    scopeKey: userTwo.groupKey,
                    pushCategory: epicenter.utility.PUSH_CATEGORY.PRESENCE,
                    update: onMessage,
                });
                return presenceChannel.subscribe();
            })
            .then(() => epicenter.presence.forGroup(userTwo.groupKey, {
                accountShortName: userTwo.accountShortName,
                projectShortName: userTwo.projectShortName,
            }))
            // Purposely do no cleanup, and just log into a different user;
            // this one belongs to a world and wants to sub to world ch
            .then(() => epicenter.authentication.authenticate(userOne))
            .then((res) => {
                const presenceChannel = new Channel({
                    scopeBoundary: epicenter.utility.SCOPE_BOUNDARY.WORLD,
                    scopeKey: userOne.worldKey,
                    pushCategory: epicenter.utility.PUSH_CATEGORY.PRESENCE,
                    update: onMessage,
                });
                return presenceChannel.subscribe();
            })
            .then(() => epicenter.presence.forWorld(userOne.worldKey, {
                accountShortName: userOne.accountShortName,
                projectShortName: userOne.projectShortName,
            }))
            .then(() => done())
            .catch(done);
    });
});

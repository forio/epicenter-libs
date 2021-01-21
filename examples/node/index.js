// const epicenter = require('epicenter');
// require('cometd-nodejs-client').adapt();
// const lib = require('cometd');

const { authAdapter, SCOPE_BOUNDARY } = require('./epicenter.cjs.js');
// import { authAdapter, SCOPE_BOUNDARY } from 'epicenter';

console.log('epicenter?', authAdapter);

// const { authAdapter, SCOPE_BOUNDARY } = epicenter;
authAdapter.login({
    handle: 'wallace-fac',
    password: 'admin123',
}, {
    accountShortName: 'forio-dev',
    projectShortName: 'epi-v3',
}).then((foo) => {
    console.log('adododo', foo);

    // const cometd = new lib.CometD();
    // const channelManager = new epicenter.channel.ChannelManager(cometd, 'error', false, {
    //     scopeBoundary: SCOPE_BOUNDARY.GROUP, scopeKey: '0000016c5387b8d2acbe17f8e6da0ca0a5a2', pushCategory: epicenter.utility.PushCategory.PRESENCE, messageCallback: (message) => {
    //         console.log(`$$$$$$$$$$$$$$$$0:${JSON.stringify(message)}`);
    //         console.log(`$$$$$$$$$$$$$$$$1:${message.type}`);
    //         epicenter.presence.group({accountShortName: 'berkent', projectShortName: 'foobar', groupKey: '0000016c5387b8d2acbe17f8e6da0ca0a5a2'}).then((bar) => console.log(JSON.stringify(bar)));
    //     },
    // });

    // channelManager.handshake();
}).catch((fault) => console.log('adadad', fault, JSON.stringify(fault)));

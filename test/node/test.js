import * as epicenter from 'epicenter-libs';
import {createRequire} from 'module';
import {fileURLToPath as fromURL} from 'url';

const require = createRequire(fromURL(import.meta.url));

require('cometd-nodejs-client').adapt();
const lib = require('cometd');

epicenter.authentication.authenticate({
    accountShortName: 'berkent',
    projectShortName: 'foobar',
    handle: 'david.berkman',
    password: 'passw0rd',
    groupKey: '0000016c5387b8d2acbe17f8e6da0ca0a5a2',
    objectType: 'user',
}).then((foo) => {
    console.log(foo);

    const cometd = new lib.CometD();
    const channelManager = new epicenter.channel.ChannelManager(cometd, 'error', false, {
        scopeBoundary: epicenter.utility.ScopeBoundary.GROUP, scopeKey: '0000016c5387b8d2acbe17f8e6da0ca0a5a2', pushCategory: epicenter.utility.PushCategory.PRESENCE, messageCallback: (message) => {
            console.log(`$$$$$$$$$$$$$$$$0:${JSON.stringify(message)}`);
            console.log(`$$$$$$$$$$$$$$$$1:${message.type}`);
            epicenter.presence.forGroup('0000016c5387b8d2acbe17f8e6da0ca0a5a2', {accountShortName: 'berkent', projectShortName: 'foobar'}).then((bar) => console.log(JSON.stringify(bar)));
        },
    });

    channelManager.handshake();

    /*
    epicenter.authentication.upgrade(new epicenter.authentication.AdminUpgrade('berkteam'))
        .then(foo => {
        console.log(foo);

        epicenter.account.create(new epicenter.account.TeamAccountCreator('Berk Team', 'berkteam', '12323', 'ENTERPRISE', 'YEARLY'))
            .then(foo => console.log(foo))
            .catch(fault => console.log(JSON.stringify(fault)));
        })
        .catch(fault => console.log(JSON.stringify(fault)));
        */
}).catch((fault) => console.log(fault, JSON.stringify(fault)));

/*
epicenter.authentication.authenticate(new epicenter.authentication.AdminAuthenticationToken('dberkman@forio.com', 'logos1174!'))
  .then(foo => {
    console.log(foo);

    let cometd = new lib.CometD();
    let channelManager = new epicenter.channel.ChannelManager(cometd, 'debug', new epicenter.channel.Channel(epicenter.utility.ScopeBoundary.PROJECT, '0000016c5387b8d2acbe17f8e6da0ca0a48e', epicenter.utility.PushCategory.PRESENCE, (message) => console.log('$$$$$$$$$$$$$$$$:' + message)));

    channelManager.handshake();


    epicenter.authentication.upgrade(new epicenter.authentication.AdminUpgrade('berkteam'))
      .then(foo => {
        console.log(foo);

        epicenter.account.create(new epicenter.account.TeamAccountCreator('Berk Team', 'berkteam', '12323', 'ENTERPRISE', 'YEARLY'))
          .then(foo => console.log(foo))
          .catch(fault => console.log(JSON.stringify(fault)));
      })
      .catch(fault => console.log(JSON.stringify(fault)));

  })
  .catch(fault => console.log(JSON.stringify(fault)));
*/
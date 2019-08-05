import * as epicenter from 'epicenter-libs';
import {createRequire} from 'module';
import {fileURLToPath as fromURL} from 'url';

const require = createRequire(fromURL(import.meta.url));

require('cometd-nodejs-client').adapt();
const lib = require('cometd');

epicenter.authentication.authenticate(new epicenter.authentication.AdminAuthenticationToken("dberkman@forio.com", "logos1174!"))
  .then(foo => {
    console.log(foo);


    let cometd = new lib.CometD();
    let channelManager = new epicenter.channel.ChannelManager(cometd, 'debug');

    channelManager.handshake();

    /*
    epicenter.authentication.upgrade(new epicenter.authentication.AdminUpgrade("berkteam"))
      .then(foo => {
        console.log(foo);

        epicenter.account.create(new epicenter.account.TeamAccountCreator("Berk Team", "berkteam", "12323", "ENTERPRISE", "YEARLY"))
          .then(foo => console.log(foo))
          .catch(fault => console.log(JSON.stringify(fault)));
      })
      .catch(fault => console.log(JSON.stringify(fault)));
     */
  })
  .catch(fault => console.log(JSON.stringify(fault)));
import * as utility from './utility.js';

import {createRequire} from 'module';
import {fileURLToPath as fromURL} from 'url';

const AUTH_TOKEN_KEY = "com.forio.epicenter.token";
const URL = "https://test.forio.com:9015/epicenter/websocket/cometd";

const require = createRequire(fromURL(import.meta.url));

class CometDChannel {

  constructor() {

    if (typeof window == 'undefined') {
      require('cometd-nodejs-client').adapt();
    }

    var lib = require('cometd');

    this.cometd = new lib.CometD();
  }

  connect() {

    console.log("1..........................................");

    this.cometd.websocketEnabled = true;

    this.cometd.configure({
      url: URL
    });

    console.log("2..........................................");
    this.cometd.handshake({
      ext: {
        AUTH_KEY_TOKEN: ""
      }
    }, function (handshakeReply) {
      console.log("3..........................................");
      console.log(handshakeReply);
      if (!handshakeReply.successful) {
        throw new utility.EpicenterError(`Unable to connect to the CometD server at ${URL}`);
      }
    });

    console.log("4..........................................");
  }
}

export const ChannelManager = new CometDChannel();
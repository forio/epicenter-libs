import * as store from './store.js';
import * as utility from './utility.js';
import {createRequire} from 'module';
import {fileURLToPath as fromURL} from 'url';

const AUTH_TOKEN_KEY = "com.forio.epicenter.token";
const URL = "http://epistage1.foriodev.com:9015/epicenter/cometd";

const require = createRequire(fromURL(import.meta.url));

class CometDChannel {

  constructor() {

    if (typeof window == 'undefined') {
      require('cometd-nodejs-client').adapt();
    }

    let lib = require('cometd');

    this.cometd = new lib.CometD();
  }

  connect() {

    this.cometd.configure({
      url: URL,
    });

    let handshakeProps = {};
    let authToken = store.StorageManager.getItem(utility.AUTH_TOKEN);

    if (authToken) {
      handshakeProps = {
        ext: {
          [AUTH_TOKEN_KEY]: authToken
        }
      }
    }

    this.cometd.websocketEnabled = true;

    this.cometd.handshake(handshakeProps, function (handshakeReply) {
        if (!handshakeReply.successful) {
          throw new utility.EpicenterError(`Unable to connect to the CometD server at ${URL}`);
        }
      }
    );
  }
}

const cometDChannel = new CometDChannel();

export function connect() {

  cometDChannel.connect();
}
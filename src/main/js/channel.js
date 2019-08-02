import * as store from './store.js';
import * as utility from './utility.js';

const AUTH_TOKEN_KEY = "com.forio.epicenter.token";
const URL = "http://epistage1.foriodev.com:9015/epicenter/cometd";

const State = {
  DISCONNECTED: 0,
  CONNECTING: 1,
  CONNECTED: 2,
};

export class Channel {

  constructor(cometd) {

    this.cometd = cometd;
    this.state = State.DISCONNECTED;

    this.cometd.configure({
      url: URL
    });
  }

  connect() {

    if (this.state !== State.CONNECTED) {
      if (this.state === State.CONNECTING) {
        setTimeout(() => this.connect(), 500)
      } else {
        this.state = State.CONNECTING;

        let handshakeProps = {};
        let authToken = store.StorageManager.getItem(utility.AUTH_TOKEN);

        if (authToken) {
          handshakeProps = {
            ext: {
              [AUTH_TOKEN_KEY]: authToken,
              ack: true,
            }
          }
        }

        this.cometd.ackEnabled = true;
        this.cometd.websocketEnabled = true;

        this.cometd.handshake(handshakeProps, (handshakeReply) => {
            if (handshakeReply.successful) {
              this.state = State.CONNECTED;
            } else {
              this.state = State.DISCONNECTED;
              throw new utility.EpicenterError(`Unable to connect to the CometD server at ${URL}`);
            }
          }
        );
      }
    }
  }
}
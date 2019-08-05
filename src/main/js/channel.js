import * as router from './router.js';
import * as store from './store.js';
import * as utility from './utility.js';

const AUTH_TOKEN_KEY = "com.forio.epicenter.token";
const COMETD_URL_POSTSCRIPT = ":9015/epicenter/cometd";

const State = {
  DISCONNECTED: 0,
  CONNECTING: 1,
  CONNECTED: 2
};

export class Channel {

  #scopeBoundary;
  #scopeKey;
  #pushCategory;

  constructor(scopeBoundary, scopeKey, pushCategory, messageCallback) {

    this.#scopeBoundary = scopeBoundary;
    this.#scopeKey = scopeKey;
    this.#pushCategory = pushCategory;
    this._messageCallback = messageCallback;
  }

  get messageCallback() {

    return this._messageCallback;
  }

  compose() {

    return "/" + this.#scopeBoundary + "/" + this.#scopeKey + "/" + this.#pushCategory;
  }
}

export class ChannelManager {

  #cometd;
  #state;

  constructor(cometd, logLevel = 'error', ...channels) {

    this.#cometd = cometd;
    this.#state = State.DISCONNECTED;

    this.#cometd.configure({
      url: router.getApiHttpScheme() + "://" + router.getApiHttpHost() + COMETD_URL_POSTSCRIPT,
      logLevel: logLevel
    });

    this.#cometd.addListener("/meta/handshake", (handshakeReply) => {
      if (handshakeReply.successful) {
        if (channels) {
          this.#cometd.batch(() => {
            channels.forEach((channel) => {
              this.#cometd.subscribe(channel.compose(), channel.messageCallback,
                (subscribeReply) => {
                  if (!subscribeReply.successful) {
                    throw new utility.EpicenterError(`Unable to subscribe to the channel ${channel.compose()}`);
                  }
                });
            });
          });
        }
      }
    });
  }

  reload() {

    this.#cometd.reload();
  }

  handshake() {

    if (this.#state !== State.CONNECTED) {
      if (this.#state === State.CONNECTING) {
        setTimeout(() => this.handshake(), 500)
      } else {
        this.#state = State.CONNECTING;

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

        this.#cometd.ackEnabled = true;
        this.#cometd.websocketEnabled = true;

        this.#cometd.handshake(handshakeProps, (handshakeReply) => {
            if (handshakeReply.successful) {
              this.#state = State.CONNECTED;
            } else {
              this.#state = State.DISCONNECTED;
              throw new utility.EpicenterError(`Unable to connect to the CometD server at ${URL}`);
            }
          }
        );
      }
    }
  }
}
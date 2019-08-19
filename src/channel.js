import * as router from './router.js';
import * as store from './store.js';
import * as utility from './utility.js';

/*
  Example of use with dojo and the reload extension, similar code should work for jquery and other extensions.
  if imported, the 'ack' extension may be properly initialized by setting the 'requireAcknowledgement' flag)...

        <script type="text/javascript" src="dojo.js"></script>
        <script type="text/javascript">
            require(["dojo", "dojo/on", "dojox/cometd", "dojox/cometd/reload", "dojo/domReady!"],
            function (dojo, on, cometd) {
              let channelManager = new epicenter.channel.ChannelManager(cometd, 'error', true,
                new epicenter.channel.Channel(epicenter.utility.ScopeBoundary.PROJECT, "0000016c5387b8d2acbe17f8e6da0ca0a48e", epicenter.utility.PushCategory.PRESENCE,
                  (message) => console.log(message)));

              on(window, "beforeunload", channelManager.reload);

              channelManager.handshake();
            }
        </script>
*/

const AUTH_TOKEN_KEY = 'com.forio.epicenter.token';
const COMETD_URL_POSTSCRIPT = ':9015/epicenter/cometd';

const State = {
    DISCONNECTED: 0,
    CONNECTING: 1,
    CONNECTED: 2,
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

        return `/${this.#scopeBoundary}/${this.#scopeKey}/${this.#pushCategory}`;
    }
}

export class ChannelManager {

    #cometd;
    #state;
    #requireAcknowledgement;

    constructor(cometd, logLevel = 'error', requireAcknowledgement = false, ...channels) {

        this.#cometd = cometd;
        this.#state = State.DISCONNECTED;
        this.#requireAcknowledgement = requireAcknowledgement;

        this.#cometd.configure({
            url: `${router.getApiHttpScheme() }://${ router.getApiHttpHost() }${COMETD_URL_POSTSCRIPT}`,
            logLevel: logLevel,
        });

        this.#cometd.addListener('/meta/handshake', (handshakeReply) => {
            if (handshakeReply.successful) {
                if (channels) {

                    let subscribeProps = {};
                    const authToken = store.StorageManager.getItem(utility.AUTH_TOKEN);

                    if (authToken) {
                        subscribeProps = {
                            ext: {
                                [AUTH_TOKEN_KEY]: authToken,
                            },
                        };
                    }

                    this.#cometd.batch(() => {
                        channels.forEach((channel) => {
                            this.#cometd.subscribe(channel.compose(), (message) => channel.messageCallback(JSON.parse(message.data)), subscribeProps,
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

    reload = () => {

        this.#cometd.reload();
        // window.sessionStorage.setItem(stateKey, JSON.stringify({
        //     username: _username,
        //     useServer: _id('useServer').prop('checked'),
        //     altServer: _id('altServer').val()
        // }));
        this.#cometd.getTransport().abort();
    };

    handshake() {

        if (this.#state !== State.CONNECTED) {
            if (this.#state === State.CONNECTING) {
                setTimeout(() => this.handshake(), 500);
            } else {
                this.#state = State.CONNECTING;

                let handshakeProps = {};
                const authToken = store.StorageManager.getItem(utility.AUTH_TOKEN);

                if (authToken) {
                    handshakeProps = {
                        ext: {
                            [AUTH_TOKEN_KEY]: authToken,
                            ack: this.#requireAcknowledgement,
                        },
                    };
                }

                this.#cometd.ackEnabled = this.#requireAcknowledgement;
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
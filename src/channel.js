import store from './store.js';
import config from './config.js';
import * as utility from './utility.js';

/*
  Example of use with dojo and the reload extension, similar code should work for jquery and other extensions.
  if imported, the 'ack' extension may be properly initialized by setting the 'requireAcknowledgement' flag)...

        <script type="text/javascript" src="dojo.js"></script>
        <script type="text/javascript">
            require(["dojo", "dojo/on", "dojox/cometd", "dojox/cometd/reload", "dojo/domReady!"],
            function (dojo, on, cometd) {
              let channelManager = new epicenter.channel.ChannelManager(cometd, 'error', true,
                {scopeBoundary: epicenter.utility.ScopeBoundary.PROJECT, scopeKey: "0000016c5387b8d2acbe17f8e6da0ca0a48e", pushCategory: epicenter.utility.PushCategory.PRESENCE,
                  messageCallback: (message) => console.log(message)});

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

function compose(channel) {

    return `/${channel.scopeBoundary}/${channel.scopeKey}/${channel.pushCategory}`;
}

export class ChannelManager {

    #cometd;
    #state;
    #url;
    #requireAcknowledgement;

    constructor(cometd, logLevel = 'error', requireAcknowledgement = false, ...channels) {

        this.#cometd = cometd;
        this.#state = State.DISCONNECTED;
        this.#requireAcknowledgement = requireAcknowledgement;
        this.initialized = this.init(logLevel, channels);
    }

    async init(logLevel, channels) {
        await config.load();
        this.#url = `${config.apiScheme}://${config.apiHost}${COMETD_URL_POSTSCRIPT}`;
        this.#cometd.configure({
            url: this.#url,
            logLevel: logLevel,
        });
        this.#cometd.addListener('/meta/handshake', (handshakeReply) => {
            if (handshakeReply.successful) {
                if (channels) {

                    let subscribeProps = {};
                    const authToken = store.getItem(utility.AUTH_TOKEN);

                    if (authToken) {
                        subscribeProps = {
                            ext: {
                                [AUTH_TOKEN_KEY]: authToken,
                            },
                        };
                    }

                    this.#cometd.batch(() => {
                        channels.forEach((channel) => {
                            this.#cometd.subscribe(compose(channel), (message) => channel.messageCallback(JSON.parse(message.data)), subscribeProps,
                                (subscribeReply) => {
                                    if (!subscribeReply.successful) {
                                        throw new utility.EpicenterError(`Unable to subscribe to the channel ${compose(channel)}`);
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
        // Store any channel related things you need in session storage
        // window.sessionStorage.setItem(stateKey, JSON.stringify({
        //     username: _username,
        //     useServer: _id('useServer').prop('checked'),
        //     altServer: _id('altServer').val()
        // }));
        this.#cometd.getTransport().abort();
    };

    async handshake() {
        await this.initialized;
        if (this.#state !== State.CONNECTED) {
            if (this.#state === State.CONNECTING) {
                setTimeout(() => this.handshake(), 500);
            } else {
                this.#state = State.CONNECTING;

                let handshakeProps = {};
                const authToken = store.getItem(utility.AUTH_TOKEN);

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
                        throw new utility.EpicenterError(`Unable to connect to the CometD server at ${this.#url}`);
                    }
                });
            }
        }
    }
}
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cometdAdapter, errorManager } from './common';

const { Channel } = globalThis.epicenter;
const OPEN = 1;
const CLOSED = 3;
const ABNORMAL_CLOSURE = 1006;
const WAIT_MS = 2000;
const POLL_MS = 5;
const SETTLE_MS = 20;

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const until = async (predicate, label, ms = WAIT_MS) => {
    const start = Date.now();
    while (!predicate()) {
        if (Date.now() - start > ms) throw new Error(`Timed out waiting for ${label}`);
        await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    }
};

const fakeSocketClass = (server) => class FakeSocket {
    readyState = 0;

    constructor(url) {
        this.url = url;
        setTimeout(() => {
            this.readyState = OPEN;
            this.onopen?.();
        }, 0);
    }

    send(text) {
        setTimeout(() => server.receive(this, JSON.parse(text)), 0);
    }

    close(code = 1000, reason = '') {
        if (this.readyState === CLOSED) return;
        this.readyState = CLOSED;
        setTimeout(() => this.onclose?.({ code, reason }), 0);
    }

    deliver(messages) {
        if (this.readyState === OPEN) this.onmessage?.({ data: JSON.stringify(messages) });
    }
};

class FakeBayeux {
    sessions = new Map();
    wire = [];
    serial = 0;
    heldHandshakes = undefined;

    receive(socket, messages) {
        for (const message of messages) {
            this.wire.push(message);
            const reply = { id: message.id, channel: message.channel };
            if (message.channel === '/meta/handshake' && this.heldHandshakes) {
                this.heldHandshakes.push({ socket, message });
                continue;
            }
            if (message.channel === '/meta/handshake') {
                const clientId = `client-${++this.serial}`;
                this.sessions.set(clientId, { socket, subscriptions: new Set(), heldConnect: undefined });
                socket.deliver([{
                    ...reply, successful: true, version: '1.0', clientId,
                    supportedConnectionTypes: ['websocket'],
                    advice: { reconnect: 'retry', interval: 0, timeout: 30000 },
                }]);
                continue;
            }
            const session = this.sessions.get(message.clientId);
            if (!session) {
                socket.deliver([{
                    ...reply, successful: false, error: '402::session_unknown',
                    advice: { reconnect: 'handshake', interval: 0 },
                }]);
                continue;
            }
            session.socket = socket;
            if (message.channel === '/meta/connect') {
                if (session.connected) {
                    session.heldConnect = { socket, reply };
                } else {
                    session.connected = true;
                    socket.deliver([{ ...reply, successful: true, advice: { reconnect: 'retry', interval: 0, timeout: 30000 } }]);
                }
            } else if (message.channel === '/meta/subscribe') {
                session.subscriptions.add(message.subscription);
                socket.deliver([{ ...reply, successful: true, subscription: message.subscription }]);
            } else if (message.channel === '/meta/unsubscribe') {
                session.subscriptions.delete(message.subscription);
                socket.deliver([{ ...reply, successful: true, subscription: message.subscription }]);
            } else if (message.channel === '/meta/disconnect') {
                this.sessions.delete(message.clientId);
                socket.deliver([{ ...reply, successful: true }]);
            } else {
                socket.deliver([{ ...reply, successful: true }]);
            }
        }
    }

    holdHandshakes() {
        this.heldHandshakes = [];
    }

    releaseHandshakes() {
        const held = this.heldHandshakes;
        this.heldHandshakes = undefined;
        held.forEach(({ socket, message }) => this.receive(socket, [message]));
    }

    publish(channel, data) {
        let delivered = 0;
        for (const session of this.sessions.values()) {
            if (session.subscriptions.has(channel) && session.socket.readyState === OPEN) {
                session.socket.deliver([{ channel, data }]);
                delivered++;
            }
        }
        return delivered;
    }

    expire(clientId) {
        const session = this.sessions.get(clientId);
        this.sessions.delete(clientId);
        const held = session.heldConnect;
        held.socket.deliver([{
            ...held.reply, successful: false, error: '402::session_unknown',
            advice: { reconnect: 'handshake', interval: 0 },
        }]);
    }

    dropSocket(clientId) {
        this.sessions.get(clientId).socket.close(ABNORMAL_CLOSURE, 'abnormal');
    }

    subscriptionsOf(clientId) {
        return [...(this.sessions.get(clientId)?.subscriptions ?? [])];
    }
}

const projectResponse = () => new Response(
    JSON.stringify({ channelEnabled: true, channelProtocol: 'COMETD' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
);

describe('Push recovery against a Bayeux server', () => {
    let server;
    let handlers;
    let originalWebSocket;

    const reset = () => {
        cometdAdapter.initialization = undefined;
        cometdAdapter.handshakePromise = undefined;
        cometdAdapter.handshakeState = 'idle';
        cometdAdapter.isConnected = false;
        cometdAdapter.subscriptions.clear();
        cometdAdapter.pendingOperations = [];
        cometdAdapter.processingQueue = false;
    };
    const on = (code, fn) => {
        handlers.push(errorManager.registerHandler((error) => error.code === code, async (error) => fn(error)));
    };
    const clientId = () => cometdAdapter.cometd.getClientId();
    const connectedAs = (id) => () => cometdAdapter.isConnected && clientId() && clientId() !== id;

    const subscribed = async (channel, received) => {
        await channel.subscribe((data) => received.push(data));
        await until(() => cometdAdapter.isConnected, 'initial connect');
        await until(() => server.sessions.get(clientId())?.heldConnect, 'steady-state long poll');
        expect(server.publish(channel.path, { sequence: 1 })).toBe(1);
        await until(() => received.length === 1, 'baseline delivery');
    };

    beforeEach(() => {
        server = new FakeBayeux();
        handlers = [];
        originalWebSocket = window.WebSocket;
        window.WebSocket = fakeSocketClass(server);
        globalThis.mockFetch.mockImplementation(() => Promise.resolve(projectResponse()));
        reset();
    });

    afterEach(async () => {
        handlers.forEach((handler) => handler.unregister());

        await Promise.race([cometdAdapter.disconnect().catch(() => undefined), until(() => false, '', 200).catch(() => undefined)]);
        window.WebSocket = originalWebSocket;
        reset();
    });

    describe('EPILIBS-241', () => {
        it('EPILIBS-241: Control: transport loss with a retained session keeps delivering, without resubscribing', async () => {
            const restored = [];
            on('COMETD_RESUBSCRIBED', (error) => restored.push(error));
            const channel = new Channel({ scopeBoundary: 'WORLD', scopeKey: 'w1', pushCategory: 'RUN' });
            const received = [];
            await subscribed(channel, received);
            const prior = clientId();
            const subscribes = server.wire.filter((m) => m.channel === '/meta/subscribe').length;

            const oldSocket = server.sessions.get(prior).socket;
            server.dropSocket(prior);
            await until(() => server.sessions.get(prior)?.heldConnect?.socket !== oldSocket, 'long poll on a new socket');
            await tick();

            expect(clientId()).toBe(prior);
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 2, 'post-retry delivery');
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
            expect(server.wire.filter((m) => m.channel === '/meta/subscribe').length).toBe(subscribes);
            expect(restored).toEqual([]);
        });

        it('EPILIBS-241: Restores subscriptions on the server and the client when the server replaces the session', async () => {
            const channel = new Channel({ scopeBoundary: 'WORLD', scopeKey: 'w1', pushCategory: 'RUN' });
            const received = [];
            await subscribed(channel, received);
            const prior = clientId();

            server.expire(prior);
            await until(connectedAs(prior), 'new session');
            await until(() => server.subscriptionsOf(clientId()).length > 0, 'server-side resubscription');

            expect(server.subscriptionsOf(clientId())).toEqual([channel.path]);
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 2, 'delivery after session replacement');
            await tick();
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
        });

        it('EPILIBS-241: Unsubscribing through a handle issued before session replacement really unsubscribes', async () => {
            const channel = new Channel({ scopeBoundary: 'WORLD', scopeKey: 'w1', pushCategory: 'RUN' });
            const received = [];
            await subscribed(channel, received);
            const prior = clientId();
            server.expire(prior);
            await until(connectedAs(prior), 'new session');
            await until(() => server.subscriptionsOf(clientId()).length > 0, 'server-side resubscription');

            await channel.unsubscribe();

            expect(server.subscriptionsOf(clientId())).toEqual([]);
            expect(cometdAdapter.subscriptions.size).toBe(0);
            server.publish(channel.path, { sequence: 2 });
            cometdAdapter.cometd.receive?.({ channel: channel.path, data: { sequence: 3 } });
            await tick();
            expect(received).toEqual([{ sequence: 1 }]);
        });

        it.each([
            { label: 'without recovery', recover: false },
            { label: 'after recovery', recover: true },
        ])('EPILIBS-241: An obsolete Channel cannot unsubscribe its replacement $label', async ({ recover }) => {
            const scope = { scopeBoundary: 'WORLD', scopeKey: 'w1', pushCategory: 'RUN' };
            const original = new Channel(scope);
            await subscribed(original, []);

            if (recover) {
                const prior = clientId();
                server.expire(prior);
                await until(connectedAs(prior), 'new session');
                await until(() => server.subscriptionsOf(clientId()).includes(original.path), 'restored subscription');
            }

            const replacement = new Channel(scope);
            const received = [];
            await replacement.subscribe((data) => received.push(data));
            expect(server.publish(replacement.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 1, 'replacement delivery');

            await original.unsubscribe();

            expect(server.subscriptionsOf(clientId())).toEqual([replacement.path]);
            expect(cometdAdapter.subscriptions.get(replacement.path)).toBe(replacement.subscription);
            expect(server.publish(replacement.path, { sequence: 3 })).toBe(1);
            await until(() => received.length === 2, 'delivery after obsolete unsubscribe');
            expect(received).toEqual([{ sequence: 2 }, { sequence: 3 }]);
        });

        it('EPILIBS-241: An application that resubscribes on a new clientId itself still receives each message exactly once', async () => {
            const channel = new Channel({ scopeBoundary: 'WORLD', scopeKey: 'w1', pushCategory: 'RUN' });
            const received = [];
            await subscribed(channel, received);
            const prior = clientId();

            let workaround;
            cometdAdapter.cometd.addListener('/meta/handshake', (message) => {
                if (message.successful && message.clientId !== prior) {
                    workaround = channel.subscribe((data) => received.push(data));
                }
            });

            server.expire(prior);
            await until(connectedAs(prior), 'new session');
            await until(() => workaround, 'workaround to run');
            await workaround;
            await until(() => server.sessions.get(clientId())?.heldConnect, 'steady state');

            expect(server.subscriptionsOf(clientId())).toEqual([channel.path]);
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length >= 2, 'delivery');
            await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
        });

        it('EPILIBS-241: Signals COMETD_RESUBSCRIBED once, after the server has acknowledged the restored subscriptions', async () => {
            const restored = [];
            on('COMETD_RESUBSCRIBED', (error) => {
                restored.push({ information: error.information, serverHas: server.subscriptionsOf(clientId()) });
            });
            const channel = new Channel({ scopeBoundary: 'WORLD', scopeKey: 'w1', pushCategory: 'RUN' });
            await subscribed(channel, []);
            const prior = clientId();

            server.expire(prior);
            await until(() => restored.length > 0, 'resubscribed signal');
            await tick();

            expect(restored).toHaveLength(1);
            expect(restored[0].serverHas).toEqual([channel.path]);
            expect(restored[0].information).toMatchObject({ channels: [channel.path], clientId: clientId() });
        });

        it('EPILIBS-241: A subscribe issued while CometD is re-handshaking receives each message exactly once', async () => {
            const channel = new Channel({ scopeBoundary: 'WORLD', scopeKey: 'w1', pushCategory: 'RUN' });
            await subscribed(channel, []);
            const prior = clientId();
            const late = new Channel({ scopeBoundary: 'WORLD', scopeKey: 'w2', pushCategory: 'RUN' });
            const lateReceived = [];
            let pending;
            cometdAdapter.cometd.addListener('/meta/connect', (message) => {
                if (!message.successful && !pending) pending = late.subscribe((data) => lateReceived.push(data));
            });

            server.expire(prior);
            await until(connectedAs(prior), 'new session');
            await pending;
            await until(() => server.subscriptionsOf(clientId()).includes(late.path), 'late subscription on server');

            expect(server.publish(late.path, { sequence: 1 })).toBe(1);
            await until(() => lateReceived.length > 0, 'late delivery');
            await tick();
            expect(lateReceived).toEqual([{ sequence: 1 }]);
        });

        it('EPILIBS-241: A subscribe issued while the handshake reply is in flight receives each message exactly once', async () => {
            const channel = new Channel({ scopeBoundary: 'WORLD', scopeKey: 'w1', pushCategory: 'RUN' });
            await subscribed(channel, []);
            const prior = clientId();
            const late = new Channel({ scopeBoundary: 'WORLD', scopeKey: 'w2', pushCategory: 'RUN' });
            const lateReceived = [];

            server.holdHandshakes();
            server.expire(prior);
            await until(() => server.heldHandshakes.length > 0, 'handshake on the wire');

            const pending = late.subscribe((data) => lateReceived.push(data));
            await tick();
            server.releaseHandshakes();
            await until(connectedAs(prior), 'new session');
            await pending;
            await until(() => server.subscriptionsOf(clientId()).includes(late.path), 'late subscription on server');

            expect(server.publish(late.path, { sequence: 1 })).toBe(1);
            await until(() => lateReceived.length > 0, 'late delivery');
            await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
            expect(lateReceived).toEqual([{ sequence: 1 }]);
        });
    });
});

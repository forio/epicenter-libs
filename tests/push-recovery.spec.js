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
    refusing = false;
    heldSubscribes = undefined;
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
                if (session.connected && message.advice?.timeout !== 0) {
                    session.heldConnect = { socket, request: message };
                } else {
                    session.connected = true;
                    socket.deliver([{ ...reply, successful: true, advice: { reconnect: 'retry', interval: 0, timeout: 30000 } }]);
                }
            } else if (message.channel === '/meta/subscribe') {
                if (this.refusing) {
                    this.answer(socket, { ...reply, successful: false, error: '403::subscribe_denied', subscription: message.subscription });
                    continue;
                }
                session.subscriptions.add(message.subscription);
                this.answer(socket, { ...reply, successful: true, subscription: message.subscription });
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

    answer(socket, reply) {
        if (this.heldSubscribes) {
            this.heldSubscribes.push({ socket, reply });
            return;
        }
        socket.deliver([reply]);
    }

    holdSubscribes() {
        this.heldSubscribes = [];
    }

    holdHandshakes() {
        this.heldHandshakes = [];
    }

    releaseHandshakes() {
        const held = this.heldHandshakes;
        this.heldHandshakes = undefined;
        held.forEach(({ socket, message }) => this.receive(socket, [message]));
    }

    releaseSubscribes() {
        const held = this.heldSubscribes;
        this.heldSubscribes = undefined;
        held.forEach(({ socket, reply }) => socket.deliver([reply]));
    }

    answerConnect(clientId) {
        const session = this.sessions.get(clientId);
        const { socket, request } = session.heldConnect;
        session.heldConnect = undefined;
        socket.deliver([{ id: request.id, channel: request.channel, successful: true, advice: { reconnect: 'retry', interval: 0, timeout: 30000 } }]);
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

    forget(clientId) {
        const session = this.sessions.get(clientId);
        this.sessions.delete(clientId);
        const { socket, request } = session.heldConnect;
        return () => socket.deliver([{
            id: request.id, channel: request.channel, successful: false, error: '402::session_unknown',
            advice: { reconnect: 'handshake', interval: 0 },
        }]);
    }

    expire(clientId) {
        this.forget(clientId)();
    }

    dropSocket(clientId) {
        this.sessions.get(clientId).socket.close(ABNORMAL_CLOSURE, 'abnormal');
    }

    subscriptionsOf(clientId) {
        return [...(this.sessions.get(clientId)?.subscriptions ?? [])];
    }

    subscribesFor(path) {
        return this.wire.filter((m) => m.channel === '/meta/subscribe' && m.subscription === path).length;
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
        cometdAdapter.lost.clear();
        cometdAdapter.pendingOperations = [];
        cometdAdapter.processingQueue = false;
    };
    const on = (code, fn) => {
        handlers.push(errorManager.registerHandler((error) => error.code === code, async (error) => fn(error)));
    };
    const clientId = () => cometdAdapter.cometd.getClientId();
    const connectedAs = (id) => () => cometdAdapter.isConnected && clientId() && clientId() !== id;
    const scope = { scopeBoundary: 'WORLD', scopeKey: 'w1', pushCategory: 'RUN' };

    const subscribed = async (channel, received) => {
        await channel.subscribe((data) => received.push(data));
        await until(() => cometdAdapter.isConnected, 'initial connect');
        await until(() => server.sessions.get(clientId())?.heldConnect, 'steady-state long poll');
        expect(server.publish(channel.path, { sequence: 1 })).toBe(1);
        await until(() => received.length === 1, 'baseline delivery');
    };

    const replaced = async () => {
        const prior = clientId();
        server.expire(prior);
        await until(connectedAs(prior), 'new session');
        await until(() => server.sessions.get(clientId())?.heldConnect, 'steady state on the new session');
        return prior;
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
        if (cometdAdapter.initialization) cometdAdapter.cometd.clearListeners();
        window.WebSocket = originalWebSocket;
        reset();
    });

    describe('EPILIBS-241', () => {
        it('Control: transport loss with a retained session keeps delivering without resubscribing', async () => {
            const restored = [];
            on('COMETD_RESUBSCRIBED', (error) => restored.push(error));
            const channel = new Channel(scope);
            const received = [];
            await subscribed(channel, received);
            const prior = clientId();
            const subscribes = server.subscribesFor(channel.path);

            const oldSocket = server.sessions.get(prior).socket;
            server.dropSocket(prior);
            await until(() => server.sessions.get(prior)?.heldConnect?.socket !== oldSocket, 'long poll on a new socket');
            await tick();

            expect(clientId()).toBe(prior);
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 2, 'post-retry delivery');
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
            expect(server.subscribesFor(channel.path)).toBe(subscribes);
            expect(restored).toEqual([]);
        });

        it('Restores subscriptions on the server and the client when the server replaces the session', async () => {
            const channel = new Channel(scope);
            const received = [];
            await subscribed(channel, received);

            await replaced();

            expect(server.subscriptionsOf(clientId())).toEqual([channel.path]);
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 2, 'delivery after session replacement');
            await tick();
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
        });

        it('Signals COMETD_RESUBSCRIBED once, after the server has acknowledged the restored subscriptions', async () => {
            const restored = [];
            on('COMETD_RESUBSCRIBED', (error) => {
                restored.push({ information: error.information, serverHas: server.subscriptionsOf(clientId()) });
            });
            const channel = new Channel(scope);
            await subscribed(channel, []);

            await replaced();
            await tick();

            expect(restored).toHaveLength(1);
            expect(restored[0].serverHas).toEqual([channel.path]);
            expect(restored[0].information).toMatchObject({ channels: [channel.path], failed: [], clientId: clientId() });
        });

        it('Reports a refused restoration as failed, keeps it, and restores it on the next replacement', async () => {
            const restored = [];
            on('COMETD_RESUBSCRIBED', (error) => restored.push(error.information));
            const channel = new Channel(scope);
            const received = [];
            await subscribed(channel, received);

            server.refusing = true;
            await replaced();
            await until(() => restored.length === 1, 'failed restoration signal');

            expect(restored[0]).toMatchObject({ channels: [], failed: [channel.path] });
            expect(server.subscriptionsOf(clientId())).toEqual([]);
            expect(cometdAdapter.subscriptions.has(channel.path)).toBe(true);

            server.refusing = false;
            await replaced();
            await until(() => restored.length === 2, 'successful restoration signal');

            expect(restored[1]).toMatchObject({ channels: [channel.path], failed: [] });
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 2, 'delivery after the second replacement');
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
        });

        const restorationHeld = async () => {
            const restored = [];
            on('COMETD_RESUBSCRIBED', (error) => restored.push(error.information));
            const channel = new Channel(scope);
            const received = [];
            await subscribed(channel, received);
            const prior = clientId();
            server.holdSubscribes();
            server.expire(prior);
            await until(() => server.heldSubscribes.length === 1, 'restoration subscribe accepted, reply held');
            const session = clientId();
            await until(() => server.sessions.get(session)?.heldConnect, 'steady long poll on the new session');
            expect(server.subscriptionsOf(session)).toEqual([channel.path]);
            return { channel, received, restored, session };
        };

        it('Re-issues a restoration whose acknowledgement is lost to transport failure once the retained session reconnects', async () => {
            const { channel, received, restored, session } = await restorationHeld();
            const lostSocket = server.sessions.get(session).socket;
            server.dropSocket(session);
            await until(() => server.heldSubscribes.length === 2, 'restoration re-issued on the retained session');
            expect(clientId()).toBe(session);
            expect(restored).toEqual([]);

            server.releaseSubscribes();
            await until(() => restored.length === 1, 'resubscribed signal');
            await tick();

            expect(server.sessions.get(session).socket).not.toBe(lostSocket);
            expect(restored[0]).toMatchObject({ clientId: session, channels: [channel.path], failed: [] });
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 2, 'delivery on the retained session');
            await tick();
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
        });

        it('Re-issues a restoration whose own request fails while the connection stays up on the next connect reply', async () => {
            const { channel, received, restored, session } = await restorationHeld();
            const { reply } = server.heldSubscribes.shift();
            cometdAdapter.cometd.receive({ id: reply.id, channel: reply.channel, subscription: channel.path, successful: false, failure: { reason: 'request failed' } });
            await until(() => cometdAdapter.lost.has(channel.path), 'restoration recorded as lost');
            expect(restored).toEqual([]);

            server.answerConnect(session);
            await until(() => server.heldSubscribes.length === 1, 'restoration re-issued after the connect reply');
            server.releaseSubscribes();
            await until(() => restored.length === 1, 'resubscribed signal');

            expect(restored[0]).toMatchObject({ clientId: session, channels: [channel.path], failed: [] });
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 2, 'delivery on the same session');
            await tick();
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
        });

        it('Unsubscribing a path whose restoration acknowledgement was lost cancels its re-issue', async () => {
            const { channel, received, restored, session } = await restorationHeld();
            server.dropSocket(session);
            await until(() => cometdAdapter.lost.has(channel.path), 'restoration recorded as lost');

            await channel.unsubscribe();
            expect(cometdAdapter.lost.size).toBe(0);

            await until(() => server.sessions.get(session)?.heldConnect, 'retained session back at steady state');
            server.releaseSubscribes();
            await tick();

            expect(server.wire.filter((m) => m.channel === '/meta/subscribe').length).toBe(2);
            expect(server.subscriptionsOf(session)).toEqual([]);
            expect(restored).toEqual([]);
            server.publish(channel.path, { sequence: 2 });
            await tick();
            expect(received).toEqual([{ sequence: 1 }]);
        });

        it('Does not signal a restoration that teardown has superseded', async () => {
            const { restored, session } = await restorationHeld();
            const held = server.heldSubscribes;
            server.heldSubscribes = undefined;

            await cometdAdapter.disconnect();
            held.forEach(({ socket, reply }) => socket.deliver([reply]));
            await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));

            expect(server.sessions.has(session)).toBe(false);
            expect(restored).toEqual([]);
        });

        it('Does not signal a restoration whose session is being replaced when its acknowledgement arrives late', async () => {
            const { channel, received, restored, session } = await restorationHeld();
            const stale = server.heldSubscribes.shift();
            server.heldSubscribes = undefined;
            server.holdHandshakes();
            server.expire(session);
            await until(() => server.heldHandshakes.length === 1, 'successor handshake on the wire');

            stale.socket.deliver([stale.reply]);
            await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
            expect(restored).toEqual([]);

            server.releaseHandshakes();
            await until(() => restored.length === 1, 'restoration on the successor session');
            await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));

            expect(restored).toHaveLength(1);
            expect(restored[0]).toMatchObject({ clientId: clientId(), channels: [channel.path], failed: [] });
            expect(clientId()).not.toBe(session);
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 2, 'delivery on the successor session');
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
        });

        it('Repairs a restoration erased by a stale refusal from the session it replaced', async () => {
            const restored = [];
            on('COMETD_RESUBSCRIBED', (error) => restored.push(error.information));
            const channel = new Channel(scope);
            const received = [];
            await subscribed(channel, received);

            server.refusing = true;
            server.holdSubscribes();
            server.expire(clientId());
            await until(() => server.heldSubscribes.length === 1, 'refused restoration, reply held');
            const refusedBy = clientId();
            const stale = server.heldSubscribes.shift();
            server.heldSubscribes = undefined;
            server.refusing = false;
            await until(() => server.sessions.get(refusedBy)?.heldConnect, 'long poll on the refusing session');

            server.expire(refusedBy);
            await until(() => restored.length === 1, 'restoration on the next session');
            const session = clientId();
            expect(restored[0]).toMatchObject({ clientId: session, channels: [channel.path], failed: [] });
            await until(() => server.sessions.get(session)?.heldConnect, 'steady state');

            stale.socket.deliver([stale.reply]);
            await until(() => cometdAdapter.lost.has(channel.path), 'erased restoration recorded for repair');
            server.answerConnect(session);
            await until(() => server.wire.filter((m) => m.channel === '/meta/subscribe' && m.clientId === session).length === 2, 'repair subscribe on the current session');
            await until(() => server.sessions.get(session)?.heldConnect, 'steady state after repair');

            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 2, 'delivery after repair');
            await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
            expect(restored).toHaveLength(1);
        });

        it('Unsubscribing through a handle issued before session replacement removes the restored subscription', async () => {
            const channel = new Channel(scope);
            const received = [];
            await subscribed(channel, received);

            await replaced();
            await channel.unsubscribe();

            expect(server.subscriptionsOf(clientId())).toEqual([]);
            expect(cometdAdapter.subscriptions.size).toBe(0);
            server.publish(channel.path, { sequence: 2 });
            cometdAdapter.cometd.receive({ channel: channel.path, data: { sequence: 3 } });
            await tick();
            expect(received).toEqual([{ sequence: 1 }]);
        });

        it.each([
            { label: 'without replacement', recover: false },
            { label: 'after replacement', recover: true },
        ])('An obsolete Channel cannot unsubscribe its replacement $label', async ({ recover }) => {
            const original = new Channel(scope);
            await subscribed(original, []);
            if (recover) await replaced();

            const replacement = new Channel(scope);
            const received = [];
            await replacement.subscribe((data) => received.push(data));
            expect(server.publish(replacement.path, { sequence: 2 })).toBe(1);
            await until(() => received.length === 1, 'replacement delivery');

            await original.unsubscribe();

            expect(server.subscriptionsOf(clientId())).toEqual([replacement.path]);
            expect(cometdAdapter.subscriptions.get(replacement.path)).toBe(replacement.subscription);
            expect(server.publish(replacement.path, { sequence: 3 })).toBe(1);
            await until(() => received.length === 2, 'delivery after the obsolete unsubscribe');
            expect(received).toEqual([{ sequence: 2 }, { sequence: 3 }]);
        });

        it('An application that resubscribes on a new clientId itself still receives each message exactly once', async () => {
            const channel = new Channel(scope);
            const received = [];
            await subscribed(channel, received);
            const prior = clientId();

            let workaround;
            cometdAdapter.cometd.addListener('/meta/handshake', (message) => {
                if (message.successful && message.clientId !== prior) {
                    workaround = channel.subscribe((data) => received.push(data));
                }
            });

            await replaced();
            await until(() => workaround, 'workaround to run');
            await workaround;
            await until(() => server.sessions.get(clientId())?.heldConnect, 'steady state');

            expect(server.subscriptionsOf(clientId())).toEqual([channel.path]);
            expect(server.publish(channel.path, { sequence: 2 })).toBe(1);
            await until(() => received.length >= 2, 'delivery');
            await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
            expect(received).toEqual([{ sequence: 1 }, { sequence: 2 }]);
        });
    });
});

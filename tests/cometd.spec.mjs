import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cometdAdapter } from './common';

describe('cometdAdapter', () => {
    beforeEach(() => {
        // Reset the adapter state between tests
        cometdAdapter.initialization = undefined;
        cometdAdapter.handshakePromise = undefined;
        cometdAdapter.handshakeState = 'idle';
        cometdAdapter.isConnected = false;
        cometdAdapter.subscriptions.clear();
        cometdAdapter.pendingOperations = [];
        cometdAdapter.processingQueue = false;
    });

    describe('State management', () => {
        it('Should initialize with correct default state', () => {
            expect(cometdAdapter.handshakeState).toBe('idle');
            expect(cometdAdapter.isConnected).toBe(false);
            expect(cometdAdapter.subscriptions.size).toBe(0);
            expect(cometdAdapter.pendingOperations.length).toBe(0);
            expect(cometdAdapter.processingQueue).toBe(false);
        });

        it('Should have a subscriptions Map', () => {
            expect(cometdAdapter.subscriptions).toBeInstanceOf(Map);
        });

        it('Should have a pendingOperations array', () => {
            expect(Array.isArray(cometdAdapter.pendingOperations)).toBe(true);
        });

        it('Should track handshake state', () => {
            expect(['idle', 'handshaking', 'succeeded', 'failed']).toContain(cometdAdapter.handshakeState);
        });

        it('Should track connection state', () => {
            expect(typeof cometdAdapter.isConnected).toBe('boolean');
        });
    });

    describe('Subscription management', () => {
        it('Should store subscriptions in a Map', () => {
            const mockSubscription = { id: 'test-sub' };
            const channelPath = '/group/test/data';

            cometdAdapter.subscriptions.set(channelPath, mockSubscription);

            expect(cometdAdapter.subscriptions.has(channelPath)).toBe(true);
            expect(cometdAdapter.subscriptions.get(channelPath)).toBe(mockSubscription);
        });

        it('Should remove subscriptions from the Map', () => {
            const mockSubscription = { id: 'test-sub' };
            const channelPath = '/group/test/data';

            cometdAdapter.subscriptions.set(channelPath, mockSubscription);
            expect(cometdAdapter.subscriptions.size).toBe(1);

            cometdAdapter.subscriptions.delete(channelPath);
            expect(cometdAdapter.subscriptions.size).toBe(0);
        });

        it('Should clear all subscriptions', () => {
            cometdAdapter.subscriptions.set('/channel1', { id: 'sub1' });
            cometdAdapter.subscriptions.set('/channel2', { id: 'sub2' });
            cometdAdapter.subscriptions.set('/channel3', { id: 'sub3' });

            const expectedSubscriptionCount = 3;
            expect(cometdAdapter.subscriptions.size).toBe(expectedSubscriptionCount);

            cometdAdapter.subscriptions.clear();
            expect(cometdAdapter.subscriptions.size).toBe(0);
        });
    });

    describe('Singleton behavior', () => {
        it('Should be a singleton instance', () => {
            expect(typeof cometdAdapter).toBe('object');
            expect(cometdAdapter.constructor.name).toBe('CometdAdapter');
        });

        it('Should maintain state across multiple references', () => {
            cometdAdapter.isConnected = true;
            cometdAdapter.handshakeState = 'succeeded';

            // The adapter should maintain its state since it's a singleton
            expect(cometdAdapter.isConnected).toBe(true);
            expect(cometdAdapter.handshakeState).toBe('succeeded');
        });
    });

    describe('Public API', () => {
        it('Should expose init method', () => {
            expect(typeof cometdAdapter.init).toBe('function');
        });

        it('Should expose handshake method', () => {
            expect(typeof cometdAdapter.handshake).toBe('function');
        });

        it('Should expose disconnect method', () => {
            expect(typeof cometdAdapter.disconnect).toBe('function');
        });

        it('Should expose add method', () => {
            expect(typeof cometdAdapter.add).toBe('function');
        });

        it('Should expose publish method', () => {
            expect(typeof cometdAdapter.publish).toBe('function');
        });

        it('Should expose remove method', () => {
            expect(typeof cometdAdapter.remove).toBe('function');
        });

        it('Should expose empty method', () => {
            expect(typeof cometdAdapter.empty).toBe('function');
        });
    });

    describe('Pending operations queue', () => {
        it('Should add operations to pending queue', () => {
            const mockOperation = vi.fn(() => Promise.resolve());

            cometdAdapter.pendingOperations.push(mockOperation);

            expect(cometdAdapter.pendingOperations.length).toBe(1);
            expect(cometdAdapter.pendingOperations[0]).toBe(mockOperation);
        });

        it('Should track processing queue state', () => {
            expect(typeof cometdAdapter.processingQueue).toBe('boolean');

            cometdAdapter.processingQueue = true;
            expect(cometdAdapter.processingQueue).toBe(true);

            cometdAdapter.processingQueue = false;
            expect(cometdAdapter.processingQueue).toBe(false);
        });

        it('Should clear pending operations', () => {
            cometdAdapter.pendingOperations.push(() => Promise.resolve());
            cometdAdapter.pendingOperations.push(() => Promise.resolve());

            expect(cometdAdapter.pendingOperations.length).toBe(2);

            cometdAdapter.pendingOperations = [];
            expect(cometdAdapter.pendingOperations.length).toBe(0);
        });
    });

    describe('Initialization promise', () => {
        it('Should track initialization promise', () => {
            expect(cometdAdapter.initialization === undefined || cometdAdapter.initialization instanceof Promise).toBe(true);
        });

        it('Should track handshake promise', () => {
            expect(cometdAdapter.handshakePromise === undefined || cometdAdapter.handshakePromise instanceof Promise).toBe(true);
        });
    });

    describe('URL configuration', () => {
        it('Should have a url property', () => {
            expect(typeof cometdAdapter.url).toBe('string');
        });

        it('Should allow url to be set', () => {
            const testUrl = 'https://test.example.com/push';
            cometdAdapter.url = testUrl;
            expect(cometdAdapter.url).toBe(testUrl);
        });
    });
});

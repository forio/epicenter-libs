import { describe, it, expect } from 'vitest';

describe('Channels', () => {
    const { Channel, SCOPE_BOUNDARY, PUSH_CATEGORY } = epicenter;

    describe('Path evaluation', () => {
        /* Added 2020.1.9 -- when we learned cometd's channels were case-sensitive and the server
         * used lowercase despite the it sending us back values in all caps. */
        it('Should use lowercase scope boundaries & push categories', async () => {
            const scopeBoundary = SCOPE_BOUNDARY.GROUP;
            const pushCategory = PUSH_CATEGORY.SYSTEM;
            const channel = new Channel({
                scopeBoundary,
                scopeKey: 'irrelevant',
                pushCategory,
            });
            expect(channel.path).toBe(`/${scopeBoundary.toLowerCase()}/irrelevant/${pushCategory.toLowerCase()}`);
        });
    });
});

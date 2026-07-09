import { describe, it, expect } from 'vitest';

/*
 * Smoke test for the shipped bundles. The main suite tests behavior against src;
 * this one only guards packaging: that Babel down-leveling, terser minification,
 * build-time token replacement, and the UMD/CJS/ESM wrappers produce a loadable
 * artifact with the expected public surface. Kept intentionally small.
 */

// A representative slice of the public API. Not exhaustive — the count check
// below guards against silent surface shrinkage.
const CRITICAL_EXPORTS = [
    'config', 'Router', 'Channel', 'errorManager',
    'ROLE', 'RITUAL', 'SCOPE_BOUNDARY', 'PUSH_CATEGORY', 'version',
    'runAdapter', 'authAdapter', 'worldAdapter', 'groupAdapter',
    'vaultAdapter', 'cometdAdapter', 'assetAdapter', 'powerpointAdapter',
];

// The full public surface is ~41 exports; this floor catches silent shrinkage.
const MIN_EXPORT_COUNT = 40;

const assertSurface = (epi, label) => {
    for (const name of CRITICAL_EXPORTS) {
        expect(epi[name], `${label}: missing export "${name}"`).toBeDefined();
    }
    expect(Object.keys(epi).length, `${label}: export count`).toBeGreaterThanOrEqual(MIN_EXPORT_COUNT);

    // Proves __VERSION__/__BUILD__/__DATE__ were replaced in the real build.
    expect(epi.version, `${label}: version banner`)
        .toMatch(/^Epicenter \(v\d+\.\d+\.\d+\) for \w+ \| Build Date: /);

    // A pure op that runs through the transpiled/minified class code (Channel
    // uses class fields) with no network or session — catches transform breakage.
    const channel = new epi.Channel({
        scopeBoundary: epi.SCOPE_BOUNDARY.GROUP,
        scopeKey: 'abc',
        pushCategory: epi.PUSH_CATEGORY.SYSTEM,
    });
    expect(channel.path, `${label}: Channel.path`).toBe('/group/abc/system');
};

describe('shipped bundles smoke test', () => {
    it('ESM build (dist/module) loads and exposes the API', async () => {
        const epi = await import('../../dist/module/epicenter.js');
        assertSurface(epi, 'esm');
    });

    it('CJS build (dist/cjs) loads and exposes the API', async () => {
        const mod = await import('../../dist/cjs/epicenter.js');
        assertSurface(mod.default ?? mod, 'cjs');
    });

    it('minified UMD (dist/epicenter.min.js) exposes the epicenter global', async () => {
        await import('../../dist/epicenter.min.js');
        expect(globalThis.epicenter, 'UMD global').toBeDefined();
        assertSurface(globalThis.epicenter, 'umd');
    });
});

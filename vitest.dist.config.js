import { defineConfig } from 'vitest/config';

/*
 * Smoke test for the shipped bundles (dist/). Separate from the main config:
 * these specs load the built artifacts, not src, so they need no jsdom, aliases,
 * define, or setup. Requires `npm run build` first — see the `test:dist` script.
 * dist/ is marked external so Vitest hands the bundles to native Node untouched,
 * matching how real consumers load them (important for the UMD global check).
 */
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/smoke/**/*.spec.{js,ts}'],
        server: {
            deps: {
                external: [/[\\/]dist[\\/]/],
            },
        },
    },
});

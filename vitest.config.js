import { defineConfig, configDefaults } from 'vitest/config';
import path from 'path';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
    // Injected into src at transform time, mirroring @rollup/plugin-replace in
    // the shipped bundles. Values are raw text, so string literals are quoted.
    define: {
        __VERSION__: JSON.stringify(pkg.version),
        __BUILD__: JSON.stringify('Test'),
        __DATE__: JSON.stringify(new Date().toISOString()),
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.js'],
        include: ['tests/**/*.test.{js,ts}', 'tests/**/*.spec.{js,ts}'],
        // Shipped-bundle smoke tests have their own config (vitest.dist.config.js)
        exclude: [...configDefaults.exclude, 'tests/smoke/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**'],
            exclude: [
                'node_modules/',
                'dist/',
                'tests/',
                '*.config.js',
            ],
        },
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            adapters: path.resolve(__dirname, 'src', 'adapters'),
            utils: path.resolve(__dirname, 'src', 'utils'),
        },
    },
});

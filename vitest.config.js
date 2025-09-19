import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.js'],
        include: ['tests/**/*.test.{js,ts}', 'tests/**/*.spec.{js,ts}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '*.config.js',
            ],
        },
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            'adapters': path.resolve(__dirname, 'src', 'adapters'),
            'utils': path.resolve(__dirname, 'src', 'utils'),
        },
    },
});
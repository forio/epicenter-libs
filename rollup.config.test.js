import path from 'path';
import { fileURLToPath } from 'url';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = './src/epicenter.ts';
const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default {
    input,
    // Mark cross-fetch as external so it's not bundled
    external: ['cross-fetch', 'stream', 'https', 'url', 'http', 'zlib'],
    plugins: [
        replace({
            preventAssignment: true,
            values: {
                __BUILD__: 'Test',
                __DATE__: () => new Date().toISOString(),
                __VERSION__: pkg.version,
            },
        }),
        alias({
            entries: [
                { find: '~', replacement: path.resolve(__dirname, 'src') },
                { find: 'adapters', replacement: path.resolve(__dirname, 'src', 'adapters') },
                { find: 'utils', replacement: path.resolve(__dirname, 'src', 'utils') },
            ],
        }),

        // Allows node_modules resolution
        resolve({ extensions, preferBuiltins: true }),

        // Allow bundling cjs modules except cross-fetch
        commonjs({
            exclude: ['node_modules/cross-fetch/**']
        }),

        // Handle JSON imports
        json(),

        // Compile TypeScript/JavaScript files
        babel({
            extensions,
            babelHelpers: 'runtime',
            include: ['src/**/*', 'node_modules/cometd/**/*'],
            presets: [
                ['@babel/preset-env', {
                    targets: [
                        'defaults',
                        'not IE 11',
                        'maintained node versions',
                    ],
                }],
                ['@babel/typescript'],
            ],
            plugins: [
                '@babel/plugin-transform-private-methods',
                '@babel/plugin-transform-class-properties',
                '@babel/plugin-transform-numeric-separator',
                '@babel/plugin-transform-optional-chaining',
                '@babel/plugin-transform-nullish-coalescing-operator',
                '@babel/plugin-transform-runtime',
                '@babel/plugin-transform-logical-assignment-operators',
            ],
        }),
    ],
    output: {
        dir: 'dist/test',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src'
    }
};
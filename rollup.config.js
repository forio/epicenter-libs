import path from 'path';
import { fileURLToPath } from 'url';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import { visualizer } from 'rollup-plugin-visualizer';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = './src/epicenter.ts';
const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default [{
    input,
    plugins: [
        replace({
            preventAssignment: true,
            values: {
                __BUILD__: 'Browsers',
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
        resolve({ extensions, browser: true }),

        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs(),

        // Handle JSON imports
        json(),

        // Compile TypeScript/JavaScript files
        babel({
            extensions,
            babelHelpers: 'runtime',
            include: ['src/**/*', 'node_modules/cometd/**/*'],
            presets: [
                ['@babel/env', {
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
        progress(),
        visualizer(),
        filesize(),
    ],
    output: [{
        // Intended for apps that use bundlers like webpack
        dir: path.dirname(pkg.browser),
        format: 'esm',
    }, {
        // Intended for apps that use the <script> tag
        file: 'dist/epicenter.js',
        name: 'epicenter',
        format: 'umd',
        inlineDynamicImports: true,
    }, {
        // Intended for apps that want to use smaller <script> tags
        file: 'dist/epicenter.min.js',
        name: 'epicenter',
        format: 'umd',
        plugins: [terser()],
        inlineDynamicImports: true,
    }],
}, {
    input,
    external: ['stream', 'https', 'url', 'http', 'zlib'],
    plugins: [
        replace({
            preventAssignment: true,
            values: {
                __BUILD__: 'Module',
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

        // Allow bundling cjs modules. Rollup doesn't understand cjs
        commonjs(),

        // Handle JSON imports
        json(),

        // Compile TypeScript/JavaScript files
        // babel({
        //     extensions,
        //     babelHelpers: 'bundled',
        //     include: ['src/**/*'],
        //     presets: ['@babel/typescript'],
        // }),
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
        progress(),
        visualizer(),
        filesize(),
    ],
    output: [{
        // For more recent versions of nodejs supporting usage of esm
        // I.e., nodejs v13.2.0 or higher if we want to drop the experimental flags
        dir: path.dirname(pkg.module),
        format: 'esm',
    }, {
        // For older versions of node, using cjs
        dir: path.dirname(pkg.main),
        format: 'cjs',
    }],
}];

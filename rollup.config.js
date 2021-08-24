import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';
import pkg from './package.json';


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

        // Compile TypeScript/JavaScript files
        babel({
            extensions,
            babelHelpers: 'runtime',
            include: ['src/**/*'],
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
                '@babel/plugin-proposal-private-methods',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-numeric-separator',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
                '@babel/plugin-transform-runtime',
            ],
        }),
        progress(),
        visualizer(),
        filesize(),
    ],
    output: [{
        // Intended for apps that use bundlers like webpack
        file: pkg.browser,
        format: 'esm',
    }, {
        // Intended for apps that use the <script> tag
        file: 'dist/epicenter.js',
        name: 'epicenter',
        format: 'umd',
    }, {
        // Intended for apps that want to use smaller <script> tags
        file: 'dist/epicenter.min.js',
        name: 'epicenter',
        format: 'umd',
        plugins: [terser()],
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
            include: ['src/**/*'],
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
                '@babel/plugin-proposal-private-methods',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-numeric-separator',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
                '@babel/plugin-transform-runtime',
            ],
        }),
        progress(),
        visualizer(),
        filesize(),
    ],
    output: [{
        // For more recent versions of nodejs supporting usage of esm
        // I.e., nodejs v13.2.0 or higher if we want to drop the experimental flags
        file: pkg.module,
        format: 'esm',
    }, {
        // For older versions of node, using cjs
        file: pkg.main,
        format: 'cjs',
    }],
}];

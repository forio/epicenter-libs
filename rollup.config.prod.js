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

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default [{
    input: './src/epicenter.ts',
    plugins: [
        replace({
            __BUILD__: 'Browsers',
            __DATE__: () => new Date().toISOString(),
            __VERSION__: pkg.version,
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
            babelHelpers: 'bundled',
            include: ['src/**/*'],
        }),
        progress(),
        visualizer(),
        filesize(),
    ],
    output: [{
        file: pkg.browser,
        format: 'esm',
    }, {
        file: 'dist/epicenter.js',
        name: 'epicenter',
        format: 'iife',
    }],
}, {
    input: './src/epicenter.ts',
    external: ['stream', 'https', 'url', 'http', 'zlib'],
    plugins: [
        replace({
            __BUILD__: 'Node',
            __DATE__: () => new Date().toISOString(),
            __VERSION__: pkg.version,
        }),
        terser(),
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
        babel({
            extensions,
            babelHelpers: 'bundled',
            include: ['src/**/*'],
        }),
        progress(),
        visualizer(),
        filesize(),
    ],
    output: [{
        file: pkg.module,
        format: 'esm',
    }, {
        file: pkg.main,
        format: 'cjs',
    }],
}];

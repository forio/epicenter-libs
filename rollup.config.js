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

export default (cliArgs) => {
    return {
        input: './src/epicenter.ts',

        // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
        // https://rollupjs.org/guide/en/#external
        external: [],

        plugins: [
            // replace({
            //     __ENV__: 'production',
            //     __DATE__: () => new Date(),
            //     __VERSION__: pkg.version,
            // }),
            // terser(),
            alias({
                entries: [
                    { find: '~', replacement: path.resolve(__dirname, 'src') },
                    { find: 'adapters', replacement: path.resolve(__dirname, 'src', 'adapters') },
                    { find: 'utils', replacement: path.resolve(__dirname, 'src', 'utils') },
                ],
            }),

            // Allows node_modules resolution
            resolve({ extensions }),

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
            file: pkg.main,
            format: 'cjs',
        // }, {
        //     file: pkg.module,
        //     format: 'es',
        // }, {
        //     file: pkg.browser,
        //     format: 'iife',
        //     name: 'epicenter',

        //     // https://rollupjs.org/guide/en/#outputglobals
        //     globals: {},
        }],
    };
};

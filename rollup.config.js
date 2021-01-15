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
    external: [/@babel\/runtime/],
    plugins: [
        replace({
            __DATE__: () => new Date(),
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
            babelHelpers: 'runtime',
            include: ['src/**/*'],
        }),
        progress(),
        visualizer(),
        filesize(),
    ],
    output: {
        file: pkg.browser,
        format: 'esm',
    },
// }, {
//     input: './src/epicenter.ts',
//     plugins: [
//         replace({
//             __DATE__: () => new Date(),
//             __VERSION__: pkg.version,
//         }),
//         alias({
//             entries: [
//                 { find: '~', replacement: path.resolve(__dirname, 'src') },
//                 { find: 'adapters', replacement: path.resolve(__dirname, 'src', 'adapters') },
//                 { find: 'utils', replacement: path.resolve(__dirname, 'src', 'utils') },
//             ],
//         }),

//         // Allows node_modules resolution
//         resolve({ extensions }),

//         // Allow bundling cjs modules. Rollup doesn't understand cjs
//         commonjs(),

//         // Compile TypeScript/JavaScript files
//         babel({
//             extensions,
//             babelHelpers: 'bundled',
//             include: ['src/**/*'],
//         }),
//         progress(),
//         visualizer(),
//         filesize(),
//     ],
//     output: [{
//         file: pkg.module,
//         format: 'esm',
//     }, {
//         file: pkg.main,
//         format: 'cjs',
//     }],
// }, {
//     input: './src/epicenter.ts',
//     plugins: [
//         replace({
//             __DATE__: () => new Date(),
//             __VERSION__: pkg.version,
//         }),
//         terser(),
//         alias({
//             entries: [
//                 { find: '~', replacement: path.resolve(__dirname, 'src') },
//                 { find: 'adapters', replacement: path.resolve(__dirname, 'src', 'adapters') },
//                 { find: 'utils', replacement: path.resolve(__dirname, 'src', 'utils') },
//             ],
//         }),

//         // Allows node_modules resolution
//         resolve({ extensions, browser: true }),

//         // Allow bundling cjs modules. Rollup doesn't understand cjs
//         commonjs(),

//         // Compile TypeScript/JavaScript files
//         babel({
//             extensions,
//             babelHelpers: 'bundled',
//             include: ['src/**/*'],
//         }),
//         progress(),
//         visualizer(),
//         filesize(),
//     ],
//     output: {
//         file: 'dist/umd/epicenter.js',
//         format: 'umd',
//         name: 'epicenter',
//         esModule: false,
//     },
}];

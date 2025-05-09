// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        customLaunchers: {
            Chrome_with_devtools: {
                base: 'Chrome',
                flags: ['--auto-open-devtools-for-tabs', '--start-maximized'],
            },
        },
        files: [
            { pattern: 'dist/epicenter.min.js', watched: false, included: true, served: true },
            { pattern: 'tests/config.spec.js', watched: false },
            { pattern: 'tests/router.spec.js', watched: false },
            { pattern: 'tests/*.spec.js', watched: false },
        ],
        port: 9876,  // karma web server port
        colors: true,
        browserConsoleLogOptions: {
            level: 'debug',
            format: '%b %t: %m',
            terminal: false,
            path: 'browser.log',
        },
        logLevel: 'error',
        browsers: ['ChromeHeadless'],
        autoWatch: true,
        // singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
        basePath: '',
        hostname: 'localhost',
        // browsers: ['Chrome'],
        reporters: ['mocha'],
        mochaReporter: {
            showDiff: 'unified',
            ignoreSkipped: true,
            output: 'minimal',
        },
        preprocessors: {
            'tests/*.spec.js': ['webpack'],
        },
        webpackMiddleware: {
            noInfo: false,
            stats: 'none',
        },
        webpack: {
            module: {
                rules: [],
            },
            output: {
                path: path.join(__dirname, 'dist', 'bundle.js'),
            },
            stats: 'errors-only',
            devtool: 'eval',
        },
        /* NIU & NOOP -- but leaving as a remainder to not try this;
         * webpack definitely wins out on this one
         * ===================================================*/
        // preprocessors: {
        //     'tests/**/*.spec.js': ['rollup'],
        // },
        // rollupPreprocessor: {
        //     plugins:[
        //         // Allows node_modules resolution
        //         nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'], browser: true }),

        //         // Allow bundling cjs modules. Rollup doesn't understand cjs
        //         commonjs(),
        //     ],
        //     output: {
        //         format: 'iife', // Helps prevent naming collisions.
        //         name: 'epicenter', // Required for 'iife' format.
        //         sourcemap: 'inline', // Sensible for testing.
        //     },
        // },
    });
};

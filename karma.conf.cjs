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
            { pattern: 'dist/epicenter.js', watched: false, included: true, served: true},
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
        preprocessors: {
            'tests/*.spec.js': ['webpack'],
        },
        basePath: '',
        // browsers: ['Chrome'],
        hostname: 'local.forio.com',
        reporters: ['mocha'],
        mochaReporter: {
            showDiff: 'unified',
            ignoreSkipped: true,
            output: 'minimal',
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
    });
};

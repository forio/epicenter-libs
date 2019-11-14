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
            { pattern: 'public/epicenter.js', watched: false, included: true, served: true},
            { pattern: 'tests/*.spec.js', watched: false },
        ],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
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
        browserConsoleLogOptions: {
            terminal: true,
        },
        // logLevel: 'debug',
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
                path: path.join(__dirname, 'public', 'bundle.js'),
            },
            stats: 'errors-only',
            devtool: 'eval',
        },
    });
};

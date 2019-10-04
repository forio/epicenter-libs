'use strict';
const path = require('path');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: [
        './src/epicenter.js',
    ],
    // devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'epicenter.js',
        library: 'epicenter',
        libraryTarget: 'umd',
    },
    // TODO -- we should leverage these -- don't how yet
    // resolve: {
    //     alias: {
    //         actions: path.resolve(__dirname, 'src', 'actions'),
    //         components: path.resolve(__dirname, 'src', 'components'),
    //         containers: path.resolve(__dirname, 'src', 'containers'),
    //         css: path.resolve(__dirname, 'src', 'static', 'css'),
    //         fonts: path.resolve(__dirname, 'src', 'static', 'fonts'),
    //         img: path.resolve(__dirname, 'src', 'static', 'img'),
    //         libs: path.resolve(__dirname, 'src', 'static', 'libs'),
    //         data: path.resolve(__dirname, 'src', 'static', 'data'),
    //         documents: path.resolve(__dirname, 'src', 'static', 'documents'),
    //         lang: path.resolve(__dirname, 'lang'),
    //         reducers: path.resolve(__dirname, 'src', 'reducers'),
    //         utils: path.resolve(__dirname, 'src', 'utils'),
    //     },
    //     extensions: ['.js', '.jsx'],
    // },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|public)/,
            loader: 'babel-loader',
        }],
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true,
                    },
                },
            }),
        ],
    },
    plugins: [
        new WebpackCleanupPlugin(),
    ],
};

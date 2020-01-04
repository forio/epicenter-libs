'use strict';
const webpack = require('webpack');
const path = require('path');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const VERSION = '0.0.0';

module.exports = {
    entry: [
        './src/epicenter.js',
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'epicenter.js',
        library: 'epicenter',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            adapters: path.resolve(__dirname, 'src', 'adapters'),
            utils: path.resolve(__dirname, 'src', 'utils'),
        },
        extensions: ['.js'],
    },
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
        new BundleAnalyzerPlugin({ analyzerPort: '1234' }),
        new webpack.BannerPlugin({ banner: `Epicenter v${VERSION}` }),
        new webpack.DefinePlugin({ VERSION: JSON.stringify(VERSION) }),
    ],
};

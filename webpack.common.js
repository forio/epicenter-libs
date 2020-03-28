'use strict';
const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { version } = require('./package.json');

module.exports = {
    entry: [
        './src/epicenter.js',
    ],
    output: {
        path: path.join(__dirname, 'dist'),
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
            exclude: /(node_modules|dist)/,
            loader: 'babel-loader',
        }],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin({ banner: `Epicenter v${version}` }),
        new webpack.DefinePlugin({ VERSION: JSON.stringify(version) }),
    ],
};

'use strict';
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8118';

const rules = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|public)/,
        loader: 'babel-loader',
    }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'file-loader',
    }, {
        test: /\.(woff|woff2)$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 5000,
                prefix: 'font',
            },
        }],
    }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'application/octet-stream',
            },
        }],
    }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'image/svg+xml',
            },
        }],
    }, {
        test: /\.gif/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'image/gif',
            },
        }],
    }, {
        test: /\.jpg/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'image/jpg',
            },
        }],
    }, {
        test: /\.png/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                mimetype: 'image/png',
            },
        }],
    }, {
        test: /\.(xls|xlsx|pdf|ppt|pptx)$/i,
        loader: 'file-loader?name=[name].[ext]',
    }, {
        test: /\.css$/,
        exclude: /[\/\\]src[\/\\]/,
        use: [{
            loader: 'style-loader',
        }, {
            loader: 'css-loader',
            options: {
                sourceMap: true,
            },
        }, {
            loader: 'resolve-url-loader',
        }],
    }, {
        test: /\.scss$/,
        exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
        use: [{
            loader: 'style-loader',
        }, {
            loader: 'css-loader',
            options: {
                sourceMap: true,
                importLoaders: 1,
            },
        }, {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
            },
        }, {
            loader: 'resolve-url-loader',
        }, {
            loader: 'sass-loader',
        }],
    },
];

module.exports = {
    entry: [
        'react-hot-loader/patch',
        './src/index.jsx',
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: `http://${HOST}:${PORT}/`,
        filename: 'bundle.js',
    },
    resolve: {
        alias: {
            actions: path.resolve(__dirname, 'src', 'actions'),
            components: path.resolve(__dirname, 'src', 'components'),
            data: path.resolve(__dirname, 'src', 'static', 'data'),
            css: path.resolve(__dirname, 'src', 'static', 'css'),
            img: path.resolve(__dirname, 'src', 'static', 'img'),
            containers: path.resolve(__dirname, 'src', 'containers'),
            libs: path.resolve(__dirname, 'src', 'libs'),
            reducers: path.resolve(__dirname, 'src', 'reducers'),
            utils: path.resolve(__dirname, 'src', 'utils'),
            downloads: path.resolve(__dirname, 'src', 'static', 'downloads'),
        },
        extensions: ['.js', '.jsx'],
    },
    module: { rules },
    devServer: {
        contentBase: './public',
        // do not print bundle build stats
        noInfo: true,
        // enable HMR
        hot: true,
        // embed the webpack-dev-server runtime into the bundle
        inline: true,
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: true,
        port: PORT,
        host: HOST,
        headers: { 'Access-Control-Allow-Origin': '*' },
        disableHostCheck: true,
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/template.html',
        }),
    ],
};

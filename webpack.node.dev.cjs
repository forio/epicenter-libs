const merge = require('webpack-merge');
const webdev = require('./webpack.web.dev.cjs');

module.exports = merge(webdev, {
    target: 'node',
});
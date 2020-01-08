const merge = require('webpack-merge');
const webdev = require('./webpack.web.dev.js');

module.exports = merge(webdev, {
    target: 'node',
});
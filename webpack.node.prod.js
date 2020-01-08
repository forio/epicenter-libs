const merge = require('webpack-merge');
const webprod = require('./webpack.web.prod.js');

module.exports = merge(webprod, {
    target: 'node',
});
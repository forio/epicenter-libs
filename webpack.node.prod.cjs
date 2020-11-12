const merge = require('webpack-merge');
const webprod = require('./webpack.web.prod.cjs');

module.exports = merge(webprod, {
    target: 'node',
});
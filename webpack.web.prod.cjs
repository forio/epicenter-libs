const merge = require('webpack-merge');
const common = require('./webpack.common.cjs');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    // devtool: 'cheap-module-source-map',
});
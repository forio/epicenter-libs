const merge = require('webpack-merge');
const common = require('./webpack.common.cjs');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new BundleAnalyzerPlugin({ analyzerPort: '1234', openAnalyzer: true }),
    ],
});
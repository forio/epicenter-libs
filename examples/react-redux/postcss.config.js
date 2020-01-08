const AUTOPREFIXER_BROWSERS = [
    '> 1%',                     // all browsers that have more than 1% market share
    'last 2 opera versions',    // include recent opera versions, despite low market share
];

module.exports = {
    plugins: [
        require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ],
};

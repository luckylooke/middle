var webpack = require('webpack'),
    entry = __dirname + "/src/middle.src.js";

module.exports = {
    entry: {
        "middle": entry,
        "middle.min": entry,
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        library: 'Middle',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            support_ie8: true,
            compress: {
                warnings: false
            }
        })
    ]
};

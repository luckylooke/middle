var webpack = require( 'webpack' ),
	entry = __dirname + "/test/tests.js";

module.exports = {
	entry: entry,
	devtool: 'source-map',
	output: {
		path: __dirname + '/test',
		filename: 'tests.bundle.js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: [ 'env' ],
					plugins: [
						"transform-decorators-legacy",
						"transform-class-properties"
					]
				}
			}
		]
	}
};

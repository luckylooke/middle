var webpack = require( 'webpack' ),
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
		new webpack.optimize.UglifyJsPlugin( {
			include: /\.min\.js$/,
			minimize: true,
			support_ie8: true,
			compress: {
				warnings: false
			}
		} )
	],
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

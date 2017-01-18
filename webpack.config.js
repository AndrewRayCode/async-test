/* eslint-disable */
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var HtmlConfig = new HtmlWebpackPlugin({
	template: path.join(__dirname, 'index.html'),
	filename: "index.html",
	inject: 'body'
})

module.exports = {
	entry: [
		path.join(__dirname, '/test-routes')
	],
	output: {
		path: path.join(__dirname, '/dist'),
		filename: "index_bundle.js",
		publicPath: 'http://localhost:8080/'
	},
	resolve: {
    extensions: ["", ".js", ".jsx"]
  },
	devtool: 'source-map',
	module: {
		preLoaders: [
	    {
	      test: /\.jsx?$/,
	      exclude: /node_modules/,
	      loader: 'eslint-loader'
	    }
	  ],
		loaders: [
			{test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
		]
	},
	plugins: [HtmlConfig]
}

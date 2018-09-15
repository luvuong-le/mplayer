const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
	entry: ['./src/js/main.js'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/js'),
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader',
					},
					{
						loader: 'sass-loader',
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '../css/mplayer.min.css',
		}),
		new OptimizeCSSAssetsPlugin({}),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 8000,
			files: ['./*/**'],
			server: {
				baseDir: ['./dist/'],
			},
		}),
	],
};
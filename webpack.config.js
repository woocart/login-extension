'use strict'
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = () => ({
	devtool: 'sourcemap',
	entry: {
		content: './source/content',
		background: './source/background',
		options: './source/options',
		popup: './source/popup',
	},
	output: {
		path: path.join(__dirname, 'distribution'),
		filename: '[name].js'
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': './source/'
		}
	},
	module: {
		rules: [
			{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test')],
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['distribution/*.*']),
		new VueLoaderPlugin(),
		new CopyWebpackPlugin([
			{
				from: '*',
				context: 'source',
				ignore: '*.js'
			},
			{
				from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'
			}
		])
	],
	optimization: {
		// Without this, function names will be garbled and enableFeature won't work
		concatenateModules: true,
		splitChunks: {name: 'lib.js'},

		// Automatically enabled on prod; keeps it somewhat readable for AMO reviewers
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					mangle: false,
					compress: false,
					output: {
						beautify: true,
						indent_level: 2 // eslint-disable-line camelcase
					}
				}
			})
		]
	}
})

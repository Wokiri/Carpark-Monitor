const path = require('path')
const webpack = require('webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

save_dir = 'imageScanVectorized'

module.exports = {
	entry: {
		bootstrapStyling: './src/js/bootstrapStyling.js',
		nanostringStyling: './src/js/nanostringStyling.js',
		disease2BScanVectorized: './src/js/disease2BScanVectorized.js',
		normal2BScanVectorized: './src/js/normal2BScanVectorized.js',
		// testing_js: './src/js/test.js',
	},
	output: {
		publicPath: '',
		path: path.resolve(__dirname, save_dir),
		filename: 'js/[name].js',
	},
	devServer: {
		port: 2040,
		clientLogLevel: 'none',
		stats: 'errors-only',
	},
	optimization: {
		minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				//HTML loader Exports HTML as string, hence it can capture file extention names
				test: /\.html$/,
				use: ['html-loader'],
			},

			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							// name: "[name].[hash].[ext]",
							name: '[name].[ext]',
							outputPath: 'pics/',
						},
					},
				],
			},

			{
				// Apply rule for fonts files
				test: /\.(woff|woff2|ttf|otf|eot)$/,
				use: [
					{
						// Using file-loader
						loader: 'file-loader',
						options: {
							name: '[name].[fullhash].[ext]',
							outputPath: 'fonts/',
						},
					},
				],
			},

			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader, //Extracts css into files
					'css-loader', //Tuns css into common js
				],
			},

			{
				//transpiles SCSS to js
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader, //Extract css into files
					'css-loader', //Turns css into common js
					'sass-loader', //Turns scss into css
				],
			},
		],
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG),
			'process.type': JSON.stringify(process.type),
			'process.version': JSON.stringify(process.version),
		}),
		new CleanWebpackPlugin(),
		new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
		// new MiniCssExtractPlugin({ filename: "[name].[fullhash].css" }),
		new MiniCssExtractPlugin({ filename: '[name].css' }),

		new HtmlWebpackPlugin({
			template: './src/index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true, // false for Vue SSR to find app placeholder
				removeEmptyAttributes: true,
			},
		}),
	],
}

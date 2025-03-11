const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Function to build shared webpack settings
function buildWebpackConfig(folder, name) {
	// Path config
	const themePath = `./wp/wp-content/${folder}/${name}/assets/`;
	const webpPathConfig = {
		path: path.resolve(__dirname),
		src: {
			js: `${themePath}src/js/bundle.js`,
			css: `${themePath}src/scss/styles.scss`,
			fonts: `${themePath}src/fonts/[name][ext]`,
			images: `${themePath}src/images/[name][ext`,
		},
		dist: {
			js: `${themePath}dist/js/bundle.js`,
			css: `${themePath}dist/css/styles.css`,
			fonts: `${themePath}dist/fonts/[name][ext]`,
			images: `${themePath}dist/images/[name][ext]`,
		},
	};

	// Common config - entry, output, plugins, and modules
	const webpCommonConfig = {
		entry: [webpPathConfig.src.js, webpPathConfig.src.css],
		output: {
			filename: webpPathConfig.dist.js,
			path: webpPathConfig.path,
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: webpPathConfig.dist.css,
			}),
		],
		module: {
			rules: [
				{
					test: /\.txt$/,
					use: 'raw-loader',
				},
				{
					test: /\.(scss|css)$/,
					exclude: /(node_modules)/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								url: false,
							},
						},
						'sass-loader',
					],
				},
				{
					test: /\.(woff(2)?|ttf)$/,
					type: 'asset/resource',
					generator: {
						filename: webpPathConfig.dist.fonts,
					},
				},
				{
					test: /\.(png|jpe?g|gif|svg|webmanifest)$/i,
					type: 'asset/resource',
					generator: {
						filename: webpPathConfig.dist.images,
					},
				},
			],
		},
		resolve: {
			extensions: ['.js', '.jsx'],
		},
	};

	return webpCommonConfig;
}

module.exports = [buildWebpackConfig('themes', 'dctest'), buildWebpackConfig('themes', 'dcbase')];

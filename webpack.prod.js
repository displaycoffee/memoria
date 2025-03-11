const { merge } = require('webpack-merge');
const webpCommonConfig = require('./webpack.common.js');

// Prod config
const webpProdConfig = {
	mode: 'production',
};

// Create exports array
let webpExports = [];
for (let i = 0; i < webpCommonConfig.length; i++) {
	webpExports.push(merge(webpCommonConfig[i], webpProdConfig));
}

module.exports = webpExports;

import { fileURLToPath } from 'url';

export const viteUtils = {
	setInput: (name, path) => {
		return {
			[`${name}`]: fileURLToPath(new URL(`./src/${path}/index.js`, import.meta.url)),
		};
	},
	assetFileNames: (file, path) => {
		if (file.name.includes('.css')) {
			return `wp-content/${path}/assets/[ext]/styles.css`;
		} else {
			return `wp-content/${path}/assets/[ext]/[name].[ext]`;
		}
	},
	chunkFileNames: (file, path) => {
		return `wp-content/${path}/assets/js/bundle.${file.name.toLowerCase()}.js`;
	},
	entryFileNames: (path) => {
		return `wp-content/${path}/assets/js/bundle.js`;
	},
};

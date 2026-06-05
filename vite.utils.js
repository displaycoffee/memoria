import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export const viteUtils = {
	dev: 'https://memoria.ddev.site',
	port: 3000,
	plugins: [react(), basicSsl()],
	entries: {
		'custom-stuff': {
			name: 'custom-stuff',
			path: 'plugins',
		},
		memoria: {
			name: 'memoria',
			path: 'themes',
		},
	},
	setInput: (name, path, file) => {
		return {
			[`${name}`]: fileURLToPath(new URL(`./src/${path}/${file}`, import.meta.url)),
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

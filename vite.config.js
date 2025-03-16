import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

/* set mapping for multiple WP entry types */
const wpMap = {
	plugin1: 'plugins/custom-stuff',
	theme1: 'themes/dcbase',
	theme2: 'themes/dctest',
};

/* get WP path */
const getWPPath = (file) => {
	const splitName = file.name.split('.');
	return `wp-content/${wpMap[splitName[0]]}`;
};

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	plugins: [react(), basicSsl()],
	server: {
		host: 'localhost',
		port: 3000,
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				plugin1: fileURLToPath(new URL(`./src/${wpMap.plugin1}/index.js`, import.meta.url)),
				theme1: fileURLToPath(new URL(`./src/${wpMap.theme1}/index.js`, import.meta.url)),
				theme2: fileURLToPath(new URL(`./src/${wpMap.theme2}/index.js`, import.meta.url)),
			},
			output: {
				manualChunks: (id) => {
					if (id.includes('custom-stuff')) {
						return 'plugin1';
					} else if (id.includes('dcbase')) {
						return 'dcbase';
					} else if (id.includes('dctest')) {
						return 'dctest';
					}
				},
				assetFileNames: (file) => {
					const path = getWPPath(file);
					if (file.name.includes('.css')) {
						return `${path}/assets/[ext]/styles.css`;
					} else {
						return `${path}/assets/[ext]/[name].[ext]`;
					}
				},
				chunkFileNames: (file) => {
					return `assets/js/bundle.${file.name.toLowerCase()}.js`;
				},
				entryFileNames: (file) => {
					return `wp-content/${wpMap[file.name]}/assets/js/bundle.js`;
				},
			},
		},
	},
});

import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

/* array of entry points */
const entries = ['plugins/custom-stuff', 'themes/dcbase', 'themes/dctest'];

/* set map for multiple entries */
const map = {
	paths: {},
	inputs: {},
};

/* add entry objects to map */
entries.forEach((entry, index) => {
	const key = `entry${index + 1}`;
	map.paths[key] = entry;
	map.inputs[key] = fileURLToPath(new URL(`./src/${entry}/index.js`, import.meta.url));
});

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
				...map.inputs,
			},
			output: {
				inlineDynamicImports: true,
				manualChunks: (id) => {
					for (const path in map.paths) {
						console.log('id', id);
						if (id.includes(map.paths[path])) {
							return path;
						}
					}
				},
				assetFileNames: (file) => {
					const splitName = file.name.split('.');
					const path = `wp-content/${map.paths[splitName[0]]}`;
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
					return `wp-content/${map.paths[file.name]}/assets/js/bundle.js`;
				},
			},
		},
	},
});

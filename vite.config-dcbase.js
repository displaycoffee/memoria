import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils';

/* Set variables for vite configs */
const name = `dcbase`;
const path = `themes/${name}`;

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	plugins: viteUtils.plugins,
	build: {
		outDir: '../dist',
		emptyOutDir: false,
		manifest: `vite-manifest-${name}.json`,
		rollupOptions: {
			input: viteUtils.setInput(name, path, 'index.js'),
			output: {
				assetFileNames: (file) => {
					return viteUtils.assetFileNames(file, path);
				},
				chunkFileNames: (file) => {
					return viteUtils.chunkFileNames(file, path);
				},
				entryFileNames: () => {
					return viteUtils.entryFileNames(path);
				},
			},
		},
	},
});

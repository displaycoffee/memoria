import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils';

/* Entries config */
const entries = viteUtils.entries;

/* Set variables for vite configs */
const name = entries.memoria.name;
const path = `${entries.memoria.path}/${name}`;
const index = `${entries.memoria.path}/${name}/${entries.memoria.index}`;

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	plugins: viteUtils.plugins,
	build: {
		outDir: '../dist',
		emptyOutDir: false,
		rollupOptions: {
			input: viteUtils.setInput(name, index, 'index.js'),
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

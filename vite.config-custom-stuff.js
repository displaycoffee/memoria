import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils';

/* Entries config */
const entries = viteUtils.entries;

/* Set variables for vite configs */
const name = entries['custom-stuff'].name;
const path = `${entries['custom-stuff'].path}/${name}`;

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	envDir: '../',
	plugins: viteUtils.plugins,
	build: {
		outDir: '../dist',
		emptyOutDir: false,
		modulePreload: {
			polyfill: false,
		},
		rollupOptions: {
			input: viteUtils.setInput(name, path, 'index.ts'),
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

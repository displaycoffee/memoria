/* Packages */
import { defineConfig } from 'vite';

/* Scripts */
import { viteNames, viteUtils } from './vite.utils.js';

const entries = viteUtils.entries;
const entryKey = entries[viteNames.headless];
const name = entryKey.name;
const path = `${entryKey.path}/${name}`;

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	envDir: '../',
	plugins: viteUtils.plugins,
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		modulePreload: {
			polyfill: false,
		},
		rollupOptions: {
			input: entryKey.input,
			output: {
				assetFileNames: (file) => {
					return viteUtils.assetFileNames(file, path);
				},
				chunkFileNames: (file) => {
					return viteUtils.chunkFileNames(file, path);
				},
				entryFileNames: (chunk) => {
					return viteUtils.entryFileNames(path, chunk.name);
				},
			},
		},
	},
});

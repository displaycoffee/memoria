import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { viteUtils } from './vite.utils';

/* Set variables for vite configs */
const name = `dctest`;
const path = `themes/${name}`;

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	plugins: [react(), basicSsl()],
	build: {
		outDir: '../dist',
		emptyOutDir: false,
		rollupOptions: {
			input: viteUtils.setInput(name, path),
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

import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils';

/* Entries config */
const entries = viteUtils.entries;

/* Create inputs map */
let inputs = {};

for (let entry in viteUtils.entries) {
	const currentEntry = viteUtils.entries[entry];
	const name = currentEntry.name;
	const path = `${currentEntry.path}/${name}`;

	inputs = {
		...inputs,
		...viteUtils.setInput(name, path, 'index.js'),
	};
}

/* Create plugins */
let plugins = viteUtils.plugins;
plugins.unshift({
	name: 'php',
	handleHotUpdate({ file, server }) {
		if (file.endsWith('.php')) {
			server.ws.send({ type: 'full-reload', path: '*' });
		}
	},
});

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	plugins: plugins,
	server: {
		host: 'localhost',
		port: 3000,
	},
	build: {
		outDir: '../dist',
		emptyOutDir: false,
		rollupOptions: {
			input: inputs,
		},
	},
});

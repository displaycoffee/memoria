import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils';

/* Entries config */
const entries = viteUtils.entries;

/* Create inputs map */
let inputs = {};

for (let entry in entries) {
	const currentEntry = entries[entry];
	inputs = {
		...inputs,
		...currentEntry.input,
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
	envDir: '../',
	plugins: plugins,
	server: {
		host: '0.0.0.0',
		port: viteUtils.port,
		strictPort: true,
		origin: `${viteUtils.dev.replace(/:\d+$/, '')}:${viteUtils.port}`,
		cors: {
			origin: /https?:\/\/([A-Za-z0-9\-\.]+)?(\.ddev\.site)(?::\d+)?$/,
		},
	},
	resolve: {
		dedupe: ['react', 'react-dom'],
	},
	build: {
		outDir: '../dist',
		emptyOutDir: false,
		modulePreload: {
			polyfill: false,
		},
		rollupOptions: {
			input: inputs,
		},
	},
});

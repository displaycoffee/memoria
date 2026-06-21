import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// Set inputs for dev and build
const setInput = (name, path, file) => {
	return {
		[`${name}`]: fileURLToPath(new URL(`./src/${path}/${file}`, import.meta.url)),
	};
};

// Config names
export const viteNames = {
	custom: 'custom-stuff',
	headless: 'memoria-headless',
};

export const viteUtils = {
	dev: 'https://memoria.ddev.site',
	port: 3000,
	plugins: [react(), basicSsl()],
	entries: {
		[viteNames.custom]: {
			name: viteNames.custom,
			path: 'plugins',
			input: {
				...setInput('index', `plugins/${viteNames.custom}`, 'index.ts'),
			},
		},
		[viteNames.headless]: {
			name: viteNames.headless,
			path: 'themes',
			input: {
				...setInput('index', `themes/${viteNames.headless}`, 'index.ts'),
				...setInput('admin', `themes/${viteNames.headless}`, 'admin.ts'),
			},
		},
	},
	assetFileNames: (file, path) => {
		if (file.name.includes('.css')) {
			const baseName = file.name.replace(/\.[^.]+$/, '');
			const name = baseName === 'index' ? 'styles' : baseName;
			return `wp-content/${path}/assets/[ext]/${name}.css`;
		} else {
			return `wp-content/${path}/assets/[ext]/[name].[ext]`;
		}
	},
	chunkFileNames: (file, path) => {
		return `wp-content/${path}/assets/js/bundle.${file.name.toLowerCase()}.js`;
	},
	entryFileNames: (path, entryName) => {
		const name = entryName === 'index' ? 'bundle' : entryName;
		return `wp-content/${path}/assets/js/${name}.js`;
	},
};

import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

const customHmr = () => {
	return {
		name: 'custom-hmr',
		//enforce: 'post',
		hotUpdate({ type, file, timestamp, modules, read, server }) {
			if (file.endsWith('.php')) {
				console.log('stuff: ', type);
				console.log('stuff: ', file);
				console.log('stuff: ', timestamp);
				console.log('stuff: ', modules);
				console.log('stuff: ', read);

				server.ws.send({
					type: 'full-reload',
					path: '*',
				});
			}
		},
	};
};

export const viteUtils = {
	plugins: [react(), basicSsl(), customHmr()],
	setInput: (name, path, file) => {
		return {
			[`${name}`]: fileURLToPath(new URL(`./src/${path}/${file}`, import.meta.url)),
		};
	},
	assetFileNames: (file, path) => {
		if (file.name.includes('.css')) {
			return `wp-content/${path}/assets/[ext]/styles.css`;
		} else {
			return `wp-content/${path}/assets/[ext]/[name].[ext]`;
		}
	},
	chunkFileNames: (file, path) => {
		return `wp-content/${path}/assets/js/bundle.${file.name.toLowerCase()}.js`;
	},
	entryFileNames: (path) => {
		return `wp-content/${path}/assets/js/bundle.js`;
	},
};

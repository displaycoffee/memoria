import { defineConfig } from 'vite';
import { viteUtils } from './vite.utils';

export default defineConfig({
	publicDir: false,
	plugins: viteUtils.plugins,
	server: {
		host: 'localhost',
		port: 3000,
		//origin: 'http://localhost/memoria',
		proxy: {
			// string shorthand:
			// http://localhost:5173/foo
			//   -> http://localhost:4567/foo
			'/': 'http://localhost/memoria',
			//port: 3000,
		},
	},
	// server: {
	// 	host: 'localhost',
	// 	port: 3000,
	// },
});

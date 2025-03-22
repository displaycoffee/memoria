import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	root: 'src',
	publicDir: '../public',
	plugins: [react(), basicSsl()],
	server: {
		host: 'localhost',
		port: 3000,
	},
});

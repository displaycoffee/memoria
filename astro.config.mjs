/* Packages */
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

/* Scripts */
import { viteUtils } from './vite.utils.js';
import packageJSON from './package.json' with { type: 'json' };

const hostname = packageJSON.homepage || 'https://localhost:3000';

export default defineConfig({
	site: hostname,
	adapter: node({
		mode: 'standalone',
		experimentalDisableStreaming: true, // Disables streaming globally for the Node server
	}),
	integrations: [
		react(), // Note: don't set experimentalDisableStreaming here, since that render path drops each island's useId prefix (duplicate ids + hydration mismatches)
		sitemap(),
	],
	build: {
		assets: 'assets',
	},
	vite: {
		plugins: viteUtils.plugins,
		css: {
			preprocessorOptions: {
				scss: {
					loadPaths: [fileURLToPath(new URL('./src', import.meta.url))], // Lets Sass @use files from src without relative paths, e.g. @use '_core/styles/_theme'
				},
			},
		},
		build: {
			cssTarget: viteUtils.cssTarget,
			rollupOptions: {
				output: {
					assetFileNames: (file) => {
						return viteUtils.assetFileNames(file);
					},
				},
			},
		},
		environments: {
			client: {
				build: {
					rollupOptions: {
						output: {
							chunkFileNames: (file) => {
								return viteUtils.chunkFileNames(file);
							},
							entryFileNames: () => {
								return viteUtils.entryFileNames();
							},
						},
					},
				},
			},
		},
	},
});

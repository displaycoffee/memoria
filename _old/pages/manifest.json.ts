/* Scripts */
import type { APIRoute } from 'astro';
import { wp } from '../_core/scripts/wp/wp';
import { context } from '../context/scripts/context';

export const GET: APIRoute = async () => {
	const site = await wp.site.site();

	const manifest = {
		short_name: site.title,
		name: site.title,
		icons: [
			{
				src: '/favicon.svg',
				type: 'image/svg+xml',
				sizes: 'any',
			},
			{
				src: '/favicon-192x192.png',
				type: 'image/png',
				sizes: '192x192',
				purpose: 'any',
			},
			{
				src: '/favicon-512x512.png',
				type: 'image/png',
				sizes: '512x512',
				purpose: 'maskable',
			},
		],
		start_url: '.',
		display: 'standalone',
		theme_color: context.theme.colors.color03,
		background_color: context.theme.colors.color03,
	};

	return new Response(JSON.stringify(manifest), {
		headers: {
			'Content-Type': 'application/manifest+json',
		},
	});
};

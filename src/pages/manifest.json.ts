/* Scripts */
import type { APIRoute } from 'astro';
import { colors } from '@/_core/data/colors';
import { favicons } from '@/_core/data/favicons';
import { wp } from '@/_core/scripts/wp/wp';

/* Build the web app manifest from the WordPress site title and the color / favicon tokens */
export const GET: APIRoute = async () => {
	const site = await wp.site.site();

	// Format manifest icons
	const icons = favicons
		.filter((favicon) => favicon.isManifest)
		.map((favicon) => {
			return {
				src: favicon.src,
				type: favicon.type,
				sizes: favicon.sizes,
				purpose: favicon.purpose,
			};
		});

	const manifest = {
		short_name: site.title,
		name: site.title,
		icons: icons,
		start_url: '.',
		display: 'standalone',
		theme_color: colors.bg,
		background_color: colors.bg,
	};

	return new Response(JSON.stringify(manifest), {
		headers: {
			'Content-Type': 'application/manifest+json',
		},
	});
};

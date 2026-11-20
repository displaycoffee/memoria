/* Scripts */
import type { APIRoute } from 'astro';

/* Allow all crawlers and point them at the sitemap from @astrojs/sitemap */
/* Note: the sitemap URL comes from site in astro.config.mjs */
export const GET: APIRoute = ({ site }) => {
	const sitemapUrl = new URL('sitemap-index.xml', site);
	const robots = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};

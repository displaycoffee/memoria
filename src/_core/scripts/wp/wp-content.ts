/* Scripts */
import { variables } from '@/_core/scripts/variables';

/* Content settings */
const settings = {
	wpPaths: /^\/(?:wp-|graphql)|\/feed\/?(?:[?#]|$)/, // Paths that only exist on WordPress (uploads, admin, login, comment form, GraphQL, feeds)
};

export const wpContent = {
	format: (content: string) => {
		// Make links to the WordPress site relative, since its permalinks match the frontend's routes
		// Note: only href changes, so images (src, srcset) still load from WordPress
		// Note: WP_URL isn't available in the browser, so content formatted by an island is left as is
		if (!content || !variables.urls.wp) return content;

		const origin = new URL(variables.urls.wp).origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const pattern = new RegExp(`(\\shref=)(["'])${origin}(?=[/?#"'])([^"']*)\\2`, 'gi');

		return content.replace(pattern, (match, attribute: string, quote: string, path: string) => {
			const url = path.startsWith('/') ? path : `/${path}`;
			return settings.wpPaths.test(url) ? match : `${attribute}${quote}${url}${quote}`;
		});
	},
};

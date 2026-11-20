/* Scripts */
import { themeToggle } from '@/components/theme-toggle/scripts/theme-toggle';

/* Comments
   Note: comments are giscus (GitHub Discussions in displaycoffee/memoria, "Comments" category), set up at https://giscus.app
   Note: each post maps to the discussion titled with its term (the post id, e.g. post-325), which giscus creates on the first comment */

/* Selectors for Comments (Comments.tsx), e.g. <section class="comments"><div class="comments-giscus giscus" data-term="post-325" data-theme-dark="data:text/css,…" data-theme-light="data:text/css,…" /></section> */
const selectors = {
	container: '.comments-giscus',
	frame: 'iframe.giscus-frame',
};

/* giscus settings, added to its script as data attributes (the term and theme are added per page) */
const settings = {
	origin: 'https://giscus.app',
	config: {
		category: 'Comments',
		categoryId: 'DIC_kwDOSskJ8c4DIhf3',
		emitMetadata: '0',
		inputPosition: 'bottom',
		lang: 'en',
		loading: 'lazy',
		mapping: 'specific',
		reactionsEnabled: '1',
		repo: 'displaycoffee/memoria',
		repoId: 'R_kgDOSskJ8Q',
		strict: '1',
	},
};

export const comments = {
	theme: () => {
		// Our giscus theme for the current mode (built by comments-theme.ts and added to the container by Comments.tsx), or giscus's own theme if it's missing
		const theme = themeToggle.get.theme();
		const container = document.querySelector<HTMLElement>(selectors.container);
		return (theme === 'dark' ? container?.dataset.themeDark : container?.dataset.themeLight) || theme;
	},
	load: () => {
		// Add the giscus script to the post's comments, which swaps itself for the giscus iframe
		// Note: call after each page load, since ClientRouter swaps in new content without running scripts in it
		const container = document.querySelector<HTMLElement>(selectors.container);
		if (!container?.dataset.term || container.querySelector('script, iframe')) return;

		const script = document.createElement('script');
		script.src = `${settings.origin}/client.js`;
		script.async = true;
		script.crossOrigin = 'anonymous';
		Object.assign(script.dataset, settings.config, { term: container.dataset.term, theme: comments.theme() });

		container.append(script);
	},
	updateTheme: () => {
		// Match giscus to the current theme
		const frame = document.querySelector<HTMLIFrameElement>(selectors.frame);
		frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: comments.theme() } } }, settings.origin);
	},
	init: () => {
		// Follow the theme toggle (data-theme on <html>) and OS changes, without the theme toggle needing to know about comments
		// Note: call once, since <html> and the media query stay the same across navigations
		new MutationObserver(comments.updateTheme).observe(document.documentElement, { attributeFilter: ['data-theme'] });
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', comments.updateTheme);
	},
};

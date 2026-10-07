/* Packages */
import type { ThemeMode } from '@displaycoffee/tokens';

/* Scripts */
import { settings } from '@/_core/data/settings';

/* Theme toggle
   Note: everything for the toggle lives in this folder, plus the inline theme script in Head.astro and the calls in container.ts.
   Note: Head.astro applies a saved theme before the first paint; this script only reads and changes it. */

/* Selector for ThemeToggle (ThemeToggle.tsx), e.g. <label class="toggle"><span class="toggle-label" /><input id="theme-toggle" /></label> */
const selectors = {
	input: '#theme-toggle',
	label: '.toggle-label',
	toggle: '.toggle',
};

/* OS preference for the alternate theme */
const systemQuery = `(prefers-color-scheme: ${settings.theme.alternate})`;

export const themeToggle = {
	storageKey: 'theme',
	get: {
		system: (): ThemeMode => {
			// Start from the OS setting, or from the default theme if the tokens don't follow the OS (setting.theme.system)
			const { alternate, default: defaultTheme, system } = settings.theme;
			return system && window.matchMedia(systemQuery).matches ? alternate : defaultTheme;
		},
		theme: (): ThemeMode => {
			// Current theme: data-theme if it's been set (saved or toggled), otherwise the OS / default theme
			const current = document.documentElement.getAttribute('data-theme');
			return current === 'light' || current === 'dark' ? current : themeToggle.get.system();
		},
	},
	save: (theme: ThemeMode) => {
		// localStorage can throw (e.g. blocked storage or some private browsing modes), so writes fail quietly
		try {
			localStorage.setItem(themeToggle.storageKey, theme);
		} catch {
			// Not saved, but still applied for this page view
		}
	},
	update: () => {
		// Match the toggle to the current theme
		// Note: the server can't know the visitor's theme, so it renders the default theme and this corrects it after each page load
		const input = document.querySelector<HTMLInputElement>(selectors.input);
		const toggle = input?.closest(selectors.toggle);
		if (!input || !toggle) return;

		const isDark = themeToggle.get.theme() === 'dark';
		input.checked = isDark;
		toggle.classList.toggle('toggle-active', isDark);

		const label = toggle.querySelector(selectors.label);
		if (label) label.textContent = `${isDark ? 'Dark' : 'Light'} mode`;
	},
	init: () => {
		// Note: call once, since the listeners stay on document across navigations
		document.addEventListener('change', (e) => {
			if (!(e.target instanceof HTMLInputElement) || !e.target.matches(selectors.input)) return;

			// Flip the theme, save it, and apply it immediately
			const next: ThemeMode = e.target.checked ? 'dark' : 'light';
			themeToggle.save(next);
			document.documentElement.setAttribute('data-theme', next);
			themeToggle.update();
		});

		// Follow OS changes while no theme has been saved
		window.matchMedia(systemQuery).addEventListener('change', themeToggle.update);
	},
};

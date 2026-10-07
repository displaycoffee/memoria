/* Scripts */
import { settings } from '@/_core/data/settings';

/* Components */
import { Toggle } from '@/components/forms/Forms';

export const ThemeToggle = () => {
	// Render the default theme, then themeToggle.update() (from container.ts) matches the visitor's theme after each page load
	const isDark = settings.theme.default === 'dark';

	// Note: onChange only satisfies React's controlled-input check, since this renders as static HTML and themeToggle.init() handles changes
	return <Toggle active={isDark} id={'theme-toggle'} label={`${isDark ? 'Dark' : 'Light'} mode`} onChange={() => undefined} />;
};

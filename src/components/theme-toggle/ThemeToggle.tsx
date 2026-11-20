/* Styles */
import './styles/theme-toggle.scss';

/* Scripts */
import { settings } from '@/_core/data/settings';

/* Components */
import { Icon } from '@/components/icons/Icons';

export const ThemeToggle = () => {
	// Render the default theme, then themeToggle.update() (from container.ts) matches the visitor's theme after each page load
	// Note: the label stays "Dark mode", since the switch's checked state tells screen readers whether it's on, and CSS shows the sun or moon icon from :checked
	const isDark = settings.theme.default === 'dark';
	const toggleId = 'theme-toggle-choice';

	return (
		<label className="theme-toggle pointer" htmlFor={toggleId}>
			<span className="theme-toggle-label sr-only">Dark mode</span>
			<input id={toggleId} className="theme-toggle-choice sr-only" defaultChecked={isDark} role="switch" type="checkbox" name="theme-toggle" />
			<Icon name={'sun'} size={'2xl'} />
			<Icon name={'moon'} size={'2xl'} />
		</label>
	);
};

/* Scripts */
import { utilsBrowser } from '@/_core/scripts/utils';
import { blocks } from '@/components/blocks/scripts/blocks';
import { dropdown } from '@/components/dropdown/scripts/dropdown';
import { forms } from '@/components/forms/scripts/forms';
import { image } from '@/components/image/scripts/image';
import { overlay } from '@/components/overlay/scripts/overlay';
import { slideout } from '@/components/slideout/scripts/slideout';
import { themeToggle } from '@/components/theme-toggle/scripts/theme-toggle';

/* Cleanup for the previous page's min-height observer */
let cleanupMinHeight: (() => void) | undefined;

export const container = {
	setMinHeight: () => {
		// Set min-height on main
		// Note: each navigation swaps in a new main, so stop watching the old one first
		cleanupMinHeight?.();
		const mainContent = document.querySelector<HTMLElement>('#main-content');
		if (mainContent) cleanupMinHeight = utilsBrowser.setAvailableMinHeight(mainContent);
	},
	pageLoad: () => {
		// Runs after the first load and every ClientRouter navigation
		container.setMinHeight();
		blocks.revealAll('.section', 'section-visible');
		forms.clearable.update();
		image.checkComplete();
		themeToggle.update();
	},
	init: () => {
		// Note: call once, since the listeners stay on document across navigations
		// Astro doesn't re-run the script after a ClientRouter navigation, but it does dispatch astro:page-load after every navigation (including the first load)
		dropdown.init();
		forms.clearable.init();
		forms.scroll.init();
		image.init();
		overlay.init();
		slideout.init();
		themeToggle.init();
		document.addEventListener('astro:page-load', container.pageLoad);
	},
};

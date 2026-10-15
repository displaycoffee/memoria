/* Packages */
import { navigate } from 'astro:transitions/client';

/* Selectors for WordPress blocks in entry content (memoria-headless gives dropdown blocks' selects data-navigation-select, with an archive path as each option's value) */
const selectors = {
	navigationSelect: 'select[data-navigation-select]',
};

/* Entry content settings */
const settings = {
	navigationDelay: 250, // Same delay as WordPress's own dropdown script, so an Escape keyup lands before the check
};

export const entryContent = {
	navigationSelect: (target: EventTarget | null) => {
		// Get the dropdown block select an event came from
		return target instanceof HTMLSelectElement && target.matches(selectors.navigationSelect) ? target : null;
	},
	init: () => {
		// Go to the picked option's archive, replacing the inline script WordPress adds to dropdown blocks
		// Note: call once, since the listeners stay on document across navigations
		document.addEventListener('change', (e) => {
			const select = entryContent.navigationSelect(e.target);
			if (!select) return;

			setTimeout(() => {
				// Skip a change made while closing the list with Escape, and the placeholder option
				if (select.dataset.lastKey == 'escape' || !select.value) return;
				void navigate(select.value);
			}, settings.navigationDelay);
		});
		document.addEventListener('keyup', (e) => {
			const select = entryContent.navigationSelect(e.target);
			if (!select) return;

			if (e.key == 'Escape') {
				select.dataset.lastKey = 'escape';
			} else {
				delete select.dataset.lastKey;
			}
		});
		document.addEventListener('click', (e) => {
			const select = entryContent.navigationSelect(e.target);
			if (select) delete select.dataset.lastKey;
		});
	},
};

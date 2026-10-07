/* Selectors and classes for Dropdown (Dropdown.tsx), e.g. <div class="dropdown dropdown-collapsed"><div class="dropdown-button"><button class="dropdown-button-toggle" /></div><div class="dropdown-content" /></div> */
const selectors = {
	content: '.dropdown-content',
	dropdown: '.dropdown',
	expanded: '.dropdown-expanded',
	toggle: '.dropdown-button-toggle',
};

const classes = {
	collapsed: 'dropdown-collapsed',
	expanded: 'dropdown-expanded',
};

export const dropdown = {
	set: (element: Element, isExpanded: boolean) => {
		// Open or close a dropdown, keeping its class and the toggle's aria-expanded in sync
		element.classList.toggle(classes.expanded, isExpanded);
		element.classList.toggle(classes.collapsed, !isExpanded);
		element.querySelector(selectors.toggle)?.setAttribute('aria-expanded', String(isExpanded));
	},
	closeAll: (except?: Element | null) => {
		// Close every open dropdown, except the one being interacted with
		document.querySelectorAll(selectors.expanded).forEach((element) => {
			if (element !== except) dropdown.set(element, false);
		});
	},
	init: () => {
		// Handle every dropdown from document, so dropdowns on new pages (or inside the slideout) work without new listeners
		// Note: call once, since the listeners stay on document across navigations
		document.addEventListener('click', (e) => {
			const target = e.target instanceof Element ? e.target : null;
			const current = target?.closest(selectors.dropdown) ?? null;

			// Clicking anywhere else closes other open dropdowns
			dropdown.closeAll(current);
			if (!target || !current) return;

			// Toggle from the button, or close from inside the content when the dropdown has closeOnClick
			if (target.closest(selectors.toggle)) {
				dropdown.set(current, !current.classList.contains(classes.expanded));
			} else if (target.closest(selectors.content) && current instanceof HTMLElement && current.dataset.closeOnClick === 'true') {
				dropdown.set(current, false);
			}
		});
		document.addEventListener('keydown', (e) => {
			if (e.key !== 'Escape') return;

			// Prefer the open dropdown that has focus, so focus can go back to its toggle
			const focused = document.activeElement?.closest(selectors.expanded);
			const open = focused ?? document.querySelector(selectors.expanded);
			if (!open) return;

			// Stop the Escape from also closing a parent dialog (e.g. the slideout)
			e.preventDefault();
			dropdown.closeAll();
			open.querySelector<HTMLElement>(selectors.toggle)?.focus();
		});
	},
};

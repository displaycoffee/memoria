/* Scripts */
import type { AccordionContextType } from './accordion-types';

/* Selectors and classes for WordPress accordion blocks, e.g. <div class="wp-block-accordion" data-wp-context='{ "autoclose": false }'><div class="wp-block-accordion-item is-open"><h3 class="wp-block-accordion-heading"><button class="wp-block-accordion-heading__toggle" /></h3><div class="wp-block-accordion-panel" /></div></div>
   Note: WordPress toggles these with its Interactivity API (accordion/view.js), which never reaches Astro, so this replaces it using the same markup */
const selectors = {
	accordion: '.wp-block-accordion',
	item: '.wp-block-accordion-item',
	itemChild: ':scope > .wp-block-accordion-item',
	panel: '.wp-block-accordion-panel',
	panelChild: ':scope > .wp-block-accordion-panel',
	toggle: '.wp-block-accordion-heading__toggle',
	toggleChild: ':scope > .wp-block-accordion-heading .wp-block-accordion-heading__toggle',
};

const classes = {
	open: 'is-open',
};

export const accordion = {
	set: (item: Element, isOpen: boolean) => {
		// Open or close an item, keeping its class, the toggle's aria-expanded, and the panel's hidden in sync
		// Note: hidden="until-found" (like WordPress) lets find in page search closed panels and fire beforematch
		item.classList.toggle(classes.open, isOpen);
		item.querySelector(selectors.toggleChild)?.setAttribute('aria-expanded', String(isOpen));

		const panel = item.querySelector(selectors.panelChild);
		if (isOpen) {
			panel?.removeAttribute('hidden');
		} else {
			panel?.setAttribute('hidden', 'until-found');
		}
	},
	autoclose: (item: Element) => {
		// Check whether the item's accordion closes its other items when one opens (from the context WordPress prints)
		const context = item.closest(selectors.accordion)?.getAttribute('data-wp-context');
		if (!context) return false;

		try {
			return (JSON.parse(context) as AccordionContextType).autoclose === true;
		} catch {
			return false;
		}
	},
	open: (item: Element, isOpen = true) => {
		// Open or close an item, closing the other items in its accordion first when it opens with autoclose
		if (isOpen && accordion.autoclose(item)) {
			item.parentElement?.querySelectorAll(selectors.itemChild).forEach((sibling) => {
				if (sibling !== item) accordion.set(sibling, false);
			});
		}
		accordion.set(item, isOpen);
	},
	openTo: (target: Element) => {
		// Open every item around an element, from the outermost in, so it shows inside nested accordions
		const items: Element[] = [];
		let panel = target.closest(selectors.panel);

		while (panel) {
			const item = panel.closest(selectors.item);
			if (item) items.unshift(item);
			panel = item?.parentElement?.closest(selectors.panel) ?? null;
		}

		items.forEach((item) => accordion.open(item));

		return items.length > 0;
	},
	openByHash: () => {
		// Open the items around the element the URL hash points to, then scroll to it once it shows
		const hash = window.location.hash.slice(1);
		if (!hash) return;

		const target = document.getElementById(decodeURIComponent(hash));
		if (target && accordion.openTo(target)) window.setTimeout(() => target.scrollIntoView(), 0);
	},
	update: () => {
		// Hide each closed item's panel, since WordPress only adds hidden from its script, then open from the hash
		// Note: call on every page load, since each navigation swaps in new entry content
		document.querySelectorAll(selectors.item).forEach((item) => accordion.set(item, item.classList.contains(classes.open)));
		accordion.openByHash();
	},
	init: () => {
		// Handle every accordion from document, so accordions on new pages work without new listeners
		// Note: call once, since the listeners stay on document across navigations
		document.addEventListener('click', (e) => {
			const toggle = e.target instanceof Element ? e.target.closest(selectors.toggle) : null;
			const item = toggle?.closest(selectors.item);
			if (!item) return;
			accordion.open(item, !item.classList.contains(classes.open));
		});

		// Open a closed panel when find in page matches text inside it
		// Note: listen in the capture phase, so the event reaches document whether or not it bubbles
		document.addEventListener(
			'beforematch',
			(e) => {
				if (e.target instanceof Element) accordion.openTo(e.target);
			},
			{ capture: true },
		);
		window.addEventListener('hashchange', accordion.openByHash);
	},
};

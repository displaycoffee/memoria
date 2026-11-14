/* Scripts */
import type { TabsContextType } from './tabs-types';

/* Selectors for WordPress tabs blocks, e.g. <div class="wp-block-tabs" data-wp-context='{ "tabsId": "tabs_1", "activeTabIndex": 0 }'><div class="wp-block-tab-list" role="tablist"><button id="tab__tabs_1-tab-0" aria-controls="tabs_1-tab-0" role="tab" /></div><div class="wp-block-tab-panels"><section class="wp-block-tab-panel" id="tabs_1-tab-0" role="tabpanel" /></div></div>
   Note: WordPress toggles these with its Interactivity API (tabs/view.js), which never reaches Astro, so this replaces it using the same markup */
const selectors = {
	tabs: '.wp-block-tabs',
	tab: '.wp-block-tab-list > button',
	tabChild: ':scope > .wp-block-tab-list > button',
	panel: '.wp-block-tab-panel',
	panelChild: ':scope > .wp-block-tab-panels > .wp-block-tab-panel',
};

export const tabs = {
	getTabs: (block: Element) => Array.from(block.querySelectorAll<HTMLElement>(selectors.tabChild)),
	getPanels: (block: Element) => Array.from(block.querySelectorAll(selectors.panelChild)),
	activeIndex: (block: Element) => {
		// Get the selected tab's index, falling back to the active tab WordPress saved in the block's context
		const selected = tabs.getTabs(block).findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
		if (selected >= 0) return selected;

		const context = block.getAttribute('data-wp-context');
		if (!context) return 0;

		try {
			return (JSON.parse(context) as TabsContextType).activeTabIndex ?? 0;
		} catch {
			return 0;
		}
	},
	set: (block: Element, index: number) => {
		// Select a tab by index, keeping each tab's aria-selected and tabindex and each panel's hidden in sync
		// Note: tabs and panels pair by position (like WordPress), and only the selected tab stays in the tab sequence
		// Note: hidden="until-found" (like the accordion) lets find in page search hidden panels and fire beforematch
		const tabList = tabs.getTabs(block);
		if (tabList.length === 0) return;

		const active = Math.min(Math.max(index, 0), tabList.length - 1);

		tabList.forEach((tab, i) => {
			tab.setAttribute('aria-selected', String(i === active));
			tab.setAttribute('tabindex', i === active ? '0' : '-1');
		});

		tabs.getPanels(block).forEach((panel, i) => {
			if (i === active) {
				panel.removeAttribute('hidden');
			} else {
				panel.setAttribute('hidden', 'until-found');
			}
		});
	},
	select: (tab: Element) => {
		// Select a tab button in its own tabs block
		const block = tab.closest(selectors.tabs);
		if (!block) return;
		tabs.set(block, tabs.getTabs(block).indexOf(tab as HTMLElement));
	},
	focus: (tab: Element, key: string) => {
		// Move focus between a tabs block's tabs with the arrow, Home, and End keys, wrapping around at either end
		// Note: this only moves focus (like WordPress), and Enter or Space selects the focused tab through its click
		const block = tab.closest(selectors.tabs);
		if (!block) return false;

		const tabList = tabs.getTabs(block);
		const current = tabList.indexOf(tab as HTMLElement);
		const last = tabList.length - 1;
		const next: Record<string, number> = {
			ArrowRight: current >= last ? 0 : current + 1,
			ArrowLeft: current <= 0 ? last : current - 1,
			Home: 0,
			End: last,
		};

		if (current < 0 || !(key in next)) return false;

		tabList[next[key]]?.focus();

		return true;
	},
	showTo: (target: Element) => {
		// Select every tab around an element, from the outermost in, so it shows inside nested tabs
		// Note: an element can be a tab button (e.g. #tab__id) or anything inside a panel (including the panel itself)
		const steps: (() => void)[] = [];
		const tab = target.closest(selectors.tab);
		let panel = target.closest(selectors.panel);

		if (tab) steps.unshift(() => tabs.select(tab));

		while (panel) {
			const block = panel.closest(selectors.tabs);
			if (!block) break;

			const index = tabs.getPanels(block).indexOf(panel);
			if (index >= 0) steps.unshift(() => tabs.set(block, index));

			panel = block.parentElement?.closest(selectors.panel) ?? null;
		}

		steps.forEach((step) => step());

		return steps.length > 0;
	},
	showByHash: () => {
		// Select the tabs around the element the URL hash points to, then scroll to it once it shows
		const hash = window.location.hash.slice(1);
		if (!hash) return;

		const target = document.getElementById(decodeURIComponent(hash));
		if (target && tabs.showTo(target)) window.setTimeout(() => target.scrollIntoView(), 0);
	},
	update: () => {
		// Select each tabs block's active tab, since WordPress only sets aria-selected, tabindex, and hidden from its script, then show from the hash
		// Note: call on every page load, since each navigation swaps in new entry content
		document.querySelectorAll(selectors.tabs).forEach((block) => tabs.set(block, tabs.activeIndex(block)));
		tabs.showByHash();
	},
	init: () => {
		// Handle every tabs block from document, so tabs on new pages work without new listeners
		// Note: call once, since the listeners stay on document across navigations
		document.addEventListener('click', (e) => {
			const tab = e.target instanceof Element ? e.target.closest(selectors.tab) : null;
			if (tab) tabs.select(tab);
		});

		document.addEventListener('keydown', (e) => {
			const tab = e.target instanceof Element ? e.target.closest(selectors.tab) : null;
			if (tab && tabs.focus(tab, e.key)) e.preventDefault();
		});

		// Select a hidden panel's tab when find in page matches text inside it
		// Note: listen in the capture phase, so the event reaches document whether or not it bubbles
		document.addEventListener(
			'beforematch',
			(e) => {
				if (e.target instanceof Element) tabs.showTo(e.target);
			},
			{ capture: true },
		);
		window.addEventListener('hashchange', tabs.showByHash);
	},
};

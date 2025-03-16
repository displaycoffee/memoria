/* React */
import { createRoot } from 'react-dom/client';

export const utils = {
	handleize: (value) => {
		// Format value for html classes
		return value
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.replace(/\s/g, '-')
			.trim();
	},
	isSticky: (element, stickyClass) => {
		if (element) {
			// Create options and callback for observer
			const stickyOptions = { threshold: [1] };
			const stickyCallback = (e) => {
				e.target.classList.toggle(stickyClass, e.intersectionRatio < 1);
			};

			// Observe to toggle sticky class
			const stickyObserver = new IntersectionObserver(([e]) => stickyCallback(e), stickyOptions);
			stickyObserver.observe(element);
		}
	},
	renderTarget: (element, component) => {
		// Render target for app
		const targetElement = document.querySelector(element);
		const targetHasChildren = targetElement && targetElement?.children && targetElement.children.length !== 0 ? true : false;
		if (!targetHasChildren) {
			const targetTarget = createRoot(targetElement);
			targetTarget.render(component);
		}
	},
	scrollTo: (e, selector, offset) => {
		// Scroll to element on page
		if (e) {
			e.preventDefault();
		}
		const anchor = {
			selector: selector ? selector : false,
			offset: offset ? offset : 0,
			position: () => {
				const anchorElement = document.querySelector(anchor.selector) ? document.querySelector(anchor.selector) : false;
				return anchorElement ? anchorElement.getBoundingClientRect().top + window.scrollY - anchor.offset : 0 - anchor.offset;
			},
		};
		window.scroll({ top: anchor.position(), left: 0, behavior: 'smooth' });
	},
	setAttributes: (element, atttributes) => {
		// Set multiple attributes on an element
		for (const attribute in atttributes) {
			element.setAttribute(attribute, atttributes[attribute]);
		}
	},
};

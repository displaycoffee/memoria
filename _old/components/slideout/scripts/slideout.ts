/* Packages */
import type { CSSProperties } from 'react';

/* Scripts */
import { utils } from '../../../_core/scripts/utils';

export const slideout = {
	config: {
		classes: {
			// Class variables for component
			activeBody: 'slideout-active-body',
			active: 'slideout-active',
			overlay: 'slideout-overlay',
			slideout: 'slideout',
			content: 'slideout-content',
		},
		values: {
			// Default values if props are not defined
			width: '350px',
			direction: 'left',
		},
	},
	get: {
		orientation: (direction: string) => {
			// Get orientation of slideout
			return direction === 'top' || direction === 'bottom' ? 'vertical' : 'horizontal';
		},
		styles: (direction: string, width: string, isActive?: boolean) => {
			// Set styles for gallery
			const orientation = slideout.get.orientation(direction);
			const transform = orientation === 'vertical' ? 'translateY' : 'translateX';
			const value = `${direction == 'top' || direction == 'left' ? '-' : ''}150%`;

			// Create styles
			const styles: CSSProperties = {
				transform: `${transform}(${isActive ? 0 : value})`,
				width: width,
			};

			// If horizontal slideout, adjust direction value
			if (orientation == 'horizontal') {
				const directionProperty = direction == 'left' ? 'right' : 'left';
				styles[directionProperty] = 'auto';
			}

			return styles;
		},
	},
	set: {
		body: (state: string) => {
			// Toggle slideout body class
			const classes = slideout.config.classes;
			const body = document.querySelector('body');
			if (body) {
				if (state === 'add') {
					body.classList.add(classes.activeBody);
				} else {
					body.classList.remove(classes.activeBody);
				}
			}
		},
		slideout: (element: HTMLElement, state: string) => {
			// Helper function to toggle slideout properties
			const { config, get } = slideout;
			const { classes } = config;
			const content = element.querySelector(`.${classes.content}`) as HTMLElement;

			if (content && element?.dataset?.width && element?.dataset?.direction) {
				// Get data attributes
				const width = element.dataset.width;
				const direction = element.dataset.direction;

				// Update elements depending on state
				if (state === 'add') {
					// Add classes and styles and remove inert attribute
					element.classList.add(classes.active);
					Object.assign(content.style, get.styles(direction, width, true));
					content.inert = false;
					utils.browser.focusTrap.activate(content, '.slideout-close');
				} else {
					// Remove classes and styles and addd inert attribute
					element.classList.remove(classes.active);
					Object.assign(content.style, get.styles(direction, width));
					content.inert = true;
					utils.browser.focusTrap.deactivate(content);
				}
			}
		},
	},
	toggle: (e: EventsType, id: string | boolean) => {
		// Note: e.g. a touchend fired mid-scroll can be non-cancelable, so guard against that
		if (e.cancelable) e.preventDefault();
		const { config, set } = slideout;
		const classes = config.classes;
		const activeSelector = `.${classes.slideout}.${classes.active}`;

		// Reset active slideout
		document.querySelectorAll(activeSelector).forEach((active) => {
			const element = active as HTMLElement;
			set.slideout(element, 'remove');
		});

		// Perform actions for current slideout
		if (id) {
			const element = document.querySelector<HTMLElement>(`#${id}`);
			if (element) {
				const elementState = !element.classList.contains(classes.active) ? 'add' : 'remove';
				set.slideout(element, elementState);
			}
		}

		// Reset body classes
		// Note: classList changes above are synchronous, so the active count is already up to date here
		const slideoutActiveElements = document.querySelectorAll(activeSelector);
		const bodyState = slideoutActiveElements.length !== 0 ? 'add' : 'remove';
		set.body(bodyState);
	},
};

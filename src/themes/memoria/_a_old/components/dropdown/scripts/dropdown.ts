/* Local scripts */
import { DropdownOptionsType } from './dropdown-types';

export const dropdown = {
	config: {
		classes: {
			active: 'dropdown-active',
			container: 'dropdown',
			button: 'dropdown-button',
			content: 'dropdown-content',
			wrapper: 'dropdown-button-wrapper',
		},
		values: {
			container: false, // Container element surrounding button and content
			button: false, // Button selector (as a string)
			content: false, // Content selector (as a string)
			direction: 'top', // Menu flips top or bottom
			icon: '<span class="dropdown-icon">x</span>',
			onHover: false, // Disable onClick to open menu
		},
	},
	toggle: (e: EventType, id: string | boolean) => {
		// e.preventDefault();
		// const { config, set } = slideout;
		// const classes = config.classes;
		// const activeSelector = `.${classes.slideout}.${classes.active}`;
		// // Reset active slideout menus
		// document.querySelectorAll(activeSelector).forEach((active) => {
		// 	const element = active as HTMLElement;
		// 	set.slideout(element, 'remove');
		// });
		// // Perform actions for current slideout menu
		// if (id) {
		// 	const element = document.querySelector(`#${id}`) as HTMLElement;
		// 	const elementState = !element.classList.contains(classes.active) ? 'add' : 'remove';
		// 	set.slideout(element, elementState);
		// }
		// // Reset body classes
		// // Note: using a slight timeout to ensure slideout actions have processed
		// setTimeout(() => {
		// 	const slideoutActiveElements = document.querySelectorAll(activeSelector);
		// 	const bodyState = slideoutActiveElements && slideoutActiveElements.length !== 0 ? 'add' : 'remove';
		// 	set.body(bodyState);
		// }, 100);
	},
	create: (options: DropdownOptionsType) => {
		const config = dropdown.config;
		const { classes } = config;

		// If there is no container element, don't proceed
		if (options.container && typeof options.container == 'string') {
			const dropdowns = document.querySelectorAll(options.container);

			// Then if dropdowns selectors are found, loop through all
			if (dropdowns && dropdowns.length !== 0) {
				dropdowns.forEach((menu) => {
					const button = menu.querySelector(`:scope > ${options.button}`);
					const content = menu.querySelector(`:scope > ${options.content}`);

					// If both a button and content element are found, proceed
					if (button && content) {
						// Add class to dropdown menu and content
						if (!menu.classList.contains(classes.container)) {
							menu.classList.add(classes.container);
						}
						if (!content.classList.contains(classes.content)) {
							content.classList.add(classes.content);
						}

						// Create wrapper around button
						const wrapper = document.createElement('div');
						wrapper.classList.add(classes.wrapper); // Optional: Add a class for styling
						menu.insertBefore(wrapper, button);
						wrapper.appendChild(button);

						// If button as not a button, add a button wrapper
						if (button.nodeName.toLowerCase() == 'a') {
							button.insertAdjacentHTML('afterend', options.icon as string);
						}
					}
				});
			}
		}
	},
	init: (options: DropdownOptionsType) => {
		const { config, create } = dropdown;
		const values = config.values;

		// Ensure all options are set
		options = {
			container: options.container || values.container,
			button: options.button || values.button,
			content: options.content || values.content,
			direction: options.direction || values.direction,
			icon: options.icon || values.icon,
			onHover: options.onHover || values.onHover,
		};

		// Create dropdown functionality
		create(options);
	},
};

dropdown.init({
	container: '.navigation-primary .menu-item',
	button: 'a',
	content: '.sub-menu',
	direction: 'top',
	icon: false,
	onHover: true,
});

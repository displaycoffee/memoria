export const slideout = {
	config: {
		classes: {
			// Class variables for component
			activeBody: 'slideout-active-body',
			active: 'slideout-active',
			overlay: 'slideout-overlay',
			slideout: 'slideout',
			menu: 'slideout-menu',
		},
		values: {
			// Default values if props are not defined
			width: '350px',
			direction: 'left',
			vertical: '110%',
		},
	},
	get: {
		orientation: (direction: string) => {
			// Get orientation of slideout
			return direction === 'top' || direction === 'bottom' ? 'vertical' : 'horizontal';
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
			const config = slideout.config;
			const { classes, values } = config;
			const menu = element.querySelector(`.${classes.menu}`) as HTMLElement;

			if (menu && element?.dataset) {
				// Get data attributes
				const width = element.dataset.width;
				const direction = element.dataset.direction as string;
				const orientation = element.dataset.orientation;

				// Update elements depending on state
				if (state === 'add') {
					element.classList.add(classes.active);
					menu.style.setProperty(direction, '0');
				} else {
					element.classList.remove(classes.active);
					menu.style.setProperty(direction, orientation === 'vertical' ? values.vertical : `-${width}`);
				}
			}
		},
	},
	toggle: (e: EventsType, id: string | boolean) => {
		e.preventDefault();
		const { config, set } = slideout;
		const classes = config.classes;
		const activeSelector = `.${classes.slideout}.${classes.active}`;

		// Reset active slideout menus
		document.querySelectorAll(activeSelector).forEach((active) => {
			const element = active as HTMLElement;
			set.slideout(element, 'remove');
		});

		// Perform actions for current slideout menu
		if (id) {
			const element = document.querySelector(`#${id}`) as HTMLElement;
			const elementState = !element.classList.contains(classes.active) ? 'add' : 'remove';
			set.slideout(element, elementState);
		}

		// Reset body classes
		// Note: using a slight timeout to ensure slideout actions have processed
		setTimeout(() => {
			const slideoutActiveElements = document.querySelectorAll(activeSelector);
			const bodyState = slideoutActiveElements && slideoutActiveElements.length !== 0 ? 'add' : 'remove';
			set.body(bodyState);
		}, 100);
	},
};

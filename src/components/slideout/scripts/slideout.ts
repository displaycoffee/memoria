export const slideout = {
	config: {
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
	},
};

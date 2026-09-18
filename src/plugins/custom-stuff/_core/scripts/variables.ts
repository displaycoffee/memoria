/* This config contains variables to use through application */
const directory = '/burmecia';
export const variables = {
	paths: {
		basename: typeof window == 'object' && window.location.pathname.includes(directory) ? directory : '',
	},
};

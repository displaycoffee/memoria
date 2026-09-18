/* This config contains variables to use through application */
const directory = '/memoria-headless';
export const variables: VariablesType = {
	paths: {
		basename: typeof window == 'object' && window.location.pathname.includes(directory) ? directory : '',
	},
};

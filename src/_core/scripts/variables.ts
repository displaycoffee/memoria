/* This config contains variables to use through application */
export const variables: VariablesType = {
	paths: {
		basename: '',
	},
	urls: {
		graphQL: import.meta.env.GRAPHQL_URL,
		site: import.meta.env.SITE_URL,
		wp: import.meta.env.WP_URL,
	},
};

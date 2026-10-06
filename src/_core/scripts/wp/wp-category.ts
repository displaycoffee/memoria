/* Scripts */
import { utils } from '@/_core/scripts/utils';
import { variables } from '@/_core/scripts/variables';

export const wpCategory = {
	format: (category: CategoryRawType): CategoryType => {
		// Format category data
		// Return formatted data
		return {
			content: category?.description ?? '',
			excerpt: category?.description ? utils.truncate(utils.stripHTML(category.description), 300) : '',
			id: `category-${category?.categoryId ?? 0}`,
			name: category?.name ?? '',
			slug: category?.slug ?? '',
			url: category?.uri ?? '',
		};
	},
	fetch: {
		all: async () => {
			// Fetch all categories
			const nodes = await utils.fetchAll<CategoryRawType>({
				connection: 'categories',
				query: wpCategory.query('query-all'),
				url: variables.urls.graphQL,
			});

			return nodes.map((node) => wpCategory.format(node));
		},
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching category data
		const query = `
			categoryId
			description
			name
			slug
			uri
		`;

		// Return different query depending on format
		switch (format) {
			case 'node':
				return `node { ${query} }`;
			case 'nodes':
				return `nodes { ${query} }`;
			case 'query-all':
				return `query Categories($after: String) {
					categories(first: 100, after: $after) {
						pageInfo {
							hasNextPage
							endCursor
						}
						nodes {
							${query}
						}
					}
				}`;
			default:
				return query;
		}
	},
};

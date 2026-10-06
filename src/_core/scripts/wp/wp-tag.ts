/* Scripts */
import { utils } from '@/_core/scripts/utils';
import { variables } from '@/_core/scripts/variables';

export const wpTag = {
	format: (tag: TagRawType): TagType => {
		// Format tag data
		// Return formatted data
		return {
			content: tag?.description ?? '',
			excerpt: tag?.description ? utils.truncate(utils.stripHTML(tag.description), 300) : '',
			id: `tag-${tag?.tagId ?? 0}`,
			name: tag?.name ?? '',
			slug: tag?.slug ?? '',
			url: tag?.uri ?? '',
		};
	},
	fetch: {
		all: async () => {
			// Fetch all tags
			const nodes = await utils.fetchAll<TagRawType>({
				connection: 'tags',
				query: wpTag.query('query-all'),
				url: variables.urls.graphQL,
			});

			return nodes.map((node) => wpTag.format(node));
		},
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching tag data
		const query = `
			tagId
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
				return `query Tags($after: String) {
					tags(first: 100, after: $after) {
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

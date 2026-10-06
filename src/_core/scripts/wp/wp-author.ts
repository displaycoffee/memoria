/* Scripts */
import { utils } from '@/_core/scripts/utils';
import { variables } from '@/_core/scripts/variables';
import { wpImage } from './wp-image';

export const wpAuthor = {
	format: (author: AuthorRawType | undefined): AuthorType => {
		// Format author data
		const altText = author?.name ? `${author.name} - Avatar` : `Avatar`;

		// Return formatted data
		return {
			avatar: wpImage.format(altText, false, { sourceUrl: author?.avatar?.url }),
			content: author?.description ?? '',
			excerpt: author?.description ? utils.truncate(utils.stripHTML(author.description), 300) : '',
			id: `author-${author?.userId ?? 0}`,
			name: author?.name ?? '',
			slug: author?.slug ?? '',
			url: author?.slug ? `/authors/${author.slug}` : '',
		};
	},
	fetch: {
		all: async () => {
			// Fetch all authors with published posts
			const nodes = await utils.fetchAll<AuthorRawType>({
				connection: 'users',
				query: wpAuthor.query('query-all'),
				url: variables.urls.graphQL,
			});

			return nodes.map((node) => wpAuthor.format(node));
		},
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching author data
		const query = `
			avatar {
				url
			}
			description
			name
			slug
			uri
			userId
		`;

		// Return different query depending on format
		switch (format) {
			case 'node':
				return `node { ${query} }`;
			case 'nodes':
				return `nodes { ${query} }`;
			case 'query-all':
				return `query Authors($after: String) {
					users(first: 100, after: $after, where: { hasPublishedPosts: [POST] }) {
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

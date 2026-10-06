/* Scripts */
import { utils } from '@/_core/scripts/utils';
import { variables } from '@/_core/scripts/variables';
import { wpImage } from './wp-image';

/* Page settings */
const settings = {
	imageSize: 'LARGE',
	pageSize: 12,
};

export const wpPage = {
	format: (page: PageRawType): PageType => {
		// Format page data
		// Return formatted data
		return {
			content: page.content,
			excerpt: utils.truncate(utils.stripHTML(page.content), 300),
			hideSidebar: page?.hideSidebar ?? false,
			id: `page-${page.pageId}`,
			image: wpImage.format(`${page.title} - Featured Image`, true, page?.featuredImage),
			slug: page.slug,
			title: page.title,
			url: page.uri,
		};
	},
	fetch: {
		all: async (exclude?: string[]) => {
			// Fetch all pages, leaving out any excluded slugs
			const nodes = await utils.fetchAll<PageRawType>({
				connection: 'pages',
				query: wpPage.query('query-all'),
				url: variables.urls.graphQL,
			});

			const pages = nodes.map((node) => wpPage.format(node));
			return exclude?.length ? pages.filter((page) => !exclude.includes(page.slug)) : pages;
		},
		page: async (uri: string) => {
			let pageData: PageType | null = null;

			// Fetch page data
			const data = await utils.fetch<{ nodeByUri: PageRawType | null }>({
				query: wpPage.query('query'),
				url: variables.urls.graphQL,
				variables: { uri },
			});

			// Format and set data
			if (data?.nodeByUri) {
				pageData = wpPage.format(data.nodeByUri);
			}

			return pageData;
		},
		pages: async (pageSize: number, exclude?: string[]) => {
			let pagesData: PagesType = [];

			// Get pages data
			const data = await utils.fetch<{ pages: { nodes: PageRawType[] } }>({
				query: wpPage.query('query-nodes', pageSize),
				url: variables.urls.graphQL,
			});

			// Format and set data
			if (data?.pages?.nodes) {
				pagesData = data.pages.nodes.map((node) => wpPage.format(node));
				pagesData = exclude?.length ? pagesData.filter((page) => !exclude.includes(page.slug)) : pagesData;
			}

			return pagesData;
		},
	},
	query: (format: GraphQLQueryFormatType, pageSize?: number) => {
		// Shared query function for fetching page data
		const query = `
			content
			featuredImage {
				${wpImage.query('node', settings.imageSize)}
			}
			hideSidebar
			pageId
			slug
			title
			uri
		`;

		// Return different query depending on format
		switch (format) {
			case 'node':
				return `node { ${query} }`;
			case 'nodes':
				return `nodes { ${query} }`;
			case 'query':
				return `query Page($uri: String!) {
					nodeByUri(uri: $uri) {
						...on Page {
							${query}
						}
					}
				}`;
			case 'query-all': {
				return `query Pages($after: String) {
					pages(first: 100, after: $after) {
						pageInfo {
							hasNextPage
							endCursor
						}
						nodes {
							${query}
						}
					}
				}`;
			}
			case 'query-nodes':
				return `query Pages {
					pages(first: ${pageSize ?? settings.pageSize}) {
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

/* Scripts */
import { utils } from '@/_core/scripts/utils';
import { variables } from '@/_core/scripts/variables';
import { wpAuthor } from './wp-author';
import { wpCategory } from './wp-category';
import { wpImage } from './wp-image';
import { wpTag } from './wp-tag';

/* Post settings */
const settings = {
	imageSize: 'LARGE',
};

export const wpPost = {
	format: (post: PostRawType): PostType => {
		// Create categories and tags
		const categories: CategoriesType = [];
		const tags: TagsType = [];

		if (post?.categories?.nodes && post.categories.nodes.length !== 0) {
			post.categories.nodes.forEach((node: CategoryRawType) => {
				categories.push(wpCategory.format(node));
			});
		}
		if (post?.tags?.nodes && post.tags.nodes.length !== 0) {
			post.tags.nodes.forEach((node: TagRawType) => {
				tags.push(wpTag.format(node));
			});
		}

		// Return formatted data
		return {
			author: wpAuthor.format(post.author?.node),
			categories: categories,
			content: post.content,
			date: utils.getDate(post.date),
			excerpt: utils.truncate(utils.stripHTML(post.excerpt), 300),
			hideSidebar: post?.hideSidebar ?? false,
			id: `post-${post.postId}`,
			image: wpImage.format(`${post.title} - Featured Image`, true, post?.featuredImage),
			slug: post.slug,
			tags: tags,
			title: post.title,
			url: post.uri,
		};
	},
	fetch: {
		all: async (slug?: string, type?: GraphQLPostWhereType) => {
			// Fetch all posts, optionally filtered by author, category, or tag slug
			const nodes = await utils.fetchAll<PostRawType>({
				connection: 'posts',
				query: type ? wpPost.query('query-all', undefined, type) : wpPost.query('query-all'),
				url: variables.urls.graphQL,
				variables: { slug },
			});

			return nodes.map((node) => wpPost.format(node));
		},
		post: async (uri: string) => {
			let postData: PostType | null = null;

			// Fetch post data
			const data = await utils.fetch<{ nodeByUri: PostRawType | null }>({
				query: wpPost.query('query'),
				url: variables.urls.graphQL,
				variables: { uri },
			});

			// Format and set data
			if (data?.nodeByUri) {
				postData = wpPost.format(data.nodeByUri);
			}

			return postData;
		},
		search: async (query: string, pageSize: number, url = variables.urls.graphQL) => {
			let searchData: PostsType = [];

			// Get posts data
			const data = await utils.fetch<{ posts: { pageInfo: { hasNextPage: boolean }; nodes: PostsRawType } }>({
				query: wpPost.query('query-search', pageSize),
				url,
				variables: { query },
			});

			// Format and set data
			if (data?.posts?.nodes) {
				searchData = data.posts.nodes.map((node) => wpPost.format(node));
			}

			return {
				hasNextPage: data?.posts?.pageInfo?.hasNextPage ?? false,
				posts: searchData,
			};
		},
	},
	query: (format: GraphQLQueryFormatType, pageSize?: number, type?: GraphQLPostWhereType) => {
		// Shared query function for fetching post data
		const query = `
			author {
				${wpAuthor.query('node')}
			}
			categories {
				${wpCategory.query('nodes')}
			}
			content
			date
			excerpt(format: RENDERED)
			featuredImage {
				${wpImage.query('node', settings.imageSize)}
			}
			hideSidebar
			postId
			slug
			tags {
				nodes {
					name
					slug
					tagId
					uri
				}
			}
			title
			uri
		`;

		// Create "slug" and "where" filter
		let slug: string = '';
		let where: string = '';

		if (type) {
			slug = ', $slug: String';
			if (type == 'author') {
				where = ', where: { authorName: $slug }';
			} else if (type == 'category') {
				where = ', where: { categoryName: $slug }';
			} else if (type == 'tag') {
				where = ', where: { tag: $slug }';
			}
		}

		// Return different query depending on format
		switch (format) {
			case 'node':
				return `node { ${query} }`;
			case 'nodes':
				return `nodes { ${query} }`;
			case 'query':
				return `query Post($uri: String!) {
					nodeByUri(uri: $uri) {
						...on Post {
							${query}
						}
					}
				}`;
			case 'query-all':
				return `query Posts($after: String${slug}) {
					posts(first: 100, after: $after${where}) {
						pageInfo {
							hasNextPage
							endCursor
						}
						nodes {
							${query}
						}
					}
				}`;
			case 'query-search':
				return `query Search($query: String) {
					posts(first: ${pageSize}, where: { search: $query }) {
						pageInfo {
							hasNextPage
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

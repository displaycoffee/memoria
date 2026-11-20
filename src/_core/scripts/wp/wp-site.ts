/* Scripts */
import { utils } from '@/_core/scripts/utils';
import { variables } from '@/_core/scripts/variables';

export const wpSite = {
	format: (data: SiteRawType) => {
		// Format site data
		const siteData: SiteType = {
			description: data?.description ?? '',
			pageSize: data.postsPerPage,
			title: data.title,
			url: variables.urls.site,
		};

		return siteData;
	},
	fetch: {
		site: async () => {
			let siteData: SiteType = {
				description: '',
				pageSize: 12,
				title: '',
				url: '',
			};

			// Fetch site data
			const data = await utils.fetch<{
				generalSettings: { description: string; title: string };
				readingSettings: { postsPerPage: number };
			}>({
				query: wpSite.query('query'),
				url: variables.urls.graphQL,
			});

			// Format and set data
			if (data?.generalSettings) {
				siteData = wpSite.format({
					...data.generalSettings,
					postsPerPage: data?.readingSettings?.postsPerPage ?? siteData.pageSize,
				});
			}

			return siteData;
		},
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching site data
		const query = `
			description
			title
		`;

		// Return different query depending on format
		switch (format) {
			case 'node':
				return `node { ${query} }`;
			case 'nodes':
				return `nodes { ${query} }`;
			case 'query':
				return `query Settings {
					generalSettings {
						${query}
					}
					readingSettings {
						postsPerPage
					}
				}`;
			default:
				return query;
		}
	},
};

/* Scripts */
import { utils } from '@/_core/scripts/utils';
import { variables } from '@/_core/scripts/variables';
import { wpImage } from './wp-image';

export const wpThemeOptions = {
	format: (themeOptionsData: ThemeOptionsType, data: ThemeOptionsRawType) => {
		// Build footer blocks
		const buildBlock = (id: string, order: string, content: string) => {
			themeOptionsData.footer.blocks.push({
				id: `footer-block-${id}`,
				order: parseInt(order),
				content,
			});
		};
		if (data?.footerBlock01Order && data?.footerBlock01Content) {
			buildBlock('01', data.footerBlock01Order, data.footerBlock01Content);
		}
		if (data?.footerBlock02Order && data?.footerBlock02Content) {
			buildBlock('02', data.footerBlock02Order, data.footerBlock02Content);
		}
		if (data?.footerBlock03Order && data?.footerBlock03Content) {
			buildBlock('03', data.footerBlock03Order, data.footerBlock03Content);
		}
		if (data?.footerBlock04Order) {
			buildBlock('04', data.footerBlock04Order, 'nav menu');
		}

		// Re-sort footer blocks
		themeOptionsData.footer.blocks.sort((a, b) => a.order - b.order);

		// Add header logo
		if (data?.headerLogo) {
			themeOptionsData.header.logo = wpImage.format(`Header Logo`, false, data.headerLogo);
		}

		// Add sidebar slug
		if (data?.sidebarSlug) {
			themeOptionsData.sidebar.slug = data.sidebarSlug;
		}

		// Build social links
		const buildLink = (id: ThemeOptionsSocialIdType, label: string, url: string) => {
			themeOptionsData.social.push({ id, label, url });
		};
		if (data?.socialFacebook) {
			buildLink('facebook', 'Facebook', data.socialFacebook);
		}
		if (data?.socialGithub) {
			buildLink('github', 'GitHub', data.socialGithub);
		}
		if (data?.socialInstagram) {
			buildLink('instagram', 'Instagram', data.socialInstagram);
		}
		if (data?.socialLinkedIn) {
			buildLink('linkedin', 'LinkedIn', data.socialLinkedIn);
		}
		if (data?.socialTwitch) {
			buildLink('twitch', 'Twitch', data.socialTwitch);
		}
		if (data?.socialTwitter) {
			buildLink('twitter', 'Twitter', data.socialTwitter);
		}
		if (data?.socialX) {
			buildLink('x', 'X', data.socialX);
		}
		if (data?.socialYouTube) {
			buildLink('youtube', 'YouTube', data.socialYouTube);
		}

		return themeOptionsData;
	},
	fetch: {
		themeOptions: async () => {
			let themeOptionsData: ThemeOptionsType = {
				footer: {
					blocks: [],
				},
				header: {
					logo: { alt: '', url: '' },
				},
				sidebar: {
					slug: '',
				},
				social: [],
			};

			// Fetch theme options data
			const data = await utils.fetch<{ themeOptions: ThemeOptionsRawType }>({
				query: wpThemeOptions.query('query'),
				url: variables.urls.graphQL,
			});

			// Format and set data
			if (data?.themeOptions) {
				themeOptionsData = wpThemeOptions.format(themeOptionsData, data.themeOptions);
			}

			return themeOptionsData;
		},
	},
	query: (format: GraphQLQueryFormatType) => {
		// Shared query function for fetching theme options data
		const query = `
			footerBlock01Order
			footerBlock01Content
			footerBlock02Order
			footerBlock02Content
			footerBlock03Order
			footerBlock03Content
			footerBlock04Order
			headerLogo {
				altText
				sourceUrl(size: MEDIUM)
			}
			sidebarSlug
			socialFacebook
			socialGithub
			socialInstagram
			socialLinkedIn
			socialTwitch
			socialTwitter
			socialX
			socialYouTube
		`;

		// Return different query depending on format
		switch (format) {
			case 'node':
				return `node { ${query} }`;
			case 'nodes':
				return `nodes { ${query} }`;
			case 'query':
				return `query ThemeOptions {
					themeOptions {
						${query}
					}
				}`;
			default:
				return query;
		}
	},
};

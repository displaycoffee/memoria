/* Scripts */
import { wpAuthor } from './wp-author';
import { wpCategory } from './wp-category';
import { wpMenu } from './wp-menu';
import { wpPage } from './wp-page';
import { wpPost } from './wp-post';
import { wpSite } from './wp-site';
import { wpTag } from './wp-tag';
import { wpThemeOptions } from './wp-theme-options';

/* Query functions for WordPress data */
export const wp: WPType = {
	author: {
		all: wpAuthor.fetch.all,
	},
	category: {
		all: wpCategory.fetch.all,
	},
	menu: {
		menu: wpMenu.fetch.menu,
	},
	page: {
		all: wpPage.fetch.all,
		page: wpPage.fetch.page,
		pages: wpPage.fetch.pages,
		search: wpPage.fetch.search,
	},
	post: {
		all: wpPost.fetch.all,
		post: wpPost.fetch.post,
		search: wpPost.fetch.search,
	},
	site: {
		site: wpSite.fetch.site,
	},
	tag: {
		all: wpTag.fetch.all,
	},
	themeOptions: {
		themeOptions: wpThemeOptions.fetch.themeOptions,
	},
};

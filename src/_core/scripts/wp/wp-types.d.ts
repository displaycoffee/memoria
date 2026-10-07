/* Type definitions */
type Author = {
	avatar: Image;
	content: string;
	excerpt: string;
	id: string;
	name: string;
	slug: string;
	url: string;
};

type Authors = Author[];

type AuthorRaw = {
	avatar?: {
		url: string;
	};
	description?: string;
	name: string;
	slug: string;
	uri: string;
	userId: number;
};

type AuthorsRaw = AuthorRaw[];

type Category = {
	content: string;
	excerpt: string;
	id: string;
	name: string;
	slug: string;
	url: string;
};

type Categories = Category[];

type CategoryRaw = {
	categoryId: number;
	description: string;
	name: string;
	slug: string;
	uri: string;
};

type CategoriesRaw = CategoryRaw[];

type GraphQLParams = {
	query: string;
	url: string;
	variables?: object;
};

type GraphQLConnectionParams = GraphQLParams & {
	connection: string;
};

type GraphQLPostWhere = 'author' | 'category' | 'tag';

type GraphQLQueryFormat = 'node' | 'nodes' | 'query' | 'query-all' | 'query-nodes' | 'query-search';

type Image = {
	alt: string;
	url: string;
};

type Images = Image[];

type ImageRaw = {
	altText?: string;
	sourceUrl?: string;
};

type ImageRawNode = {
	node: ImageRaw;
};

type ImageRawNodes = {
	nodes: ImageRaw[];
};

type MenuItem = {
	id: string;
	isRoute: boolean;
	label: string;
	type: string;
	url: string;
};

type Menu = MenuItem & {
	children: MenuItem[];
};

type MenuItemRaw = {
	connectedObject?: {
		__typename: string;
	};
	label: string;
	menuItemId: string;
	url: string;
};

type MenuRawNodes = MenuItemRaw & {
	childItems?: {
		nodes: MenuItemRaw[];
	};
};

type Page = {
	content: string;
	excerpt: string;
	hideSidebar: boolean;
	id: string;
	image: Image;
	slug: string;
	title: string;
	url: string;
};

type Pages = Page[];

type PageRaw = {
	content: string;
	featuredImage?: ImageRawNode;
	hideSidebar?: boolean;
	pageId: number;
	slug: string;
	title: string;
	uri: string;
};

type PagesRaw = PageRaw[];

type Post = {
	author: Author;
	categories: Categories;
	content: string;
	date: string;
	excerpt: string;
	hideSidebar: boolean;
	id: string;
	image: Image;
	slug: string;
	tags: Tags;
	title: string;
	url: string;
};

type Posts = Post[];

type PostSearchResults = {
	hasNextPage: boolean;
	posts: Posts;
};

type PostRaw = {
	author?: {
		node: AuthorRaw;
	};
	categories: {
		nodes: CategoriesRaw;
	};
	content: string;
	date: string;
	excerpt: string;
	featuredImage?: ImageRawNode;
	hideSidebar?: boolean;
	postId: number;
	slug: string;
	tags: {
		nodes: TagsRaw;
	};
	title: string;
	uri: string;
};

type PostsRaw = PostRaw[];

type Site = {
	description: string;
	pageSize: number;
	title: string;
	url: string;
};

type SiteRaw = {
	description: string;
	postsPerPage: number;
	title: string;
};

type Tag = {
	content: string;
	excerpt: string;
	id: string;
	name: string;
	slug: string;
	url: string;
};

type Tags = Tag[];

type TagRaw = {
	description: string;
	name: string;
	slug: string;
	tagId: number;
	uri: string;
};

type TagsRaw = TagRaw[];

type ThemeOptions = {
	footer: {
		blocks: {
			content: string;
			id: string;
			order: number;
		}[];
	};
	header: {
		logo: Image;
	};
	sidebar: {
		slug: string;
	};
	social: {
		id: ThemeOptionsSocialId;
		label: string;
		url: string;
	}[];
};

type ThemeOptionsSocialId = 'facebook' | 'github' | 'instagram' | 'linkedin' | 'twitch' | 'twitter' | 'x' | 'youtube';

type ThemeOptionsRaw = {
	footerBlock01Order: string;
	footerBlock01Content: string;
	footerBlock02Order: string;
	footerBlock02Content: string;
	footerBlock03Order: string;
	footerBlock03Content: string;
	footerBlock04Order: string;
	headerLogo?: {
		altText?: string;
		sourceUrl: string;
	};
	sidebarSlug: string;
	socialFacebook: string;
	socialGithub: string;
	socialInstagram: string;
	socialLinkedIn: string;
	socialTwitch: string;
	socialTwitter: string;
	socialX: string;
	socialYouTube: string;
};

type WP = {
	author: {
		all: () => Promise<Authors>;
	};
	category: {
		all: () => Promise<Categories>;
	};
	menu: {
		menu: (id: string) => Promise<Menu[]>;
	};
	page: {
		all: (exclude?: string[]) => Promise<Pages>;
		page: (uri: string) => Promise<Page | null>;
		pages: (pageSize: number, exclude?: string[]) => Promise<Pages>;
	};
	post: {
		all: (slug?: string, type?: GraphQLPostWhereType) => Promise<Posts>;
		post: (uri: string) => Promise<Post | null>;
		search: (query: string, pageSize: number, url?: string) => Promise<PostSearchResults>;
	};
	site: {
		site: () => Promise<Site>;
	};
	tag: {
		all: () => Promise<Tags>;
	};
	themeOptions: {
		themeOptions: () => Promise<ThemeOptions>;
	};
};

declare global {
	// Declare global types
	type AuthorType = Author;

	type AuthorsType = Authors;

	type AuthorRawType = AuthorRaw;

	type AuthorsRawType = AuthorsRaw;

	type CategoryType = Category;

	type CategoriesType = Categories;

	type CategoryRawType = CategoryRaw;

	type CategoriesRawType = CategoriesRaw;

	type GraphQLConnectionParamsType = GraphQLConnectionParams;

	type GraphQLParamsType = GraphQLParams;

	type GraphQLPostWhereType = GraphQLPostWhere;

	type GraphQLQueryFormatType = GraphQLQueryFormat;

	type ImageType = Image;

	type ImagesType = Images;

	type ImageRawType = ImageRaw;

	type ImageRawNodeType = ImageRawNode;

	type ImageRawNodesType = ImageRawNodes;

	type MenuItemType = MenuItem;

	type MenuType = Menu;

	type MenuItemRawType = MenuItemRaw;

	type MenuRawNodesType = MenuRawNodes;

	type PageType = Page;

	type PagesType = Pages;

	type PageRawType = PageRaw;

	type PagesRawType = PagesRaw;

	type PostType = Post;

	type PostsType = Posts;

	type PostSearchResultsType = PostSearchResults;

	type PostRawType = PostRaw;

	type PostsRawType = PostsRaw;

	type SiteType = Site;

	type SiteRawType = SiteRaw;

	type TagType = Tag;

	type TagsType = Tags;

	type TagRawType = TagRaw;

	type TagsRawType = TagsRaw;

	type ThemeOptionsType = ThemeOptions;

	type ThemeOptionsRawType = ThemeOptionsRaw;

	type ThemeOptionsSocialIdType = ThemeOptionsSocialId;

	type WPType = WP;
}

/* Export global types */
export {};

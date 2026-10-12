/* Type definitions */
type Page = {
	page: PageType;
};

type PageBlocks = {
	page: PageType;
};

type PageImage = {
	hasLink?: boolean;
	page: PageType;
};

type PageList = {
	pages: PagesType;
};

/* Export prop types */
export type PageProps = Page;

export type PageBlocksProps = PageBlocks;

export type PageImageProps = PageImage;

export type PageListProps = PageList;

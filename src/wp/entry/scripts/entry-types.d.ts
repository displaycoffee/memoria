/* Packages */
import type { ReactNode } from 'react';

/* Type definitions */
type EntryShared = {
	type: 'author' | 'category' | 'page' | 'post' | 'tag';
};

type Entry = EntryShared &
	EntryBlock & {
		hasImage?: boolean;
	};

type EntryBlock = {
	data: EntryData;
};

type EntryContainer = EntryShared & {
	children: ReactNode;
	className?: string;
	id: string;
};

type EntryData = AuthorType | CategoryType | PageType | PostType | TagType;

type EntryImage = {
	hasLink?: boolean;
	hasPlaceholder?: boolean;
	image: ImageType | null;
	url: string;
};

type EntryList = EntryShared & {
	hasImage?: boolean;
	hasPlaceholder?: boolean;
	list: EntryData[];
};

type EntryArchive = EntryShared &
	EntryBlock & {
		children: ReactNode;
	};

/* Export types */
export type EntryDataType = EntryData;

/* Export prop types */
export type EntryProps = Entry;

export type EntryBlockProps = EntryBlock;

export type EntryContainerProps = EntryContainer;

export type EntryImageProps = EntryImage;

export type EntryListProps = EntryList;

export type EntryArchiveProps = EntryArchive;

/* Packages */
import type { HTMLAttributes } from 'react';

/* Type definitions */
type PageAnchorAttributes = HTMLAttributes<HTMLAnchorElement>;

type Page = { number: number; type: 'page' } | { type: 'ellipsis' };

type Pagination = {
	basePath: string;
	page: {
		currentPage: number;
		lastPage: number;
		url: {
			next?: string;
			prev?: string;
		};
	};
};

type PaginationNavigation = {
	direction: 'next' | 'previous';
	url?: string;
};

/* Export types */
export type PageAnchorAttributesType = PageAnchorAttributes;

export type PageType = Page;

/* Export prop types */
export type PaginationProps = Pagination;

export type PaginationNavigationProps = PaginationNavigation;

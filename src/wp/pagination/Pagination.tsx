/* Styles */
import './styles/pagination.scss';

/* Scripts */
import type { PageAnchorAttributesType, PageType, PaginationProps, PaginationNavigationProps } from './scripts/pagination-types';

/* Componentns */
import { List } from '@/components/blocks/Blocks';
import { Icon } from '@/components/icons/Icons';

export const Pagination = (props: PaginationProps) => {
	const { basePath, page } = props;

	/* Nothing to paginate */
	if (page.lastPage <= 1) {
		return;
	}

	/* Build the URL for a given page number */
	const pageUrl = (pageNumber: number) => {
		if (props.pageUrl) return props.pageUrl(pageNumber);
		return pageNumber === 1 ? basePath : `${basePath}/${pageNumber}`;
	};

	/* Set siblings */
	const siblingCount = 2;
	const siblings = Array.from({ length: siblingCount * 2 + 1 }, (_, index) => page.currentPage - siblingCount + index);

	/* How many page numbers to show on either side of the current page */
	const visiblePages = [...new Set([1, page.lastPage, ...siblings])]
		.filter((number) => number >= 1 && number <= page.lastPage)
		.sort((a, b) => a - b);

	/* Create pages for pagination */
	const pages: PageType[] = [];
	visiblePages.forEach((number, index) => {
		if (index > 0 && number - visiblePages[index - 1] > 1) {
			pages.push({ type: 'ellipsis' });
		}
		pages.push({ number, type: 'page' });
	});

	return (
		<nav className="pagination" aria-label="Pagination">
			<List className={'pagination-list row row-nowrap row-auto row-spacing-20 row-align-items-center'} variant={'ul-unstyled'}>
				<PaginationNavigation direction={'previous'} url={page.url.prev} />

				{pages.map((item, index) => {
					// Return ellipsis if not page
					if (item.type === 'ellipsis') {
						return (
							<li className="pagination-list-item pagination-list-item-ellipsis column" key={`ellipsis-${index}`}>
								<span>&hellip;</span>
							</li>
						);
					}

					// Check if page is active
					const isActive = item.number === page.currentPage;
					const linkAttributes: PageAnchorAttributesType = isActive ? { 'aria-current': 'page' } : { className: 'no-decoration' };

					return (
						<li className="pagination-list-item pagination-list-item-page column" key={item.number}>
							<a href={pageUrl(item.number)} {...linkAttributes}>
								{item.number}
							</a>
						</li>
					);
				})}

				<PaginationNavigation direction={'next'} url={page.url.next} />
			</List>
		</nav>
	);
};

/* Components for pagination only; not exported */
const PaginationNavigation = (props: PaginationNavigationProps) => {
	const { direction, url } = props;
	const isNext = direction == 'next';

	return url ? (
		<li className={`pagination-list-item pagination-list-item-navigation pagination-list-item-navigation-${isNext ? 'next' : 'previous'} column`}>
			<a className={`flex-nowrap flex-align-items-center`} href={url} rel={isNext ? 'next' : 'prev'}>
				{isNext ? (
					<>
						Next
						<Icon name={`chevron-right`} />
					</>
				) : (
					<>
						<Icon name={`chevron-left`} />
						Previous
					</>
				)}
			</a>
		</li>
	) : null;
};

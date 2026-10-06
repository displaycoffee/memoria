/* Type definitions */
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

/* Export prop types */
export type PaginationProps = Pagination;

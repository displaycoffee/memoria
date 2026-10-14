/* Type definitions */
type SearchContentType = 'page' | 'post';

type SearchForm = {
	action: string;
	id: string;
};

type SearchFormButton = {
	isDesktop: boolean;
};

type SearchResults = {
	basePath: string;
	graphqlUrl: string;
	siteTitle: string;
	title: string;
};

type SearchState = {
	currentPage: number;
	error: string;
	lastPage: number;
	query: string;
	results: PagesType | PostsType;
	status: 'idle' | 'loading';
	type: SearchContentType;
};

type SearchAction =
	| { type: 'query_set'; contentType: SearchContentType; currentPage: number; query: string }
	| { type: 'search_started' }
	| { type: 'loaded'; lastPage: number; results: PagesType | PostsType }
	| { type: 'failed'; message: string };

/* Export types */
export type SearchActionType = SearchAction;

export type SearchContentTypeType = SearchContentType;

export type SearchStateType = SearchState;

/* Export prop types */
export type SearchFormProps = SearchForm;

export type SearchFormButtonProps = SearchFormButton;

export type SearchResultsProps = SearchResults;

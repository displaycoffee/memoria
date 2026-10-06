/* Type definitions */
type SearchForm = {
	action: string;
	id: string;
};

type SearchResults = {
	graphqlUrl: string;
};

type SearchState = {
	error: string;
	hasNextPage: boolean;
	query: string;
	results: PostsType;
	status: 'idle' | 'loading' | 'loadingMore';
};

type SearchAction =
	| { type: 'query_set'; query: string }
	| { type: 'search_started' }
	| { type: 'load_more_started' }
	| { type: 'loaded'; hasNextPage: boolean; posts: PostsType }
	| { type: 'failed'; message: string };

/* Export types */
export type SearchActionType = SearchAction;

export type SearchStateType = SearchState;

/* Export prop types */
export type SearchFormProps = SearchForm;

export type SearchResultsProps = SearchResults;

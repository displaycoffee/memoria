/* Scripts */
import type { SearchActionType, SearchContentTypeType, SearchStateType } from './search-types';

/* Search settings */
const settings = {
	typeInput: '.search-form input[name="type"]',
};

export const search = {
	getType: (params: URLSearchParams): SearchContentTypeType => {
		// Read the content type from the query string, falling back to posts for anything unexpected
		return params.get('type') == 'page' ? 'page' : 'post';
	},
	updateType: () => {
		// Check the search form radios that match the current search, since the header form is prerendered with posts checked
		// Note: call after each page load, since ClientRouter swaps in a new header
		const params = new URLSearchParams(window.location.search);
		if (!params.has('q')) return;

		const type = search.getType(params);
		document.querySelectorAll<HTMLInputElement>(settings.typeInput).forEach((input) => {
			input.checked = input.value == type;
		});
	},
	initialState: {
		currentPage: 1,
		error: '',
		lastPage: 1,
		query: '',
		results: [],
		status: 'idle',
		type: 'post',
	} as SearchStateType,
	reducer: (state: SearchStateType, action: SearchActionType): SearchStateType => {
		// Every event that changes the search state is handled here so the fields always change together
		switch (action.type) {
			case 'query_set':
				return { ...state, currentPage: action.currentPage, query: action.query, type: action.contentType };
			case 'search_started':
				return { ...state, error: '', status: 'loading' };
			case 'loaded':
				return { ...state, error: '', lastPage: action.lastPage, results: action.results, status: 'idle' };
			case 'failed':
				return { ...state, error: action.message, status: 'idle' };
		}
	},
};

/* Scripts */
import type { SearchActionType, SearchStateType } from './search-types';

export const search = {
	initialState: {
		error: '',
		hasNextPage: false,
		query: '',
		results: [],
		status: 'idle',
	} as SearchStateType,
	reducer: (state: SearchStateType, action: SearchActionType): SearchStateType => {
		// Every event that changes the search state is handled here so the fields always change together
		switch (action.type) {
			case 'query_set':
				return { ...state, query: action.query };
			case 'search_started':
				return { ...state, error: '', status: 'loading' };
			case 'load_more_started':
				return { ...state, status: 'loadingMore' };
			case 'loaded':
				return { ...state, error: '', hasNextPage: action.hasNextPage, results: action.posts, status: 'idle' };
			case 'failed':
				return { ...state, error: action.message, status: 'idle' };
		}
	},
};

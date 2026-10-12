/* Scripts */
import type { SearchActionType, SearchStateType } from './search-types';

export const search = {
	initialState: {
		currentPage: 1,
		error: '',
		lastPage: 1,
		query: '',
		results: [],
		status: 'idle',
	} as SearchStateType,
	reducer: (state: SearchStateType, action: SearchActionType): SearchStateType => {
		// Every event that changes the search state is handled here so the fields always change together
		switch (action.type) {
			case 'query_set':
				return { ...state, currentPage: action.currentPage, query: action.query };
			case 'search_started':
				return { ...state, error: '', status: 'loading' };
			case 'loaded':
				return { ...state, error: '', lastPage: action.lastPage, results: action.posts, status: 'idle' };
			case 'failed':
				return { ...state, error: action.message, status: 'idle' };
		}
	},
};

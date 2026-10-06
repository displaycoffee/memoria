/* Packages */
import { useEffect, useReducer } from 'react';

/* Scripts */
import type { SearchResultsProps } from './scripts/search-types';
import { context } from '../../context/scripts/context';
import { search } from './scripts/search';

/* Components */
import { PostList } from '../post/PostList';

/* Search settings */
const pageSize = 12;

export const SearchResults = (props: SearchResultsProps) => {
	const graphqlUrl = props.graphqlUrl;
	const [state, dispatch] = useReducer(search.reducer, search.initialState);
	const { error, hasNextPage, query, results, status } = state;
	const loading = status === 'loading';
	const loadingMore = status === 'loadingMore';

	useEffect(() => {
		let cancelled = false;

		const fetchResults = async () => {
			// Get search params and fetch query
			const params = new URLSearchParams(window.location.search);
			const q = context.utils.any.sanitize(params.get('q') || '');
			dispatch({ type: 'query_set', query: q });

			// If no query, don't search
			if (!q) return;

			// Restore however many results were loaded before navigating away
			const loaded = parseInt(params.get('loaded') || '', 10);
			const count = loaded > pageSize ? loaded : pageSize;

			// If query is present, do search
			try {
				// Set loading
				dispatch({ type: 'search_started' });

				// Get data, set results, and next page (if not cancelled)
				const data = await context.wp.post.search(q, count, graphqlUrl);
				if (!cancelled) dispatch({ type: 'loaded', hasNextPage: data.hasNextPage, posts: data.posts });
			} catch {
				if (!cancelled) dispatch({ type: 'failed', message: 'Something went wrong. Please try again.' });
			}
		};

		void fetchResults();

		return () => {
			cancelled = true;
		};
	}, [graphqlUrl]);

	const handleLoadMore = async () => {
		try {
			// Set loading
			dispatch({ type: 'load_more_started' });

			// Get data, set results, and next page
			const data = await context.wp.post.search(query, results.length + pageSize, graphqlUrl);
			dispatch({ type: 'loaded', hasNextPage: data.hasNextPage, posts: data.posts });

			// Remember how many results are loaded so navigating back restores them
			const params = new URLSearchParams(window.location.search);
			params.set('loaded', String(data.posts.length));
			window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
		} catch {
			dispatch({ type: 'failed', message: 'Something went wrong. Please try again.' });
		}
	};

	return (
		<div className="search-results margin-trim">
			<h2>Search results for "{query}"</h2>

			{error ? (
				<p>{error}</p>
			) : loading ? (
				<p>Loading...</p>
			) : results.length !== 0 ? (
				<>
					<PostList posts={results} />

					{hasNextPage && (
						<div className="load-more">
							<button className="load-more-button button" type="button" disabled={loadingMore} onClick={handleLoadMore}>
								{loadingMore ? 'Loading...' : 'Load More'}
							</button>
						</div>
					)}
				</>
			) : (
				<p>No results found.</p>
			)}
		</div>
	);
};

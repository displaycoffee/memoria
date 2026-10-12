/* Styles */
import './styles/search-form.scss';

/* Packages */
import { useEffect, useReducer } from 'react';

/* Scripts */
import type { SearchFormProps, SearchFormButtonProps, SearchResultsProps } from './scripts/search-types';
import { search } from './scripts/search';
import { context } from '@/context/scripts/context';

/* Components */
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { Icon } from '@/components/icons/Icons';
import { Button, Form, FormActions, Input } from '@/components/forms/Forms';
import { PostList } from '@/wp/post/Post';

/* Search settings */
const pageSize = 12;

export const SearchForm = (props: SearchFormProps) => {
	const { action, id } = props;
	const searchInputId = `${id}-input`;

	return (
		<Form id={id} className={'search-form flex-nowrap'} hasMarginTrim={false} role={'search'} method={'get'} action={action}>
			<Input id={searchInputId} hasClose={true} label={'Search'} name={'q'} placeholder={'Search for...'} />

			<FormActions>
				<SearchFormButton isDesktop={true} />

				<SearchFormButton isDesktop={false} />
			</FormActions>
		</Form>
	);
};

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
			const q = context.utils.sanitize(params.get('q') || '');
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
		<ErrorBoundary message={'Something went wrong loading search results.'}>
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
		</ErrorBoundary>
	);
};

/* Components for search only; not exported */
const SearchFormButton = (props: SearchFormButtonProps) => {
	const { isDesktop } = props;

	return (
		<Button className={`hide-${isDesktop ? 'mobile' : 'desktop'}`} hideLabel={!isDesktop} label={'Submit'} type={'submit'}>
			<Icon name={'search'} />
		</Button>
	);
};

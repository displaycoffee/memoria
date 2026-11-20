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
import { Button, Form, FormActions, FormField, Choice, Input } from '@/components/forms/Forms';
import { EntryList } from '@/wp/entry/Entry';
import { Pagination } from '@/wp/pagination/Pagination';

/* Search settings */
const pageSize = 12;

export const SearchForm = (props: SearchFormProps) => {
	const { action, id } = props;
	const searchInputId = `${id}-input`;
	const searchTypeId = `${id}-type`;

	return (
		<Form id={id} className={'search-form flex-wrap'} hasMarginTrim={false} role={'search'} method={'get'} action={action}>
			<Input id={searchInputId} hasClose={true} label={'Search'} name={'q'} placeholder={'Search for...'} />

			<FormField className={'form-field-search-within'} hideLabel={true} id={searchTypeId} label={'Search within'} isChoice={true}>
				<Choice id={`${searchTypeId}-posts`} name={'type'} value={'post'} label={'Posts'} type={'radio'} defaultChecked />
				<Choice id={`${searchTypeId}-pages`} name={'type'} value={'page'} label={'Pages'} type={'radio'} />
			</FormField>

			<FormActions>
				<SearchFormButton isDesktop={true} />
				<SearchFormButton isDesktop={false} />
			</FormActions>
		</Form>
	);
};

export const SearchResults = (props: SearchResultsProps) => {
	const { basePath, graphqlUrl, siteTitle, title } = props;
	const [state, dispatch] = useReducer(search.reducer, search.initialState);
	const { currentPage, error, lastPage, query, results, status, type } = state;
	const loading = status === 'loading';

	useEffect(() => {
		let cancelled = false;

		const fetchResults = async () => {
			// Get search params and fetch query
			const params = new URLSearchParams(window.location.search);
			const q = context.utils.sanitize(params.get('q') || '');
			const page = Math.max(1, parseInt(params.get('page') || '', 10) || 1);
			const contentType = search.getType(params);
			dispatch({ type: 'query_set', contentType, currentPage: page, query: q });

			// If no query, don't search
			if (!q) return;

			// If query is present, do search
			try {
				// Set loading
				dispatch({ type: 'search_started' });

				// Get data, set results, and last page (if not cancelled)
				const data = await context.wp[contentType].search(q, page, pageSize, graphqlUrl);
				if (!cancelled) dispatch({ type: 'loaded', lastPage: Math.max(1, Math.ceil(data.total / pageSize)), results: data.results });
			} catch {
				if (!cancelled) dispatch({ type: 'failed', message: 'Something went wrong. Please try again.' });
			}
		};

		void fetchResults();

		return () => {
			cancelled = true;
		};
	}, [graphqlUrl]);

	/* Build the URL for a page of results, keeping the query and content type in the query string */
	const pageUrl = (pageNumber: number) => {
		const params = new URLSearchParams({ q: query, type });
		if (pageNumber > 1) params.set('page', String(pageNumber));
		return `${basePath}?${params.toString()}`;
	};

	/* Search title */
	const searchTitle = query ? `${title} for "${query}"` : title;
	const searchTitleTag = `${siteTitle} - ${searchTitle}`;

	useEffect(() => {
		// Update Head.astro's <title> rather than rendering one, since ClientRouter swaps <head> and React would lose track of a hoisted <title>
		document.title = searchTitleTag;
	}, [searchTitleTag]);

	return (
		<ErrorBoundary message={'Something went wrong loading search results.'}>
			<div className="search-results margin-trim">
				<h2>{searchTitle}</h2>

				{error ? (
					<p>{error}</p>
				) : loading ? (
					<p>Loading...</p>
				) : results.length !== 0 ? (
					<>
						<EntryList list={results} type={type} hasPlaceholder={true} />

						<Pagination
							basePath={basePath}
							page={{
								currentPage,
								lastPage,
								url: {
									next: currentPage < lastPage ? pageUrl(currentPage + 1) : undefined,
									prev: currentPage > 1 ? pageUrl(currentPage - 1) : undefined,
								},
							}}
							pageUrl={pageUrl}
						/>
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

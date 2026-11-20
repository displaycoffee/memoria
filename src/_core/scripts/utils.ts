/* Packages */
import { utils as utilsShared, utilsBrowser as utilsBrowserShared } from '@displaycoffee/scripts/utils';

/* Cache of WordPress requests, so data every page needs (site, theme options, menus) is only fetched once per build */
/* Note: entries are kept for the life of the process, so revisit this if pages ever render on demand in production */
const fetchCache = new Map<string, Promise<unknown>>();

/* Fetch data from WordPress */
const fetchWordPress = async <T>({ url, query, variables = {} }: GraphQLParamsType): Promise<T> => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 30000);

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query,
				variables,
			}),
			signal: controller.signal,
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch WordPress data: ${response.statusText}`);
		}

		const json = (await response.json()) as { data: T; errors?: { message: string }[] };

		if (json.errors) {
			throw new Error(json.errors.map((e) => e.message).join(', '));
		}

		return json.data;
	} finally {
		clearTimeout(timeout);
	}
};

/* Utils from @displaycoffee/scripts, plus any custom scripts for this project */
export const utils: UtilsType = {
	...utilsShared,
	fetch<T = unknown>(params: GraphQLParamsType): Promise<T> {
		// Skip the cache in dev, so WordPress edits show up on the next reload
		if (import.meta.env.DEV) return fetchWordPress<T>(params);

		// Reuse the same request (even one still in flight) for identical queries
		const { url, query, variables = {} } = params;
		const key = JSON.stringify([url, query, variables]);
		const cached = fetchCache.get(key);
		if (cached) return cached as Promise<T>;

		const request = fetchWordPress<T>(params);
		fetchCache.set(key, request);

		// Drop failed requests, so the next call can retry
		request.catch(() => fetchCache.delete(key));

		return request;
	},
	async fetchAll<T = unknown>({ connection, url, query, variables = {} }: GraphQLConnectionParamsType): Promise<T[]> {
		// Fetch every page of a WordPress connection (e.g. posts), following the end cursor until there are no more pages
		// Note: the query needs an $after variable and pageInfo { hasNextPage endCursor }
		type ConnectionResponse = Record<string, { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: T[] } | undefined>;
		let nodes: T[] = [];
		let hasNextPage = true;
		let after: string | null = null;
		let page = 0;
		const maxPages = 100;

		while (hasNextPage && page < maxPages) {
			page++;

			const data: ConnectionResponse = await utils.fetch({ url, query, variables: { ...variables, after } });
			const results = data?.[connection];

			nodes = [...nodes, ...(results?.nodes ?? [])];
			hasNextPage = results?.pageInfo?.hasNextPage ?? false;
			after = results?.pageInfo?.endCursor ?? null;
		}

		return nodes;
	},
	getDate: (time: string) => {
		// Get date
		const date = new Date(time);
		return date.toLocaleDateString('en-US', {
			month: 'long',
			day: '2-digit',
			year: 'numeric',
		});
	},
	sanitize: (string: string, maxLength = 200) => {
		// Strip HTML, collapse whitespace, and enforce a max length
		return utils.stripHTML(string).replace(/\s+/g, ' ').slice(0, maxLength);
	},
};

export const utilsBrowser: UtilsBrowserType = {
	...utilsBrowserShared,
};

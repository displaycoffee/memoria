/* Scripts */
import type { NavigationFlatItemType, NavigationMapType, NavigationMapItemType, NavigationMapItemOptionsType } from './navigation-types';

export const navigationUtils = {
	create: (data: NavigationMapItemOptionsType) => {
		const { children, key, label, includeInSitemap = true, isRoute = true, showInNav = true, url } = data;

		// Build initial navigation item data
		const navigationItem: NavigationMapItemType = {
			id: key,
			includeInSitemap: includeInSitemap,
			isRoute: isRoute,
			label: label,
			showInNav: showInNav,
			url: url ? url : `/${key}`,
		};

		// Add children if available
		if (children && Object.keys(children).length !== 0) {
			const childrenKeys = Object.keys(children);
			const modified: NavigationMapType = {};

			// Loop through children to apprent parent id, unless a custom url was already given
			childrenKeys.forEach((child) => {
				const current = children[child];
				const isDefaultUrl = current.url === `/${current.id}`;

				modified[child] = {
					...current,
					url: isDefaultUrl ? `${navigationItem.url}/${current.id}` : current.url,
				};
			});

			// Set updated children
			navigationItem.children = modified;
		}

		return { [key]: navigationItem };
	},
	get: {
		// includeHidden is only meant for the sitemap routes script in @displaycoffee/burmecia, which needs every route (including
		// showInNav: false ones) to build the sitemap; leave it off everywhere else so the nav UI
		// keeps filtering those out.
		list: (data: NavigationMapType, includeHidden = false): NavigationFlatItemType[] => {
			return Object.keys(data)
				.filter((dataKey) => includeHidden || data[dataKey].showInNav)
				.map((dataKey) => {
					const { children, ...rest } = data[dataKey];

					// Create modified object
					const modified: NavigationFlatItemType = { ...rest };

					// If children, add array of children
					if (children && Object.keys(children).length !== 0) modified.children = navigationUtils.get.list(children, includeHidden);

					return modified;
				});
		},
		listItem: (data: NavigationMapType, key: string): NavigationFlatItemType | undefined => {
			return navigationUtils.get.list(data).find((item) => item.id === key);
		},
	},
	is: {
		// Strip trailing slashes so /page-one and /page-one/ match (trailingSlash is 'ignore'), but keep / for the home page
		normalize: (path: string) => path.replace(/\/+$/, '') || '/',
		current: (url: string, currentPath: string) => {
			const { normalize } = navigationUtils.is;
			return normalize(url) === normalize(currentPath);
		},
		active: (url: string, currentPath: string) => {
			// Same as TanStack's default activeProps match: exact, or a child route (/page-two/child-page-one keeps /page-two active)
			const { current, normalize } = navigationUtils.is;
			const path = normalize(url);
			return current(url, currentPath) || (path !== '/' && normalize(currentPath).startsWith(`${path}/`));
		},
	},
};

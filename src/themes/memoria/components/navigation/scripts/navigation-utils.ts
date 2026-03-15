/* Local scripts */
import { utils } from '../../../_config/scripts/utils';
import { NavigationMapType, NavigationRoutesType, NavigationType } from './navigation-types';
import { navigation } from './navigation';

export const navigationUtils = {
	get: {
		list: () => {
			// Create navigation clone
			let navigationClone = [] as NavigationType[];

			navigation.forEach((nav) => {
				// Create child array navigation
				const navChildren = [] as NavigationType[];

				// Check if children are available and build config
				if (nav?.children && nav.children.length !== 0) {
					nav.children.forEach((child) => {
						if (child.showInNav) {
							child.url = child.isRoute && !child.url.includes(nav.url) ? `${nav.url}${child.url}` : child.url;
							navChildren.push(child);
						}
					});
				}

				// If parent navigation is value, push object
				if (nav.showInNav) {
					navigationClone.push({
						...nav,
						children: navigationUtils.sort(navChildren),
					});
				}
			});

			// Return final navigation
			return navigationClone && navigationClone.length !== 0 ? navigationUtils.sort(navigationClone) : [];
		},
		children: (listId: number) => {
			// Create navigation clone
			let navigationClone = [] as NavigationType[];

			navigation.forEach((nav) => {
				if (listId == nav.id && nav?.children && nav.children.length !== 0) {
					// Create child properties
					nav.children.forEach((child) => {
						if (child.showInNav) {
							child.url = child.isRoute && !child.url.includes(nav.url) ? `${nav.url}${child.url}` : child.url;
							navigationClone.push(child);
						}
					});
				}
			});

			// Return final navigation
			return navigationClone && navigationClone.length !== 0 ? navigationUtils.sort(navigationClone) : [];
		},
	},
	routes: {
		build: {
			config: (nav: NavigationType, map: NavigationMapType) => {
				// Build route config
				const config = {
					id: nav.id,
					element: map[navigationUtils.routes.build.key(nav.url)],
					path: nav.url,
				} as NavigationRoutesType;

				// Add props if there are any
				if (nav?.props) {
					config.props = nav.props;
				}

				return config;
			},
			key: (url: string) => {
				// Build map key for routes
				const last = utils.getLast(url, '/');
				return last ? last : 'home';
			},
		},
	},
	sort: (list: NavigationType[]) => {
		// Function to sort navigation list
		return list.sort((a, b) => {
			return a.id - b.id;
		});
	},
};

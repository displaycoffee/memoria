/* Scripts */
import { NavigationRoutesType } from './navigation-types';
import { navigation } from './navigation';
import { navigationUtils } from './navigation-utils';

/* Create routes array */
const routes = [] as NavigationRoutesType[];

navigation.forEach((nav) => {
	if (nav.isRoute) {
		// Build parent nav config
		const navConfig = {
			...navigationUtils.routes.build(nav),
			children: [] as NavigationRoutesType[],
		};

		// Build child config
		if (nav?.children && nav.children.length !== 0) {
			nav.children.forEach((child) => {
				if (child.isRoute) {
					const childConfig = navigationUtils.routes.build(child);
					navConfig.children.push(childConfig);
				}
			});
		}

		// Then push routes
		routes.push(navConfig);
	}
});

export const navigationRoutes = routes;

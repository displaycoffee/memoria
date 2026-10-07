/* Scripts */
import type { NavigationMapType } from './navigation-types';
import { navigationUtils } from './navigation-utils';

const { create } = navigationUtils;

export const navigationHeader: NavigationMapType = {
	...create({ key: 'index', label: 'Home', url: '/' }),
	...create({ key: 'page-one', label: 'Page One' }),
	...create({
		key: 'page-two',
		label: 'Page Two',
		children: {
			...create({ key: 'child-page-one', label: 'Child Page One' }),
			...create({ key: 'child-page-two', label: 'Child Page Two' }),
		},
	}),
	...create({ key: 'page-three', label: 'Page Three' }),
	...create({ key: 'page-four', label: 'Page Four' }),
};

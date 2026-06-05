/* Packages */
import { lazy } from 'react';

/* Scripts */
import { NavigationType } from './navigation-types';

/* Components */
const Home = lazy(() => import('../../../pages/home/Home').then((m) => ({ default: m.Home })));
const PageOne = lazy(() => import('../../../pages/page-one/PageOne').then((m) => ({ default: m.PageOne })));
const PageTwo = lazy(() => import('../../../pages/page-two/PageTwo').then((m) => ({ default: m.PageTwo })));

export const navigation = [
	{
		id: 0,
		alt: 'Home',
		element: Home,
		isRoute: true,
		label: 'Home',
		showInNav: true,
		url: '/',
	},
	{
		id: 1,
		alt: 'Page One',
		element: PageOne,
		isRoute: true,
		label: 'Page One',
		showInNav: true,
		url: '/page-one',
	},
	{
		id: 2,
		alt: 'Page Two',
		element: PageTwo,
		isRoute: true,
		label: 'Page Two',
		showInNav: true,
		url: '/page-two',
		children: [
			{
				id: 1,
				alt: 'Child Page One',
				element: PageTwo,
				isRoute: true,
				label: 'Child Page One',
				showInNav: true,
				url: '/child-page-one',
			},
			{
				id: 2,
				alt: 'Child Page Two',
				element: PageTwo,
				isRoute: true,
				label: 'Child Page Two',
				url: '/child-page-two',
				showInNav: true,
			},
		],
	},
] as NavigationType[];

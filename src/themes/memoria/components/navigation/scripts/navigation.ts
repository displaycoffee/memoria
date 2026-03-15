/* Local scripts */
import { NavigationType } from './navigation-types';

export const navigation = [
	{
		id: 0,
		alt: 'Home',
		isRoute: true,
		label: 'Home',
		showInNav: true,
		url: '/',
	},
	{
		id: 1,
		alt: 'Page One',
		isRoute: true,
		label: 'Page One',
		showInNav: true,
		url: '/page-one',
		props: {
			test: 'test test',
		},
	},
	{
		id: 2,
		alt: 'Page Two',
		isRoute: true,
		label: 'Page Two',
		showInNav: true,
		url: '/page-two',
		children: [
			{
				id: 1,
				alt: 'Child Page One',
				isRoute: true,
				label: 'Child Page One',
				showInNav: true,
				url: '/child-page-one',
			},
			{
				id: 2,
				alt: 'Child Page Two',
				isRoute: true,
				label: 'Child Page Two',
				url: '/child-page-two',
				showInNav: true,
				props: {
					test1: 'test test 1',
					test2: 'test test 2',
				},
			},
		],
	},
] as NavigationType[];

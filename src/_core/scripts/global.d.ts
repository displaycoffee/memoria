/* Packages */
import type { SyntheticEvent } from 'react';
import type { UtilsType as UtilsSharedType, UtilsBrowserType as UtilsSharedBrowserType } from '@displaycoffee/scripts/utils-types';
import type themeJson from '@/_core/tokens/theme.json';
import type { icons } from '@/_core/data/icons';

/* Type definitions */
type Events = SyntheticEvent | Event;

type IconName = keyof typeof icons;

type ObjectString = {
	[key: string]: string;
};

type ObjectPrimitive = {
	[key: string]: Primitive;
};

type Primitive = string | number | boolean;

type Theme = {
	breakpoints: (typeof themeJson)['breakpoint'];
	colors: (typeof themeJson)['color'];
};

type Utils = UtilsSharedType & {
	fetch<T = unknown>({ url, query, variables }: GraphQLParamsType): Promise<T>;
	fetchAll<T = unknown>({ connection, url, query, variables }: GraphQLConnectionParamsType): Promise<T[]>;
	getDate: (time: string) => string;
	sanitize: (string: string, maxLength?: number) => string;
};

type UtilsBrowser = UtilsSharedBrowserType;

type Variables = {
	paths: {
		basename: string;
	};
	urls: {
		graphQL: string;
		site: string;
		wp: string;
	};
};

declare global {
	// Declare custom environment variables
	interface ImportMetaEnv {
		readonly GRAPHQL_URL: string;
		readonly SITE_URL: string;
		readonly WP_URL: string;
	}

	// Declare global types
	type EventsType = Events;

	type IconNameType = IconName;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	type ThemeType = Theme;

	type UtilsType = Utils;

	type UtilsBrowserType = UtilsBrowser;

	type VariablesType = Variables;

	// Declare global prop types
	type ObjectPrimitiveProps = ObjectPrimitive;
}

/* Export global types */
export {};

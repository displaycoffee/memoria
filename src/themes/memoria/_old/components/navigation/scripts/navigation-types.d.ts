/* Type definitions */
type Navigation = {
	alt?: string;
	children?: Navigation[];
	element?: JSX.Element;
	id: number;
	isRoute?: boolean;
	label: string;
	props?: ObjectPrimitiveType;
	showInNav?: boolean;
	url: string;
};

type NavigationComponent = {
	disableTransition?: boolean;
};

type NavigationListItem = {
	children?: ReactNode;
	disableTransition: boolean;
	nav: Navigation;
	navigationLinkClass: string;
	parent?: string;
};

type NavigationRoutes = {
	children?: NavigationRoutes[];
	element: JSX.Element;
	id: number;
	path: string;
	props?: ObjectPrimitiveType;
};

/* Export types */
export type NavigationRoutesType = NavigationRoutes;

export type NavigationType = Navigation;

/* Export prop types */
export type NavigationComponentProps = NavigationComponent;

export type NavigationListItemProps = NavigationListItem;

export type NavigationRoutesProps = NavigationRoutes;

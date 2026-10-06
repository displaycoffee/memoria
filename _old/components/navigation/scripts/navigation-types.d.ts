/* Type definitions */
type Navigation = {
	direction?: 'horizontal' | 'vertical';
	id: string;
	label: string;
	menu?: MenuType[];
	name: string;
	showChildren?: boolean;
};

type NavigationListItem = {
	item: MenuItemType;
};

type NavigationListItemAttributes = {
	class: string;
	href: string;
	target?: string;
	rel?: string;
};

/* Export prop types */
export type NavigationProps = Navigation;

export type NavigationListItemProps = NavigationListItem;

export type NavigationListItemAttributesType = NavigationListItemAttributes;

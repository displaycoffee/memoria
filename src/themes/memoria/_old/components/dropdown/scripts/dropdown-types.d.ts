/* Type definitions */
type Dropdown = {
	buttonLabel?: string;
	children: ReactNode;
	closeOnClick?: boolean;
};

type DropdownButton = {
	buttonLabel: string;
	buttonLinkClass?: string;
	buttonUrl?: string;
	closeContent: MouseEvent<HTMLAnchorElement>;
	toggleDropdown: MouseEvent<HTMLButtonElement>;
};

type DropdownButtonAttributes = HTMLAttributes<HTMLDivElement>;

type DropdownContent = {
	children: ReactNode;
	closeContent: MouseEvent<HTMLDivElement>;
};

/* Export types */
export type DropdownButtonAttributesType = DropdownButtonAttributes;

/* Export prop types */
export type DropdownProps = Dropdown;

export type DropdownButtonProps = DropdownButton;

export type DropdownContentProps = DropdownContent;

/* Type definitions */
type Dropdown = {
	buttonLabel: string;
	buttonLinkClass?: string;
	buttonUrl?: string;
	children: ReactNode;
	closeOnClick?: boolean;
};

type DropdownButton = {
	buttonLabel: string;
	buttonLinkClass?: string;
	buttonUrl?: string;
	closeContent: MouseEventHandler<HTMLAnchorElement>;
	toggleDropdown: MouseEventHandler<HTMLButtonElement>;
};

type DropdownContent = {
	children: ReactNode;
	closeContent: MouseEventHandler<HTMLDivElement>;
};

/* Export types */

/* Export prop types */
export type DropdownProps = Dropdown;

export type DropdownButtonProps = DropdownButton;

export type DropdownContentProps = DropdownContent;

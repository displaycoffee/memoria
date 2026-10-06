/* Packages */
import type { MouseEventHandler, ReactNode, RefObject } from 'react';
import type { ButtonProps } from '../../forms/scripts/forms-types';

/* Type definitions */
type Dropdown = {
	buttonLabel: string;
	children: ReactNode;
	closeOnClick?: boolean;
	hideLabel?: boolean;
};

type DropdownButton = {
	buttonLabel: string;
	buttonLinkClass?: string;
	buttonRef: RefObject<HTMLButtonElement | null>;
	buttonUrl?: string;
	closeContent: MouseEventHandler<HTMLAnchorElement>;
	contentId: string;
	isExpanded: boolean;
	hideLabel?: boolean;
	toggleDropdown: MouseEventHandler<HTMLButtonElement>;
};

type DropdownButtonAttributes = Omit<ButtonProps, 'hideLabel' | 'label'>;

type DropdownContent = {
	children: ReactNode;
	closeContent: MouseEventHandler<HTMLDivElement>;
	contentId: string;
};

/* Export types */
export type DropdownButtonAttributesType = DropdownButtonAttributes;

/* Export prop types */
export type DropdownProps = Dropdown;

export type DropdownButtonProps = DropdownButton;

export type DropdownContentProps = DropdownContent;

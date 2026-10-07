/* Packages */
import type { ReactNode } from 'react';
import type { ButtonProps } from '@/components/forms/scripts/forms-types';

/* Type definitions */
type Dropdown = {
	buttonLabel: string;
	children: ReactNode;
	closeOnClick?: boolean;
	hideLabel?: boolean;
};

type DropdownButton = {
	buttonLabel: string;
	contentId: string;
	hideLabel?: boolean;
};

type DropdownButtonAttributes = Omit<ButtonProps, 'hideLabel' | 'label'>;

type DropdownContent = {
	children: ReactNode;
	contentId: string;
};

/* Export types */
export type DropdownButtonAttributesType = DropdownButtonAttributes;

/* Export prop types */
export type DropdownProps = Dropdown;

export type DropdownButtonProps = DropdownButton;

export type DropdownContentProps = DropdownContent;

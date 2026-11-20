/* Styles */
import './styles/dropdown.scss';

/* Scripts */
import type { DropdownButtonAttributesType, DropdownProps, DropdownButtonProps, DropdownContentProps } from './scripts/dropdown-types';
import { useFormattedId } from '@displaycoffee/scripts/hooks';

/* Components */
import { Button } from '@/components/forms/Forms';
import { Icon } from '@/components/icons/Icons';

export const Dropdown = (props: DropdownProps) => {
	const { buttonLabel, children, closeOnClick = false, hideLabel = false } = props;
	const dropdownId = `dropdown-${useFormattedId()}`;
	const contentId = `${dropdownId}-content`;

	// Render closed, then dropdown.init() (from container.ts) opens and closes it from document
	// Note: no client directive, so there's no astro-island / astro-slot wrapping the markup
	return (
		<div id={dropdownId} className="dropdown dropdown-collapsed" data-close-on-click={closeOnClick ? 'true' : undefined}>
			<DropdownButton buttonLabel={buttonLabel} contentId={contentId} hideLabel={hideLabel} />
			<DropdownContent contentId={contentId}>{children}</DropdownContent>
		</div>
	);
};

export const DropdownButton = (props: DropdownButtonProps) => {
	const { buttonLabel, contentId, hideLabel } = props;

	// Create dropdown icon
	const icon = <Icon name={'chevron-down'} />;

	// Set button attributes
	const buttonAttributes: DropdownButtonAttributesType = {
		['aria-controls']: contentId,
		['aria-expanded']: false,
		className: 'dropdown-button-toggle',
		type: 'button',
		variant: 'unstyled',
	};

	return (
		<div className="dropdown-button">
			<Button {...buttonAttributes} label={buttonLabel} hideLabel={hideLabel}>
				{icon}
			</Button>
		</div>
	);
};

export const DropdownContent = (props: DropdownContentProps) => {
	const { children, contentId } = props;

	return (
		<div id={contentId} className="dropdown-content margin-trim">
			{children}
		</div>
	);
};

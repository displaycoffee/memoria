/* Styles */
import './styles/dropdown.scss';

/* Packages */
import { useState } from 'react';

/* Scripts */
import { DropdownButtonAttributesType, DropdownProps, DropdownButtonProps, DropdownContentProps } from './scripts/dropdown-types';
import { useClickOutside } from './scripts/dropdown-hooks';
import { useFormattedId } from '../../../_config/scripts/hooks';

/* Components */
import { Icon } from '../icons/Icons';

export const Dropdown = (props: DropdownProps) => {
	const { buttonLabel, children, closeOnClick } = props;
	const dropdownId = `dropdown-${useFormattedId()}`;
	const [dropdown, setDropdown] = useState('');

	// Toggle dropdown state
	const toggleDropdown = () => {
		setDropdown(dropdown === dropdownId ? '' : dropdownId);
	};

	// Detect click outside dropdown
	const dropdownRef = useClickOutside(() => setDropdown(''));

	// Determine if we should close dropdown when clicked inside
	const closeContent = () => {
		if (closeOnClick) {
			setDropdown('');
		}
	};

	return (
		<div id={dropdownId} className={`dropdown dropdown-${dropdown === dropdownId ? 'expanded' : 'collapsed'}`} ref={dropdownRef}>
			<DropdownButton buttonLabel={buttonLabel ? buttonLabel : ''} closeContent={closeContent} toggleDropdown={toggleDropdown} />
			<DropdownContent closeContent={closeContent}>{children}</DropdownContent>
		</div>
	);
};

export const DropdownButton = (props: DropdownButtonProps) => {
	const { buttonLabel, toggleDropdown } = props;

	// Create dropdown icon
	const icon = <Icon id={'angle-down'} />;

	// Set button attributes
	const buttonAttributes = {
		className: 'dropdown-button-toggle unstyled',
		type: 'button',
		['aria-label']: 'Dropdown button',
		onClick: toggleDropdown,
	} as DropdownButtonAttributesType;

	return (
		<div className="dropdown-button">
			<button {...buttonAttributes}>
				{buttonLabel ? buttonLabel : null}
				{icon}
			</button>
		</div>
	);
};

export const DropdownContent = (props: DropdownContentProps) => {
	const { children, closeContent } = props;

	return (
		<div className="dropdown-content spacing-reset" onClick={closeContent} role="presentation">
			{children}
		</div>
	);
};

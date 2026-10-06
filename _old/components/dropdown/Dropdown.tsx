/* Styles */
import './styles/dropdown.scss';

/* Packages */
import { useEffect, useRef, useState } from 'react';

/* Scripts */
import type { DropdownButtonAttributesType, DropdownProps, DropdownButtonProps, DropdownContentProps } from './scripts/dropdown-types';
import { useClickOutside } from './scripts/dropdown-hooks';
import { useFormattedId } from '../../_core/scripts/hooks';

/* Components */
import { Button } from '../forms/Forms';
import { Icon } from '../icons/Icons';

export const Dropdown = (props: DropdownProps) => {
	const { buttonLabel, children, closeOnClick, hideLabel = false } = props;
	const dropdownId = `dropdown-${useFormattedId()}`;
	const contentId = `${dropdownId}-content`;
	const [dropdown, setDropdown] = useState('');
	const isExpanded = dropdown === dropdownId;
	const buttonRef = useRef<HTMLButtonElement>(null);

	// Close dropdown
	const closeDropdown = () => {
		setDropdown('');
	};

	// Toggle dropdown state
	const toggleDropdown = () => {
		setDropdown(isExpanded ? '' : dropdownId);
	};

	// Detect click outside dropdown
	const dropdownRef = useClickOutside(closeDropdown);

	// Close dropdown and return focus to the toggle button when Escape is pressed
	useEffect(() => {
		if (!isExpanded) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeDropdown();
				buttonRef.current?.focus();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isExpanded]);

	// Determine if we should close dropdown when clicked inside
	const closeContent = () => {
		if (closeOnClick) setDropdown('');
	};

	return (
		<div id={dropdownId} className={`dropdown dropdown-${isExpanded ? 'expanded' : 'collapsed'}`} ref={dropdownRef}>
			<DropdownButton
				buttonLabel={buttonLabel}
				buttonRef={buttonRef}
				closeContent={closeContent}
				contentId={contentId}
				isExpanded={isExpanded}
				hideLabel={hideLabel}
				toggleDropdown={toggleDropdown}
			/>
			<DropdownContent closeContent={closeContent} contentId={contentId}>
				{children}
			</DropdownContent>
		</div>
	);
};

export const DropdownButton = (props: DropdownButtonProps) => {
	const { buttonLabel, buttonRef, contentId, hideLabel, isExpanded, toggleDropdown } = props;

	// Create dropdown icon
	const icon = <Icon id={'angle-down'} />;

	// Set button attributes
	const buttonAttributes: DropdownButtonAttributesType = {
		['aria-controls']: contentId,
		['aria-expanded']: isExpanded,
		className: 'dropdown-button-toggle',
		onClick: toggleDropdown,
		ref: buttonRef,
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
	const { children, closeContent, contentId } = props;

	return (
		<div id={contentId} className="dropdown-content margin-trim" onClick={closeContent} role="presentation">
			{children}
		</div>
	);
};

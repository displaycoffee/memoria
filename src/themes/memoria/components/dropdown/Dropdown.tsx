/* React */
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

/* Local styles */
import './styles/dropdown.scss';

/* Local scripts */
import { DropdownProps, DropdownButtonProps, DropdownContentProps } from './scripts/dropdown-types';
import { useClickOutside, useFormattedId } from '../../_config/scripts/hooks';

export const Dropdown = (props: DropdownProps) => {
	const { buttonLabel, buttonLinkClass, buttonUrl, children, closeOnClick } = props;
	const dropdownId = `dropdown-${useFormattedId()}`;
	let [dropdown, setDropdown] = useState('');

	// Toggle dropdown state
	const toggleDropdown = () => {
		dropdown = dropdown == dropdownId ? '' : dropdownId;
		setDropdown(dropdown);
	};

	// Detect click outside dropdown
	const dropdownRef = useClickOutside(() => setDropdown(''));

	// Determine if we should close dropdown when clicked inside
	const closeContent = () => {
		if (closeOnClick) {
			dropdown = '';
			setDropdown(dropdown);
		}
	};

	return (
		<div id={dropdownId} className={`dropdown dropdown-${dropdown == dropdownId ? 'expanded' : 'collapsed'}`} ref={dropdownRef}>
			<DropdownButton
				buttonLabel={buttonLabel}
				buttonLinkClass={buttonLinkClass}
				buttonUrl={buttonUrl}
				closeContent={closeContent}
				toggleDropdown={toggleDropdown}
			/>
			<DropdownContent children={children} closeContent={closeContent} />
		</div>
	);
};

export const DropdownButton = (props: DropdownButtonProps) => {
	const { buttonLabel, buttonLinkClass, buttonUrl, closeContent, toggleDropdown } = props;
	const dropdownLinkClass = buttonLinkClass ? buttonLinkClass : 'dropdown-link';
	const dropdownActiveClass = `${dropdownLinkClass} ${dropdownLinkClass}-active`;

	// Create dropdown icon
	const icon = (
		<div className="icon-wrapper">
			<svg className="icon icon-angle-down">
				<use xlinkHref="#icon-angle-down"></use>
			</svg>
		</div>
	);

	return (
		<div className="dropdown-button">
			{buttonUrl ? (
				<>
					<NavLink
						to={buttonUrl}
						onClick={closeContent}
						title={buttonLabel}
						className={({ isActive }) => (isActive ? dropdownActiveClass : dropdownLinkClass)}
					>
						{buttonLabel}
					</NavLink>

					<button className="dropdown-button-toggle unstyled" type="button" onClick={toggleDropdown}>
						{icon}
					</button>
				</>
			) : (
				<button className="dropdown-button-toggle unstyled" type="button" onClick={toggleDropdown}>
					{buttonLabel}
					{icon}
				</button>
			)}
		</div>
	);
};

export const DropdownContent = (props: DropdownContentProps) => {
	const { children, closeContent } = props;

	return (
		<div className="dropdown-content" onClick={closeContent} role="presentation">
			{children}
		</div>
	);
};

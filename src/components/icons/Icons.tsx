/* Styles */
import './styles/icons.scss';

/* Scripts */
import type { IconsProps } from './scripts/icons-types';
import { icons } from '@/_core/data/icons';

export const Icon = (props: IconsProps) => {
	const { name, size } = props;
	const IconComponent = icons[name];
	const iconClass = 'icon-wrapper';

	// Create icon classes
	const iconClasses = [iconClass];
	if (size) iconClasses.push(`${iconClass}-${size}`);

	return (
		<div className={iconClasses.join(' ')}>
			<IconComponent className={'icon'} aria-hidden={'true'} focusable={'false'} />
		</div>
	);
};

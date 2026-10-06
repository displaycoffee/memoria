/* Note: IconMap is in Container and needs to be there or somewhere globally for this to work. */

/* Styles */
import './styles/icons.scss';

/* Scripts */
import type { IconsProps } from './scripts/icons-types';

export const Icon = (props: IconsProps) => {
	const { id, size } = props;
	const iconClass = 'icon-wrapper';

	// Create icon classes
	const iconClasses = [iconClass];
	if (size) iconClasses.push(`${iconClass}-${size}`);

	return (
		<div className={iconClasses.join(' ')}>
			<svg className={`icon icon-${id}`} aria-hidden="true" focusable="false">
				<use xlinkHref={`#icon-${id}`} />
			</svg>
		</div>
	);
};

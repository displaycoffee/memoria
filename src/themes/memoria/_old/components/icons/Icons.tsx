/* Note: SVG file is loaded in src/index.html and then compiled into the final dist.index.html.
   Make sure it's in index.html to use the component or customize as needed. */

/* Styles */
import './styles/icons.scss';

/* Scripts */
import { IconsProps } from './scripts/icons-types';

export const Icon = (props: IconsProps) => {
	const { id, size } = props;
	const iconClass = 'icon-wrapper';

	// Create icon classes
	const iconClasses = [iconClass];
	if (size) {
		iconClasses.push(`${iconClass}-${size}`);
	}

	return (
		<div className={iconClasses.join(' ')}>
			<svg className={`icon icon-${id}`}>
				<use xlinkHref={`#icon-${id}`} />
			</svg>
		</div>
	);
};

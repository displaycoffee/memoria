/* Styles */
import './styles/alert.scss';

/* Scripts */
import type { AlertIconType, AlertProps } from './scripts/alert-types';
import { icons } from '@/_core/data/icons';

/* Icon name for each alert type */
const alertIcons: AlertIconType = {
	error: 'circle-x',
	info: 'info',
	success: 'circle-check',
	warning: 'circle-alert',
};

export const Alert = (props: AlertProps) => {
	const { children, className: propClassName, type = 'error', ...rest } = props;
	const classes = `alert alert-${type} flex-nowrap`;
	const className = propClassName ? `${propClassName} ${classes}` : classes;
	const role = type == 'info' || type == 'success' ? 'status' : 'alert';
	const AlertIcon = icons[alertIcons[type]];

	return (
		<div className={className} role={role} {...rest}>
			<div className="alert-icon">
				<AlertIcon />
			</div>
			<div className="alert-message margin-trim">{children}</div>
		</div>
	);
};

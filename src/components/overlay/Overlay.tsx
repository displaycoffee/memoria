/* Styles */
import './styles/overlay.scss';

/* Scripts */
import type { OverlayProps } from './scripts/overlay-types';

export const Overlay = (props: OverlayProps) => {
	const { children, className: propClassName, closeOnBackdrop = true, ...rest } = props;
	const classes = `overlay${closeOnBackdrop ? ' overlay-dismissible' : ''}`;
	const className = propClassName ? `${propClassName} ${classes}` : classes;

	// Render closed, then overlay.init() (from container.ts) opens and closes it from document
	// Note: open it with a [data-overlay-open="<id>"] button and close it with a [data-overlay-close] button inside it
	return (
		<dialog className={className} data-close-on-backdrop={closeOnBackdrop ? 'true' : undefined} {...rest}>
			<div className="overlay-content">{children}</div>
		</dialog>
	);
};

/* Styles */
import './styles/overlay.scss';

/* Packages */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { KeyboardEvent } from 'react';

/* Scripts */
import type { OverlayProps, OverlayRefType } from './scripts/overlay-types';

/* Selector for elements that can receive focus, used to keep Tab within the dialog */
const focusableSelector =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Overlay = (props: OverlayProps) => {
	const { children, className: propClassName, closeOnBackdrop = true, isOpen, onClose, portal = false, ...rest } = props;
	const classes = `overlay${closeOnBackdrop ? ' overlay-dismissible' : ''}`;
	const className = propClassName ? `${propClassName} ${classes}` : classes;
	const dialogRef: OverlayRefType = useRef(null);
	const pressedBackdrop = useRef(false);

	// Open or close the dialog to match isOpen
	// Note: showModal() handles the backdrop, inert page, focus containment, and Escape; close() restores focus to the opener
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen && !dialog.open) {
			dialog.showModal();

			// React's autoFocus doesn't render the native attribute, so focus a [data-autofocus] element manually
			dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	}, [isOpen]);

	// Keep Tab / Shift + Tab cycling within the dialog instead of moving out to the browser UI
	const handleKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
		if (e.key !== 'Tab') return;

		// Get focusable elements, excluding hidden ones (e.g. a collapsed dropdown's content)
		const focusable = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
			const style = getComputedStyle(element);
			return style.visibility !== 'hidden' && style.display !== 'none';
		});
		if (focusable.length === 0) return;

		// Wrap from last to first element, or first to last with Shift
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	const dialog = (
		// Backdrop click is a mouse shortcut; the keyboard equivalent (Escape) is handled natively by the dialog
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<dialog
			ref={dialogRef}
			className={className}
			onClose={() => onClose()}
			onKeyDown={handleKeyDown}
			onPointerDown={(e) => {
				// Remember whether the press started on the backdrop (the dialog itself, not its content)
				pressedBackdrop.current = e.target === e.currentTarget;
			}}
			onClick={(e) => {
				// Close only when the press both started and ended on the backdrop, so dragging a text selection out of the content doesn't close it
				if (closeOnBackdrop && pressedBackdrop.current && e.target === e.currentTarget) onClose();
				pressedBackdrop.current = false;
			}}
			{...rest}
		>
			<div className="overlay-content">{children}</div>
		</dialog>
	);

	// Optionally render into body so ancestor descendant selectors (e.g. .some-block ul) can't style the dialog's content
	// Note: the top layer already handles stacking; this only changes which CSS rules match
	return portal ? createPortal(dialog, document.body) : dialog;
};

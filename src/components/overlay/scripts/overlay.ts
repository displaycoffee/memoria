/* Selector for elements that can receive focus, used to keep Tab within the dialog */
const focusableSelector =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Selectors for Overlay (Overlay.tsx) and the buttons that open / close it, e.g. <button data-overlay-open="menu" /> and <dialog id="menu" class="overlay"><button data-overlay-close /></dialog> */
const selectors = {
	autofocus: '[data-autofocus]',
	close: '[data-overlay-close]',
	open: '[data-overlay-open]',
	overlay: 'dialog.overlay',
};

/* Overlay whose backdrop the current press started on, if any */
let pressedBackdrop: HTMLDialogElement | null = null;

export const overlay = {
	open: (dialog: HTMLDialogElement) => {
		// Note: showModal() handles the backdrop, inert page, focus containment, and Escape; close() restores focus to the opener
		if (dialog.open) return;
		dialog.showModal();
		overlay.setExpanded(dialog, true);

		// React's autoFocus doesn't render the native attribute, so focus a [data-autofocus] element manually
		dialog.querySelector<HTMLElement>(selectors.autofocus)?.focus();
	},
	close: (dialog: HTMLDialogElement) => {
		if (dialog.open) dialog.close();
	},
	setExpanded: (dialog: HTMLDialogElement, isExpanded: boolean) => {
		// Keep aria-expanded on every button that opens this dialog in sync
		document.querySelectorAll(`[data-overlay-open="${dialog.id}"]`).forEach((button) => button.setAttribute('aria-expanded', String(isExpanded)));
	},
	trapFocus: (e: KeyboardEvent, dialog: HTMLDialogElement) => {
		// Keep Tab / Shift + Tab cycling within the dialog instead of moving out to the browser UI
		// Note: skip hidden elements (e.g. a collapsed dropdown's content)
		const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
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
	},
	init: () => {
		// Handle every overlay from document, so overlays on new pages work without new listeners
		// Note: call once, since the listeners stay on document across navigations
		document.addEventListener('pointerdown', (e) => {
			// Remember whether the press started on the backdrop (the dialog itself, not its content)
			pressedBackdrop = e.target instanceof HTMLDialogElement && e.target.matches(selectors.overlay) ? e.target : null;
		});
		document.addEventListener('click', (e) => {
			const target = e.target instanceof Element ? e.target : null;
			const startedOnBackdrop = pressedBackdrop;
			pressedBackdrop = null;
			if (!target) return;

			// Open from a [data-overlay-open="<dialog id>"] button
			const opener = target.closest<HTMLElement>(selectors.open);
			if (opener) {
				const dialog = document.getElementById(opener.dataset.overlayOpen ?? '');
				if (dialog instanceof HTMLDialogElement) overlay.open(dialog);
				return;
			}

			const dialog = target.closest<HTMLDialogElement>(selectors.overlay);
			if (!dialog) return;

			// Close from a [data-overlay-close] button, or from the backdrop when the press both started and ended there
			// Note: checking where the press started means dragging a text selection out of the content doesn't close it
			const isBackdropClick = target === dialog && startedOnBackdrop === dialog && dialog.dataset.closeOnBackdrop === 'true';
			if (target.closest(selectors.close) || isBackdropClick) overlay.close(dialog);
		});
		document.addEventListener(
			'close',
			(e) => {
				// Reset aria-expanded however the dialog closed (button, backdrop, Escape, or close())
				if (e.target instanceof HTMLDialogElement && e.target.matches(selectors.overlay)) overlay.setExpanded(e.target, false);
			},
			true, // close doesn't bubble, so listen in the capture phase
		);
		document.addEventListener('keydown', (e) => {
			if (e.key !== 'Tab') return;
			const dialog = e.target instanceof Element ? e.target.closest<HTMLDialogElement>(`${selectors.overlay}[open]`) : null;
			if (dialog) overlay.trapFocus(e, dialog);
		});
	},
};

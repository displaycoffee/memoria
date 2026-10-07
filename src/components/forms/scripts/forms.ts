/* Packages */
import type { ReactNode } from 'react';

/* Scripts */
import { utilsBrowser } from '@/_core/scripts/utils';

/* Selector for ButtonScroll (Forms.tsx), which stores its target and offset in data attributes */
const scroll = {
	button: '[data-scroll-target]',
};

/* Selectors for fields with a clear button (FieldClose in Forms.tsx), e.g. <div class="form-field-close"><input class="input" /><button class="button-close" /></div> */
const clearable = {
	activeClass: 'button-active',
	button: '.button-close',
	field: '.form-field-close',
	input: '.input, .textarea',
};

export const forms = {
	build: {
		className: (classes: string, className?: string, disabled?: boolean, pointer?: boolean, srOnly?: boolean) => {
			// Create class array
			const classList = [classes];

			// If custom class name, add that first
			if (className) classList.unshift(className);

			// Add helper classes
			if (disabled) classList.push('disabled');
			if (pointer) classList.push('pointer');
			if (srOnly) classList.push('sr-only');

			// Create className value for form fields
			return classList.join(' ');
		},
		fieldAttributes: (id: string, className: string, descriptionId?: string, error?: ReactNode, errorId?: string, required?: boolean) => {
			// Set common attributes for form fields
			const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;
			return {
				id: id,
				className: className,
				name: id,
				required: required,
				'aria-required': required || undefined,
				'aria-invalid': !!error || undefined,
				'aria-describedby': describedBy,
			};
		},
		formFieldAttributes: (props: { hideLabel: boolean; id: string; label: string; required: boolean }) => {
			// Build common form field props
			const { hideLabel, id, label, required } = props;
			return {
				hideLabel: hideLabel,
				id: id,
				label: label,
				required: required,
			};
		},
	},
	clearable: {
		toggle: (field: Element) => {
			// Show the clear button only while the input has a value
			const input = field.querySelector<HTMLInputElement | HTMLTextAreaElement>(clearable.input);
			const button = field.querySelector<HTMLButtonElement>(clearable.button);
			if (input && button) button.classList.toggle(clearable.activeClass, !!input.value);
		},
		update: () => {
			// Set the clear button state for every field on the page (e.g. prefilled or restored values)
			// Note: call after each page load, since new fields don't fire an input event
			document.querySelectorAll(clearable.field).forEach((field) => forms.clearable.toggle(field));
		},
		init: () => {
			// Handle every clear button from document, so fields added later (or kept with transition:persist) work without new listeners
			// Note: call once, since the listeners stay on document across navigations
			document.addEventListener('input', (e) => {
				const field = e.target instanceof Element ? e.target.closest(clearable.field) : null;
				if (field) forms.clearable.toggle(field);
			});
			document.addEventListener('click', (e) => {
				const button = e.target instanceof Element ? e.target.closest(clearable.button) : null;
				const input = button?.closest(clearable.field)?.querySelector<HTMLInputElement | HTMLTextAreaElement>(clearable.input);
				if (!input) return;

				// Clear the value, then fire input so the button state (and any other input listeners) update
				input.value = '';
				input.dispatchEvent(new Event('input', { bubbles: true }));
				input.focus();
			});
		},
	},
	scroll: {
		init: () => {
			// Handle every ButtonScroll from document, so buttons on new pages work without new listeners
			// Note: call once, since the listener stays on document across navigations
			document.addEventListener('click', (e) => {
				const button = e.target instanceof Element ? e.target.closest<HTMLElement>(scroll.button) : null;
				if (button) utilsBrowser.scrollTo(e, button.dataset.scrollTarget, Number(button.dataset.scrollOffset ?? 0));
			});
		},
	},
	get: {
		ids: (props: { description: string; error: ReactNode; id: string }) => {
			// Get ids for form field
			const { description, error, id } = props;
			const descriptionId = description ? `${id}-description` : undefined;
			const errorId = error ? `${id}-error` : undefined;
			return { descriptionId, errorId };
		},
	},
};

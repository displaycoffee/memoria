/* Function to clear out input fields */
export const closeFormFields = (formFieldSelector: string, inputSelector: string, buttonSelector: string) => {
	// Toggle button class when input has value
	const toggleButtonClass = (value: string, button: HTMLButtonElement) => {
		const buttonClass = 'button-active';
		if (value && !button.classList.contains(buttonClass)) {
			button.classList.add(buttonClass);
		} else if (!value && button.classList.contains(buttonClass)) {
			button.classList.remove(buttonClass);
		}
	};

	if (document.querySelectorAll(formFieldSelector) && document.querySelectorAll(formFieldSelector).length !== 0) {
		document.querySelectorAll(formFieldSelector).forEach((formField) => {
			const input = formField.querySelector(inputSelector) as HTMLInputElement;
			const button = formField.querySelector(buttonSelector) as HTMLButtonElement;

			if (input && button) {
				const value: string = input?.value ? input.value : '';

				// Toggle classes initially
				toggleButtonClass(value, button);

				// Add button click events to clear value
				button.addEventListener('click', () => {
					input.value = '';
					const event = new Event('input', { bubbles: true });
					input.dispatchEvent(event);
					input.focus();
				});
			}
		});
	}
};

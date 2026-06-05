/* Packages */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* Variables for useBodyClass */
const bodyPrefix = 'page-';
const bodySelector = document.querySelector('body');
let previousPage = '';

export const useBodyClass = (defaultPrefix: string) => {
	const location = useLocation();

	useEffect(() => {
		if (!bodySelector) return;

		// Remove any previous body class
		bodySelector.classList.remove(`${bodyPrefix}${previousPage || defaultPrefix}`);

		// Update previous location path
		// Replace any body prefix, remove first slash, and replace any other slash with hyphen
		previousPage = location.pathname.replace(bodyPrefix, '').replace('/', '').replace(/\//g, '-');

		// Add new body class
		bodySelector.classList.add(`${bodyPrefix}${previousPage || defaultPrefix}`);
	}, [location, defaultPrefix]);

	return null;
};

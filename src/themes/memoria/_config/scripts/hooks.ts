/* React */
import { RefObject, useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/* Set pageCache to get previous page */
let pageCache = {
	previous: '',
};

export const useBodyClass = (defaultPrefix: string) => {
	const location = useLocation();
	const bodySelector = document.querySelector('body');
	const bodyPrefix = 'page-';
	const bodyDefault = defaultPrefix;

	if (bodySelector) {
		useEffect(() => {
			// Remove any previous body class
			bodySelector.classList.remove(`${bodyPrefix}${pageCache.previous || bodyDefault}`);

			// Update previous location path
			// Replace any body prefix, remove first slash, and replace any other slash with hyphen
			pageCache.previous = location.pathname.replace(bodyPrefix, '').replace('/', '').replace(/\//g, '-');

			// Add new body class
			bodySelector.classList.add(`${bodyPrefix}${pageCache.previous || bodyDefault}`);
		}, [location]);
	}

	return null;
};

export const useClickOutside = (callback: Function) => {
	const clickRef: RefObject<HTMLDivElement | null> = useRef(null);

	// Determine if a click has been performed outside an element
	useEffect(() => {
		const handleClickOutside = (e: Event) => {
			if (clickRef.current && !clickRef.current.contains(e.target as Node)) {
				callback();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [clickRef, callback]);

	return clickRef;
};

export const useFormattedId = () => {
	// Updates the format of useId hook
	const id = useId();
	return id
		.slice(1, -1)
		.replace(/^\_|\_$/g, '')
		.replace(/\_/g, '-');
};

export const useRespond = (bp: number) => {
	const rule = window.matchMedia(`(min-width: ${bp}px)`);
	let [match, setMatch] = useState(rule.matches);

	// Update match state on media change
	rule.onchange = (e) => {
		if (e.matches) {
			match = true;
		} else {
			match = false;
		}
		setMatch(match);
	};

	return match;
};

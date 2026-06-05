/* Packages */
import { RefObject, useEffect, useRef } from 'react';

export const useClickOutside = (callback: () => void) => {
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

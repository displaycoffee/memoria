/* Packages */
import { MouseEvent, useEffect, useId, useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

export const useFormattedId = () => {
	// Updates the format of useId hook
	const id = useId();
	return id.slice(1, -1).replace(/^_|_$/g, '').replace(/_/g, '-');
};

export const useRespond = (bp: number) => {
	const [match, setMatch] = useState(() => window.matchMedia(`(min-width: ${bp}px)`).matches);

	// Update match state on media change
	useEffect(() => {
		const mediaQuery = window.matchMedia(`(min-width: ${bp}px)`);
		const handler = (e: MediaQueryListEvent) => setMatch(e.matches);
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	}, [bp]);

	return match;
};

export const useViewTransition = () => {
	// Custom hook to use View Transitions API
	const navigate = useNavigate();
	const location = useLocation();

	return (e: MouseEvent<HTMLElement>, target: string | (() => void)) => {
		const isUrl = typeof target === 'string';

		if (!document.startViewTransition || e.ctrlKey || e.metaKey || e.shiftKey || (isUrl && target === location.pathname)) {
			return false;
		} else {
			e.preventDefault();

			const contentEl = document.querySelector('.content') as HTMLElement;
			if (contentEl) contentEl.style.viewTransitionName = 'page-content';

			void document
				.startViewTransition(() => {
					flushSync(() => {
						if (isUrl) {
							void navigate(target);
						} else {
							target();
						}
					});
				})
				.finished.finally(() => {
					if (contentEl) contentEl.style.viewTransitionName = '';
				});
		}
	};
};

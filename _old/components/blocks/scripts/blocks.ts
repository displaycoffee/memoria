export const blocks = {
	reveal: (element: HTMLElement | null, revealClass: string) => {
		if (element) {
			// Create options and callback for observer
			// Note: threshold is edge-triggered (fires as soon as the element appears, before its bottom
			// edge is 10% into the viewport) rather than area-ratio-based, so it works consistently for
			// sections much taller than the viewport, not just ones that can fit fully on screen
			// Note 2: rootMargin values need to be in pixels or precentage values
			const revealOptions = { threshold: 0, rootMargin: '0px 0px -10% 0px' };

			// Callback for reveal
			const revealCallback = (e: IntersectionObserverEntry, observer: IntersectionObserver) => {
				if (!e.isIntersecting) return;

				// Add class once revealed, no need to keep observing
				e.target.classList.add(revealClass);
				observer.unobserve(e.target);
			};

			// Observe to add class once element scrolls into view
			const revealObserver = new IntersectionObserver(([e], observer) => revealCallback(e, observer), revealOptions);
			revealObserver.observe(element);
		}
	},
};

/* Observer for the current page's revealed elements, replaced on each page load */
let revealObserver: IntersectionObserver | undefined;

export const blocks = {
	revealAll: (selector: string, revealClass: string) => {
		// Add revealClass to each element matching selector once it scrolls into view
		// Note: call after each page load, since navigation swaps in new elements, and stop watching the old ones first
		revealObserver?.disconnect();

		// Create options for observer
		// Note: threshold is edge-triggered (fires as soon as the element appears, before its bottom
		// edge is 10% into the viewport) rather than area-ratio-based, so it works consistently for
		// sections much taller than the viewport, not just ones that can fit fully on screen
		// Note 2: rootMargin values need to be in pixels or precentage values
		const revealOptions = { threshold: 0, rootMargin: '0px 0px -10% 0px' };

		// Add class once revealed, no need to keep observing
		revealObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((e) => {
				if (!e.isIntersecting) return;
				e.target.classList.add(revealClass);
				observer.unobserve(e.target);
			});
		}, revealOptions);

		document.querySelectorAll(selector).forEach((element) => revealObserver?.observe(element));
	},
};

/* Scripts */
import { theme } from '@/_core/scripts/theme';
import { overlay } from '@/components/overlay/scripts/overlay';

/* Selectors for Slideout (Slideout.tsx), e.g. <dialog class="slideout overlay" data-slideout-direction="left"><div class="slideout-body" /></dialog> */
const selectors = {
	body: '.slideout-body',
	bodyLink: 'a, button.a',
	hideDesktop: 'dialog.slideout.hide-desktop[open]',
	slideout: 'dialog.slideout',
};

/* Touch start position, used to detect a swipe that closes the slideout */
let touchStart: { x: number; y: number } | null = null;

export const slideout = {
	config: {
		values: {
			// Default values if props are not defined
			width: '350px',
			direction: 'left',
		},
		swipeThreshold: 50, // minimum distance (px) to count as a swipe
	},
	get: {
		orientation: (direction: string) => {
			// Get orientation of slideout
			return direction === 'top' || direction === 'bottom' ? 'vertical' : 'horizontal';
		},
	},
	swipe: (e: TouchEvent, dialog: HTMLDialogElement) => {
		if (!touchStart) return;

		// Set delta coordinates
		const touch = e.changedTouches[0];
		const deltaX = touch.clientX - touchStart.x;
		const deltaY = touch.clientY - touchStart.y;
		touchStart = null;

		// Use whichever axis matches the direction the slideout enters / exits along
		const direction = dialog.dataset.slideoutDirection ?? slideout.config.values.direction;
		const orientation = slideout.get.orientation(direction);
		const delta = orientation === 'vertical' ? deltaY : deltaX;
		const crossDelta = orientation === 'vertical' ? deltaX : deltaY;

		// Ignore short drags and swipes that lean more on the cross axis (e.g. scrolling the nav list)
		if (Math.abs(delta) < slideout.config.swipeThreshold || Math.abs(delta) < Math.abs(crossDelta)) return;

		// Only close when swiping toward the edge the slideout exits through
		const isNegativeDirection = direction === 'top' || direction === 'left';
		const isClosingSwipe = isNegativeDirection ? delta < 0 : delta > 0;
		if (isClosingSwipe) overlay.close(dialog);
	},
	init: () => {
		// Handle every slideout from document, so slideouts on new pages work without new listeners
		// Note: call once, since the listeners stay on document across navigations; opening / closing itself is handled by overlay.init()
		document.addEventListener('click', (e) => {
			// Close the slideout when an inner link or link-style button is clicked on
			const target = e.target instanceof Element ? e.target : null;
			const dialog =
				target?.closest(selectors.body) && target.closest(selectors.bodyLink) ? target.closest<HTMLDialogElement>(selectors.slideout) : null;
			if (dialog) overlay.close(dialog);
		});
		document.addEventListener(
			'touchstart',
			(e) => {
				const isSlideout = e.target instanceof Element && e.target.closest(selectors.slideout);
				const touch = e.touches[0];
				touchStart = isSlideout ? { x: touch.clientX, y: touch.clientY } : null;
			},
			{ passive: true },
		);
		document.addEventListener(
			'touchend',
			(e) => {
				const dialog = e.target instanceof Element ? e.target.closest<HTMLDialogElement>(selectors.slideout) : null;
				if (dialog) slideout.swipe(e, dialog);
			},
			{ passive: true },
		);

		// Close hide-desktop slideouts when the window grows past the breakpoint, since hide-desktop hides the dialog but showModal() would leave the page inert
		// Note: hide-desktop uses the same md breakpoint
		window.matchMedia(`(min-width: ${theme.breakpoints.md})`).addEventListener('change', (e) => {
			if (e.matches) document.querySelectorAll<HTMLDialogElement>(selectors.hideDesktop).forEach((dialog) => overlay.close(dialog));
		});
	},
};

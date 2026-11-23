/* Scripts */
import { overlay } from '@/components/overlay/scripts/overlay';

/* Selectors for WordPress image blocks with a lightbox, e.g. <figure class="wp-block-image wp-lightbox-container"><img src="image.jpg" alt="" /><button class="lightbox-trigger" type="button" aria-haspopup="dialog" /></figure>, and the shared lightbox (Lightbox.tsx)
   Note: WordPress opens these with its Interactivity API script (image/view.js), which never reaches Astro, so this replaces it using the same markup */
const selectors = {
	id: 'lightbox',
	container: '.wp-lightbox-container',
	gallery: '.wp-block-gallery',
	image: ':scope > img',
	trigger: '.wp-lightbox-container > .lightbox-trigger',
	triggerImage: '.wp-lightbox-container > img',
	lightboxImage: '.lightbox-image > .image-wrapper > img',
	prev: '[data-lightbox-prev]',
	next: '[data-lightbox-next]',
};

/* Button types a gallery can pick for the lightbox's buttons (WordPress's navigationButtonType) */
const buttonTypes = ['icon', 'text', 'both'];

/* Lightbox images the lightbox can move between (the clicked image's gallery, or just the clicked image), and the one showing */
let items: Element[] = [];
let current = 0;

export const lightbox = {
	selectors,
	dialog: () => {
		const dialog = document.getElementById(selectors.id);
		return dialog instanceof HTMLDialogElement ? dialog : null;
	},
	label: (container: Element) => {
		// WordPress's trigger label, naming the image when it has alt text
		const alt = container.querySelector<HTMLImageElement>(selectors.image)?.alt.trim();
		return alt ? `Enlarge image: ${alt}` : 'Enlarge';
	},
	show: (index: number) => {
		// Show an item in the lightbox, wrapping around at either end
		const dialog = lightbox.dialog();
		if (!dialog || items.length === 0) return;

		current = (index + items.length) % items.length;
		const source = items[current].querySelector<HTMLImageElement>(selectors.image);
		const target = dialog.querySelector<HTMLImageElement>(selectors.lightboxImage);
		if (!source || !target) return;

		// Copy the image, letting the browser pick a larger srcset candidate for the full-screen size
		// Note: WordPress keeps the full-size URL in its Interactivity API state, which isn't in the entry content, so this uses the image's own sources
		target.src = source.currentSrc || source.src;
		if (source.srcset) {
			target.srcset = source.srcset;
			target.sizes = '100vw';
		} else {
			target.removeAttribute('srcset');
			target.removeAttribute('sizes');
		}
		target.alt = source.alt;

		// Only show previous / next when there's more than one image to move between
		const hasNavigation = items.length > 1;
		dialog.querySelectorAll<HTMLElement>(`${selectors.prev}, ${selectors.next}`).forEach((button) => (button.hidden = !hasNavigation));
	},
	open: (container: Element) => {
		// Open the lightbox on a container's image, moving between the lightbox images in its gallery (if it's in one)
		const dialog = lightbox.dialog();
		if (!dialog) return;

		const gallery = container.closest(selectors.gallery);
		items = gallery ? Array.from(gallery.querySelectorAll(selectors.container)) : [container];
		dialog.dataset.navigationButtonType = lightbox.buttonType(gallery);
		lightbox.show(Math.max(items.indexOf(container), 0));
		overlay.open(dialog);
	},
	buttonType: (gallery: Element | null) => {
		// Get the gallery's button type (icon, text, or both), which memoria-headless adds as data-navigation-button-type, falling back to icon (WordPress's default) for standalone images and older content
		const type = gallery?.getAttribute('data-navigation-button-type');
		return type && buttonTypes.includes(type) ? type : 'icon';
	},
	update: () => {
		// Label each trigger button, since WordPress only sets its aria-label from its script
		// Note: call on every page load, since each navigation swaps in new entry content
		document.querySelectorAll(selectors.trigger).forEach((trigger) => {
			const container = trigger.parentElement;
			if (container) trigger.setAttribute('aria-label', lightbox.label(container));
		});
	},
	init: () => {
		// Handle every lightbox image from document, so images on new pages work without new listeners
		// Note: call once, since the listeners stay on document across navigations
		document.addEventListener('click', (e) => {
			const target = e.target instanceof Element ? e.target : null;
			if (!target) return;

			// Open from the trigger button or the image itself (like WordPress)
			const opener = target.closest(`${selectors.trigger}, ${selectors.triggerImage}`);
			const container = opener?.parentElement;
			if (container) {
				lightbox.open(container);
				return;
			}

			// Move between gallery images from the previous / next buttons
			if (target.closest(selectors.prev)) lightbox.show(current - 1);
			if (target.closest(selectors.next)) lightbox.show(current + 1);

			// Close from a click anywhere around the image (not the image or a button)
			// Note: the dialog fills the screen and is the dark layer itself, so clicks land on its content instead of the backdrop, which is what overlay.init() closes on
			const dialog = target.closest<HTMLDialogElement>(`#${selectors.id}[open]`);
			if (dialog && !target.closest(`${selectors.lightboxImage}, button`)) overlay.close(dialog);
		});

		// Move between gallery images with the arrow keys while the lightbox is open
		document.addEventListener('keydown', (e) => {
			if (!lightbox.dialog()?.open || items.length < 2) return;
			if (e.key === 'ArrowLeft') lightbox.show(current - 1);
			if (e.key === 'ArrowRight') lightbox.show(current + 1);
		});
	},
};

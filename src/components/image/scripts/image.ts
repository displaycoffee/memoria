export const image = {
	placeholder: '/assets/images/theme/placeholder.jpg',
	loading: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	getErrorImage: (src: string) => {
		// Determine if error placeholder has been set
		return src == image.placeholder || src.includes(image.placeholder) ? image.loading : image.placeholder;
	},
	handleError: (target: HTMLImageElement) => {
		// Handle error imaging if image has src or srcset
		if (target.getAttribute('src')) target.src = image.getErrorImage(target.src);
		if (target.getAttribute('srcset')) target.srcset = image.getErrorImage(target.src);
	},
	handleLoad: (target: HTMLImageElement) => {
		// Set natural image width and height on load
		target.setAttribute('width', target.naturalWidth.toString());
		target.setAttribute('height', target.naturalHeight.toString());
	},
	checkComplete: () => {
		// Handle images that finished loading (or failed) before the listeners in init() were added
		document.querySelectorAll<HTMLImageElement>('img[data-image]').forEach((target) => {
			if (!target.complete || !target.getAttribute('src')) return;

			if (target.naturalWidth === 0) {
				image.handleError(target);
			} else if (target.hasAttribute('data-image-size')) {
				image.handleLoad(target);
			}
		});
	},
	init: () => {
		// Handle load and error events for every Image, whether or not it's in a hydrated React island
		// Note: load and error don't bubble, so listen in the capture phase. Call this once, then checkComplete() after each page load.
		document.addEventListener(
			'error',
			(e) => {
				if (e.target instanceof HTMLImageElement && e.target.hasAttribute('data-image')) image.handleError(e.target);
			},
			true,
		);
		document.addEventListener(
			'load',
			(e) => {
				if (e.target instanceof HTMLImageElement && e.target.hasAttribute('data-image-size')) image.handleLoad(e.target);
			},
			true,
		);
	},
};

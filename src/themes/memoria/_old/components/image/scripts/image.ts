export const image = {
	placeholder: '/assets/images/theme/placeholder.jpg',
	loading: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	getErrorImage: (src: string) => {
		// Determine if error placeholder has been set
		return src == image.placeholder || src.includes(image.placeholder) ? image.loading : image.placeholder;
	},
	onError: (e: EventsType) => {
		// Handle error imaging if image has src or srcset
		if (e.target.getAttribute('src')) {
			e.target.src = image.getErrorImage(e.target.src);
		}
		if (e.target.getAttribute('srcset')) {
			e.target.srcset = image.getErrorImage(e.target.src);
		}
	},
	onLoad: (e: EventsType) => {
		// Set natural image width and height on load
		e.target.setAttribute('width', e.target.naturalWidth);
		e.target.setAttribute('height', e.target.naturalHeight);
	},
};

/* Packages */
import type { SyntheticEvent } from 'react';

export const image = {
	placeholder: '/assets/images/theme/placeholder.jpg',
	loading: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
	getErrorImage: (src: string) => {
		// Determine if error placeholder has been set
		return src == image.placeholder || src.includes(image.placeholder) ? image.loading : image.placeholder;
	},
	onError: (e: SyntheticEvent<HTMLImageElement>) => {
		// Handle error imaging if image has src or srcset
		const target = e.currentTarget;
		if (target.getAttribute('src')) target.src = image.getErrorImage(target.src);
		if (target.getAttribute('srcset')) target.srcset = image.getErrorImage(target.src);
	},
	onLoad: (e: SyntheticEvent<HTMLImageElement>) => {
		// Set natural image width and height on load
		const target = e.currentTarget;
		target.setAttribute('width', target.naturalWidth.toString());
		target.setAttribute('height', target.naturalHeight.toString());
	},
};

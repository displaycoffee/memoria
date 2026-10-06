/* Styles */
import './styles/image.scss';

/* Scripts */
import type { ImageProps, ImageAttributesType, WrapperAttributesType } from './scripts/image-types';
import { image as imageUtils } from './scripts/image';

export const Image = (props: ImageProps) => {
	const { alt, hasBg, hasLazy, image, imageClass, wrapperClasses } = props;
	const hasWrapper = props?.hasWrapper ?? true;
	const wrapperPrefix = 'image-wrapper';

	// Set up initial attributes
	const wrapperAttributes: WrapperAttributesType = {
		className: wrapperPrefix,
	};
	const imageAttributes: ImageAttributesType = {
		onError: (e: EventsType) => imageUtils.onError(e),
		onLoad: (e: EventsType) => imageUtils.onLoad(e),
		src: image,
	};

	// Adjust wrapper attributes
	if (hasWrapper) {
		if (wrapperClasses && wrapperClasses.length !== 0) {
			// Add prefix to each class
			const prefixedClasses = wrapperClasses.map((className) => {
				return `${wrapperPrefix}-${className}`;
			});

			// Set new class
			wrapperAttributes.className = `${wrapperPrefix} ${prefixedClasses.join(' ')}`;
		}
		if (hasBg) {
			wrapperAttributes.style = {
				backgroundImage: `url(${image})`,
			};
		}
	}

	// Create alt text
	const altText = alt || '';

	// Adjust image attributes
	if (hasLazy) imageAttributes.loading = 'lazy';
	// Add image class
	if (imageClass) imageAttributes.className = imageClass;
	if (hasWrapper && hasBg) {
		if (!imageAttributes.className) {
			imageAttributes.className = 'image-hidden';
		} else {
			imageAttributes.className = imageAttributes.className + ' image-hidden';
		}
	}

	return hasWrapper ? (
		<div {...wrapperAttributes}>
			<img {...imageAttributes} alt={altText} />
		</div>
	) : (
		<img {...imageAttributes} alt={altText} />
	);
};

/* Styles */
import './styles/image.scss';

/* Scripts */
import { ImageProps, ImageAttributesType, WrapperAttributesType } from './scripts/image-types';
import { image as imageUtils } from './scripts/image';

export const Image = (props: ImageProps) => {
	const { alt, hasBg, hasLazy, image, imageClass, wrapperClass } = props;
	const hasWrapper = props?.hasWrapper ?? true;

	// Set up initial attributes
	const wrapperAttributes = {} as WrapperAttributesType;
	const imageAttributes = {
		onError: (e: EventsType) => imageUtils.onError(e),
		onLoad: (e: EventsType) => imageUtils.onLoad(e),
		src: image,
	} as ImageAttributesType;

	// Adjust wrapper attributes
	if (hasWrapper) {
		if (wrapperClass) {
			wrapperAttributes.className = wrapperClass;
		}
		if (hasBg) {
			wrapperAttributes.style = {
				backgroundImage: `url(${image})`,
			};
		}
	}

	// Create alt text
	const altText = alt ? alt : '';

	// Adjust image attributes
	if (hasLazy) {
		imageAttributes.loading = 'lazy';
	}
	if (imageClass) {
		imageAttributes.className = imageClass;
	}
	if (hasWrapper && hasBg) {
		if (!imageAttributes.className) {
			imageAttributes.className = 'image-hidden';
		} else {
			imageAttributes.className = imageAttributes.className + ' image-hidden';
		}
	}

	return hasWrapper ? (
		<div {...wrapperAttributes}>
			<img {...imageAttributes} alt={altText} title={altText} />
		</div>
	) : (
		<img {...imageAttributes} alt={altText} title={altText} />
	);
};

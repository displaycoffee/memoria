/* Packages */
import type { HTMLAttributes, ImgHTMLAttributes } from 'react';

/* Type definitions */
type Image = {
	alt?: string;
	hasBg?: boolean;
	hasLazy?: boolean;
	hasWrapper?: boolean;
	height?: number;
	image: string;
	imageClass?: string;
	title?: string;
	width?: number;
	wrapperClasses?: string[];
};

type ImageAttributes = ImgHTMLAttributes<HTMLImageElement> & {
	'data-image'?: string;
	'data-image-size'?: string;
};

type WrapperAttributes = HTMLAttributes<HTMLDivElement>;

/* Export types */
export type ImageAttributesType = ImageAttributes;

export type WrapperAttributesType = WrapperAttributes;

/* Export prop types */
export type ImageProps = Image;

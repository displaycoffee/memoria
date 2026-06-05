/* Type definitions */
type Image = {
	alt?: string;
	hasBg?: boolean;
	hasLazy?: boolean;
	hasWrapper?: boolean;
	image: string;
	imageClass?: string;
	title?: string;
	wrapperClass?: string;
};

type ImageAttributes = ImgHTMLAttributes<HTMLImageElement>;

type WrapperAttributes = HTMLAttributes<HTMLDivElement>;

/* Export types */
export type ImageAttributesType = ImageAttributes;

export type WrapperAttributesType = WrapperAttributes;

/* Export prop types */
export type ImageProps = Image;

/* React */
import { ReactNode } from 'react';

/* Type definitions */
type SlideoutButton = {
	outside: boolean;
	show: boolean;
};

type SlideoutOptions = {
	options: {
		button: SlideoutButton;
		closeOnClick: boolean;
		content: ReactNode;
		direction?: string;
		id: string;
		isDesktop: boolean;
		label: string;
		orientation?: string;
		width?: number;
	};
};

/* Export prop types */
export type SlideoutOverlayProps = SlideoutOptions;

export type SlideoutProps = SlideoutOptions;

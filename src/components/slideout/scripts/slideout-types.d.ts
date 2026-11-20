/* Packages */
import type { ReactNode } from 'react';

/* Type definitions */
type Slideout = {
	children?: ReactNode;
	options: {
		direction?: string;
		hideDesktop?: boolean;
		id?: string;
		label: string;
		width?: string;
	};
};

/* Export prop types */
export type SlideoutProps = Slideout;

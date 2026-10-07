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

type SlideoutTouch = React.TouchEvent;

type SlideoutTouchRef = { x: number; y: number } | null;

/* Export types */
export type SlideoutTouchType = SlideoutTouch;

export type SlideoutTouchRefType = SlideoutTouchRef;

/* Export prop types */
export type SlideoutProps = Slideout;

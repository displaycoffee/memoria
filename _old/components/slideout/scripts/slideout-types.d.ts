/* Packages */
import type { ReactNode, RefObject, TouchEvent } from 'react';

/* Type definitions */
type SlideoutButton = {
	outside: boolean;
	show: boolean;
};

type SlideoutOptions = {
	children?: ReactNode;
	options: {
		button: SlideoutButton;
		direction?: string;
		id?: string;
		label: string;
		width?: string;
	};
};

type SlideoutOverlayRef = RefObject<HTMLDivElement | null>;

type SlideoutTouch = TouchEvent<HTMLDivElement>;

type SlideoutTouchRef = { x: number; y: number } | null;

/* Export types */
export type SlideoutOverlayRefType = SlideoutOverlayRef;

export type SlideoutTouchType = SlideoutTouch;

export type SlideoutTouchRefType = SlideoutTouchRef;

/* Export prop types */
export type SlideoutProps = SlideoutOptions;

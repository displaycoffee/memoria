/* Packages */
import type { DialogHTMLAttributes, ReactNode, RefObject } from 'react';

/* Type definitions */
type Overlay = {
	children: ReactNode;
	className?: string;
	closeOnBackdrop?: boolean;
	isOpen: boolean;
	onClose: () => void;
	portal?: boolean;
} & Omit<DialogHTMLAttributes<HTMLDialogElement>, 'children' | 'className' | 'onClose' | 'open'>;

type OverlayRef = RefObject<HTMLDialogElement | null>;

/* Export types */
export type OverlayRefType = OverlayRef;

/* Export prop types */
export type OverlayProps = Overlay;

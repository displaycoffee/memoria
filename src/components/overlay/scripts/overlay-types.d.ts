/* Packages */
import type { DialogHTMLAttributes, ReactNode } from 'react';

/* Type definitions */
type Overlay = {
	children: ReactNode;
	className?: string;
	closeOnBackdrop?: boolean;
} & Omit<DialogHTMLAttributes<HTMLDialogElement>, 'children' | 'className' | 'open'>;

/* Export prop types */
export type OverlayProps = Overlay;

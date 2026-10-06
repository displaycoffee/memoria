/* Packages */
import type { ReactNode } from 'react';

/* Type definitions */
type ContainerChildren = {
	children: ReactNode;
};

type Container = {
	hideSidebar?: boolean;
	title?: string;
};

type ContainerMain = ContainerChildren;

/* Export prop types */
export type ContainerProps = Container;

export type ContainerMainProps = ContainerMain;

/* Packages */
import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

export const index = {
	renderTarget: (element: string, component: ReactNode) => {
		// Render target for app
		const targetElement = document.querySelector(element);
		if (targetElement) {
			const targetHasChildren = targetElement.children.length > 0;
			if (!targetHasChildren) {
				const target = createRoot(targetElement);
				target.render(component);
			}
		}
	},
};

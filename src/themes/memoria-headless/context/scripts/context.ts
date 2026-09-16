/* Scripts */
import type { ContextValuesType } from './context-types';
import { theme } from '../../_core/scripts/theme';
import { utils } from '../../_core/scripts/utils';
import { variables } from '../../_core/scripts/variables';

/* Global context to use throughout Astro project */
export const context: ContextValuesType = {
	theme,
	utils,
	variables,
};

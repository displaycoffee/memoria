/* Scripts */
import type { EntryDataType } from './entry-types';

export const entry = {
	getData: (data: EntryDataType) => {
		// Get data for different entry types
		return {
			title: 'name' in data ? data.name : data.title,
			image: 'image' in data ? data.image : 'avatar' in data ? data.avatar : null,
		};
	},
};

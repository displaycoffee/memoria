/* Type definitions */
type DuotoneChannels = {
	r: string;
	g: string;
	b: string;
};

type DuotonePresets = Record<string, [string, string]>;

/* Export types */
export type DuotoneChannelsType = DuotoneChannels;
export type DuotonePresetsType = DuotonePresets;

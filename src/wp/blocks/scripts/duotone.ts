/* Scripts */
import type { DuotoneChannelsType, DuotonePresetsType } from './blocks-types';

// WordPress's default duotone presets (wp-includes/theme.json), as [shadow, highlight]
// Note: memoria-headless turns off custom duotones, so these presets are the only wp-duotone-* classes that reach Astro
export const duotonePresets: DuotonePresetsType = {
	'dark-grayscale': ['#000000', '#7f7f7f'],
	grayscale: ['#000000', '#ffffff'],
	'purple-yellow': ['#8c00b7', '#fcff41'],
	'blue-red': ['#000097', '#ff4747'],
	midnight: ['#000000', '#00a5ff'],
	'magenta-yellow': ['#c7005a', '#fff278'],
	'purple-green': ['#a60072', '#67ff66'],
	'blue-orange': ['#1900d8', '#ffa96b'],
};

// Blocks that support duotone and where WordPress applies the filter (from each block.json's selectors.filter.duotone)
const duotoneSelectors = [
	'.wp-block-image img',
	'.wp-block-cover > .wp-block-cover__image-background',
	'.wp-block-cover > .wp-block-cover__video-background',
	'.wp-block-avatar img',
	'.wp-block-post-author .wp-block-post-author__avatar img',
	'.wp-block-post-featured-image img',
	'.wp-block-site-logo img',
];

export const duotone = {
	channels: (colors: [string, string]): DuotoneChannelsType => {
		// Split each hex color into 0-1 channel values, like WordPress's feFunc tableValues
		const channel = (start: number) => colors.map((hex) => parseInt(hex.slice(start, start + 2), 16) / 255).join(' ');
		return { r: channel(1), g: channel(3), b: channel(5) };
	},
	css: () => {
		// Point each preset's class at its SVG filter, e.g. .wp-duotone-purple-green.wp-block-image img { filter: url(#wp-duotone-purple-green); }
		return Object.keys(duotonePresets)
			.map((slug) => {
				const selectors = duotoneSelectors.map((selector) => `.wp-duotone-${slug}${selector}`).join(', ');
				return `${selectors} { filter: url(#wp-duotone-${slug}); }`;
			})
			.join('\n');
	},
};

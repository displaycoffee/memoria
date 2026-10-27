/* Scripts */
import { duotone, duotonePresets } from './scripts/duotone';

export const DuotoneFilters = () => {
	// WordPress prints these SVG filters into its own pages, which never reach Astro, so render the same ones here
	// Note: the CSS goes through dangerouslySetInnerHTML so React doesn't escape the > in the cover selectors
	return (
		<>
			<svg className="duotone-filters" width="0" height="0" aria-hidden="true" focusable="false">
				<defs>
					{Object.entries(duotonePresets).map(([slug, colors]) => {
						const channels = duotone.channels(colors);

						return (
							<filter id={`wp-duotone-${slug}`} key={slug}>
								<feColorMatrix
									colorInterpolationFilters="sRGB"
									type="matrix"
									values=".299 .587 .114 0 0 .299 .587 .114 0 0 .299 .587 .114 0 0 .299 .587 .114 0 0"
								/>
								<feComponentTransfer colorInterpolationFilters="sRGB">
									<feFuncR type="table" tableValues={channels.r} />
									<feFuncG type="table" tableValues={channels.g} />
									<feFuncB type="table" tableValues={channels.b} />
									<feFuncA type="table" tableValues="1 1" />
								</feComponentTransfer>
								<feComposite in2="SourceGraphic" operator="in" />
							</filter>
						);
					})}
				</defs>
			</svg>

			<style dangerouslySetInnerHTML={{ __html: duotone.css() }} />
		</>
	);
};

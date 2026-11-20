export const wpImage = {
	format: (alt: string, data?: ImageRawType | ImageRawNodeType) => {
		const attrs = data && 'node' in data ? data.node : data;

		// Format image data
		const imageData: ImageType = {
			alt: attrs?.altText ? `${attrs.altText} - ${alt}` : alt,
			url: attrs?.sourceUrl ?? '', // Empty when there's no image, so components can choose to show a placeholder
		};

		return imageData;
	},
	query: (format: GraphQLQueryFormatType, imageSize: string) => {
		// Shared query function for fetching image data
		const query = `
			altText
			sourceUrl(size: ${imageSize})
		`;

		// Return different query depending on format
		switch (format) {
			case 'node':
				return `node { ${query} }`;
			case 'nodes':
				return `nodes { ${query} }`;
			default:
				return query;
		}
	},
};

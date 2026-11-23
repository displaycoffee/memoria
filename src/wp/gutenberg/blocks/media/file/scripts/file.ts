/* Selectors for WordPress file blocks with a PDF preview, e.g. <div class="wp-block-file" data-wp-interactive="core/file"><object class="wp-block-file__embed" data="file.pdf" type="application/pdf" hidden /><a href="file.pdf">File</a></div>
   Note: WordPress hides the preview (file.php) until its Interactivity API script (file/view.js) checks the browser can show PDFs inline, which never reaches Astro, so this replaces it using the same markup */
const selectors = {
	embed: '.wp-block-file__embed',
};

export const file = {
	update: () => {
		// Show each PDF preview when the browser can show PDFs inline, leaving it hidden otherwise (e.g. on phones and tablets), where the download button still works
		// Note: pdfViewerEnabled covers WordPress's mobile and iPad user agent checks, since it's false on those devices
		// Note: call on every page load, since each navigation swaps in new entry content
		if (!navigator.pdfViewerEnabled) return;
		document.querySelectorAll(`${selectors.embed}[hidden]`).forEach((embed) => embed.removeAttribute('hidden'));
	},
};

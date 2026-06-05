jQuery(($) => {
	// WordPress Media Picker functionality
	const prefix = '#site_icon';
	const selectors = {
		select: `${prefix}_select`,
		input: `${prefix}_input`,
		preview: `${prefix}_preview`,
		remove: `${prefix}_remove`,
	};
	let frame: WPMediaFrameType | undefined;

	$(selectors.select).on('click', function (e) {
		e.preventDefault();
		if (frame) {
			frame.open();
			return;
		}

		const f = (frame = wp.media({ title: 'Select Site Icon', button: { text: 'Use as Site Icon' }, multiple: false }));
		f.on('select', function () {
			const a = f.state().get('selection').first().toJSON();
			$(selectors.input).val(a.id);
			$(selectors.preview).html(`<img src="${a.url}" style="max-width: 64px; display: block; margin-bottom: 8px;" />`);
			$(selectors.remove).show();
		});

		f.open();
	});

	$(selectors.remove).on('click', function () {
		$(selectors.input).val('');
		$(selectors.preview).html('');
		$(this).hide();
	});
});

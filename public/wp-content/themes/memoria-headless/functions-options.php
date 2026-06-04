<?php
/**
* Theme Options page, settings, and GraphQL exposure
*
* @package memoria
* @since 1.0.0
*/

// Add Theme Options page under Appearance in WP admin
add_action('admin_menu', function () {
	add_theme_page(
		'Theme Options', // Page title
		'Theme Options', // Submenu label
		'manage_options',
		'memoria-theme-options',
		'memoria_theme_options_page'
	);
});

// Register settings and fields
add_action('admin_init', function () {
	register_setting('memoria_theme_options', 'memoria_theme_options', [
		'sanitize_callback' => 'memoria_sanitize_options',
	]);

	// Social links section
	add_settings_section(
		'memoria_social',
		'Social Links',
		null,
		'memoria-theme-options'
	);

	$social_fields = [
		'social_facebook'  => 'Facebook URL',
		'social_instagram' => 'Instagram URL',
		'social_twitter'   => 'Twitter / X URL',
		'social_github'    => 'GitHub URL',
	];

	foreach ($social_fields as $key => $label) {
		add_settings_field(
			$key,
			$label,
			'memoria_render_text_field',
			'memoria-theme-options',
			'memoria_social',
			['key' => $key]
		);
	}

	// Footer section
	add_settings_section(
		'memoria_footer',
		'Footer',
		null,
		'memoria-theme-options'
	);

	add_settings_field(
		'footer_copyright',
		'Copyright Text',
		'memoria_render_text_field',
		'memoria-theme-options',
		'memoria_footer',
		['key' => 'footer_copyright']
	);

	add_settings_field(
		'footer_information',
		'Footer Information',
		'memoria_render_textarea_field',
		'memoria-theme-options',
		'memoria_footer',
		['key' => 'footer_information']
	);
});

// Render a plain text input for a settings field
function memoria_render_text_field(array $args): void {
	$options = get_option('memoria_theme_options', []);
	$key     = $args['key'];
	$value   = $options[$key] ?? '';
	printf(
		'<input type="text" name="memoria_theme_options[%s]" value="%s" class="regular-text" />',
		esc_attr($key),
		esc_attr($value)
	);
}

// Render a textarea for a settings field
function memoria_render_textarea_field(array $args): void {
	$options = get_option('memoria_theme_options', []);
	$key     = $args['key'];
	$value   = $options[$key] ?? '';
	printf(
		'<textarea name="memoria_theme_options[%s]" rows="5" class="large-text">%s</textarea>',
		esc_attr($key),
		esc_textarea($value)
	);
}

// Sanitize all option values before saving
function memoria_sanitize_options(array $input): array {
	$clean = [];
	foreach ($input as $key => $value) {
		$clean[$key] = sanitize_text_field($value);
	}
	return $clean;
}

// Render the Theme Options admin page
function memoria_theme_options_page(): void {
	if (!current_user_can('manage_options')) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html(get_admin_page_title()); ?></h1>
		<form method="post" action="options.php">
			<?php
				settings_fields('memoria_theme_options');
				do_settings_sections('memoria-theme-options');
				submit_button();
			?>
		</form>
	</div>
	<?php
}

// Expose theme options to WPGraphQL
add_action('graphql_register_types', function () {
	register_graphql_object_type('ThemeOptions', [
		'description' => 'Memoria theme options',
		'fields'      => [
			'socialFacebook'    => ['type' => 'String'],
			'socialInstagram'   => ['type' => 'String'],
			'socialTwitter'     => ['type' => 'String'],
			'socialGithub'      => ['type' => 'String'],
			'footerCopyright'   => ['type' => 'String'],
			'footerInformation' => ['type' => 'String'],
		],
	]);

	register_graphql_field('RootQuery', 'themeOptions', [
		'type'        => 'ThemeOptions',
		'description' => 'Memoria theme options',
		'resolve'     => function () {
			$options = get_option('memoria_theme_options', []);
			return [
				'socialFacebook'    => $options['social_facebook']    ?? '',
				'socialInstagram'   => $options['social_instagram']   ?? '',
				'socialTwitter'     => $options['social_twitter']     ?? '',
				'socialGithub'      => $options['social_github']      ?? '',
				'footerCopyright'   => $options['footer_copyright']   ?? '',
				'footerInformation' => $options['footer_information'] ?? '',
			];
		},
	]);
});

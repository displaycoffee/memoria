<?php
/**
* Theme Options page, settings, and GraphQL exposure
*
* @package memoria
* @since 1.0.0
*/

// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) { exit; }

// Get helpers
require_once( 'functions-helpers.php' );

// Enqueue media library scripts on the Theme Options page
add_action('admin_enqueue_scripts', function (string $hook): void {
	if ($hook !== 'appearance_page_memoria-theme-options') {
		return;
	}

	wp_enqueue_media();
	wp_register_script('memoria-admin', false, ['jquery', 'media-editor'], null, ['in_footer' => true]);
	wp_enqueue_script('memoria-admin');
	wp_add_inline_script('memoria-admin', "
		jQuery(function($) {
			var frame;
			$('#site_icon_select').on('click', function(e) {
				e.preventDefault();
				if (frame) { frame.open(); return; }
				frame = wp.media({ title: 'Select Site Icon', button: { text: 'Use as Site Icon' }, multiple: false });
				frame.on('select', function() {
					var a = frame.state().get('selection').first().toJSON();
					$('#site_icon_input').val(a.id);
					$('#site_icon_preview').html('<img src=\"' + a.url + '\" style=\"max-width:64px;display:block;margin-bottom:8px;\" />');
					$('#site_icon_remove').show();
				});
				frame.open();
			});
			$('#site_icon_remove').on('click', function() {
				$('#site_icon_input').val('');
				$('#site_icon_preview').html('');
				$(this).hide();
			});
		});
	");
});

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
	// Site identity — registered individually, write directly to core WP options
	register_setting('memoria_theme_options', 'blogname',        ['sanitize_callback' => 'sanitize_text_field']);
	register_setting('memoria_theme_options', 'blogdescription', ['sanitize_callback' => 'sanitize_text_field']);
	register_setting('memoria_theme_options', 'site_icon',       ['sanitize_callback' => 'absint']);

	// Add settings section for site identity
	add_settings_section('memoria_site_identity', 'Site Identity', null, 'memoria-theme-options');

	// Add settings fields for site identity
	add_settings_field('blogname',        'Site Title', 'memoria_render_core_text_field', 'memoria-theme-options', 'memoria_site_identity', ['key' => 'blogname']);
	add_settings_field('blogdescription', 'Tagline',    'memoria_render_core_text_field', 'memoria-theme-options', 'memoria_site_identity', ['key' => 'blogdescription']);
	add_settings_field('site_icon',       'Site Icon',  'memoria_render_site_icon_field', 'memoria-theme-options', 'memoria_site_identity');

	// Theme options — stored as a single serialized array under memoria_theme_options
	register_setting('memoria_theme_options', 'memoria_theme_options', [
		'sanitize_callback' => 'memoria_sanitize_options',
	]);

	// Social links section
	add_settings_section('memoria_social', 'Social Links', null, 'memoria-theme-options');

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
	add_settings_section('memoria_footer', 'Footer', null, 'memoria-theme-options');

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

// Render a text input that reads/writes a core WP option directly
function memoria_render_core_text_field(array $args): void {
	$key   = $args['key'];
	$value = get_option($key, '');
	printf(
		'<input type="text" name="%s" value="%s" class="regular-text" />',
		esc_attr($key),
		esc_attr($value)
	);
}

// Render the site icon media upload field
function memoria_render_site_icon_field(): void {
	$attachment_id = (int) get_option('site_icon', 0);
	$image_url     = $attachment_id ? wp_get_attachment_image_url($attachment_id, 'thumbnail') : '';
	?>
	<div>
		<input type="hidden" name="site_icon" value="<?php echo esc_attr($attachment_id ?: ''); ?>" id="site_icon_input" />
		<div id="site_icon_preview">
			<?php if ($image_url) : ?>
				<img src="<?php echo esc_url($image_url); ?>" style="max-width:64px;display:block;margin-bottom:8px;" />
			<?php endif; ?>
		</div>
		<button type="button" class="button" id="site_icon_select">Select Image</button>
		<button type="button" class="button" id="site_icon_remove" <?php echo $attachment_id ? '' : 'style="display:none"'; ?>>Remove</button>
	</div>
	<?php
}

// Render a plain text input for a memoria_theme_options field
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

// Render a textarea for a memoria_theme_options field
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

// Sanitize all memoria_theme_options values before saving
function memoria_sanitize_options(array $input): array {
	$clean = [];
	foreach ($input as $key => $value) {
		$clean[$key] = sanitize_text_field($value);
	}
	return $clean;
}

// Render the Theme Options admin page
function memoria_theme_options_page(): void {
		$is_dev = memoria_check_dev();
		if (!current_user_can('manage_options')) {
			return;
		}
	?>
		<div class="wrap">
			<?php if ( $is_dev ) : ?>
				Yes dev.
			<?php else : ?>
				Not dev.
			<?php endif; ?>

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

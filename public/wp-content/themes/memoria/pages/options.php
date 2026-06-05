<?php
/**
* Theme Options page, settings, and GraphQL exposure
*
* @package memoria
* @since 1.0.0
*/

// Exit if accessed directly
if (!defined('ABSPATH')) { exit; }

// Get helpers
require_once get_template_directory() . '/includes/helpers.php';
require_once get_template_directory() . '/includes/sanitize.php';

// Variables
define('MEMORIA_SLUG', 'memoria-theme-options');
define('MEMORIA_OPTIONS', 'memoria_theme_options');

// Define fields
$fields = (object) [
	'site_identity' => (object) [
		'blogname' => (object) [
			'label' => 'Site Title',
			'field' => 'memoria_render_core_text_field',
			'sanitize_callback' => 'sanitize_text_field'
		],
		'blogdescription' => (object) [
			'label' => 'Tagline',
			'field' => 'memoria_render_core_text_field',
			'sanitize_callback' => 'sanitize_text_field'
		],
		'site_icon' => (object) [
			'label' => 'Site Icon',
			'field' => 'memoria_render_site_icon_field',
			'sanitize_callback' => 'absint'
		],
	],
	'social' => (object) [
		'social_facebook' => (object) [
			'label' => 'Facebook URL',
			'field' => 'memoria_render_text_field',
			'graphQL' => 'socialFacebook'
		],
		'social_instagram' => (object) [
			'label' => 'Instagram URL',
			'field' => 'memoria_render_text_field',
			'graphQL' => 'socialInstagram'
		],
		'social_twitter' => (object) [
			'label' => 'Twitter / X URL',
			'field' => 'memoria_render_text_field',
			'graphQL' => 'socialTwitter'
		],
		'social_github' => (object) [
			'label' => 'GitHub URL',
			'field' => 'memoria_render_text_field',
			'graphQL' => 'socialGithub'
		],
	],
	'footer' => (object) [
		'footer_copyright' => (object) [
			'label' => 'Copyright Text',
			'field' => 'memoria_render_text_field',
			'graphQL' => 'footerCopyright'
		],
		'footer_information' => (object) [
			'label' => 'Footer Information',
			'field' => 'memoria_render_textarea_field',
			'graphQL' => 'footerInformation'
		],
	]
];

// Enqueue media library scripts on options page
add_action('admin_enqueue_scripts', function(string $hook): void {
	$config = memoria_config();
	$is_dev = memoria_is_dev();
	$version = wp_get_theme()->get('Version');

	if ($hook !== 'appearance_page_' . MEMORIA_SLUG) {
		return;
	}

	// Enqueue scripts and styles
	wp_enqueue_media();
	if ($is_dev) {
		// Dev: load from Vite server
		wp_enqueue_script('vite-index', $config->dev->index, null, null, ['in_footer' => true]);
	} else {
		// Production: use bundled scripts
		wp_enqueue_script('memoria-admin-scripts', $config->paths->js . '/bundle.js', null, $version, ['in_footer' => true]);
		wp_enqueue_style('memoria-admin-styles', $config->paths->css . '/styles.css', null, $version);
	}
});

// Add attribute to vite script 
function memoria_add_attribute_to_script_tag($tag, $handle, $src) {
	$script_array = ['vite', 'memoria-bundle1', 'vite-index'];

	if (in_array($handle, $script_array)) {
		return '<script type="module" src="' . esc_url($src) . '"></script>';
	}

    return $tag;
}
add_filter('script_loader_tag', 'memoria_add_attribute_to_script_tag', 10, 3);

// Add Theme Options page under Appearance in WP admin
add_action('admin_menu', function() {
	add_theme_page(
		'Theme Options', // Page title
		'Options', // Submenu label
		'manage_options',
		MEMORIA_SLUG,
		MEMORIA_OPTIONS . '_page'
	);
});

// Register settings and fields
add_action('admin_init', function() use($fields) {
	// START -- SITE IDENTITY SECTION

	// Name
	$site_identity_section = 'memoria_site_identity';

	// Fields
	$site_identity_fields = $fields->site_identity;

	// Register core fields
	memoria_register_fields($site_identity_fields, $site_identity_section);

	// Add section
	add_settings_section($site_identity_section, 'Site Identity', null, MEMORIA_SLUG);

	// Render fields
	memoria_add_fields($site_identity_fields, $site_identity_section);

	// END -- SITE IDENTITY SECTION

	// START -- SOCIAL SECTION

	// Name
	$social_section = 'memoria_social';

	// Fields
	$social_fields = $fields->social;

	// Add section
	add_settings_section($social_section, 'Social Links', null, MEMORIA_SLUG);

	// Render fields
	memoria_add_fields($social_fields, $social_section);

	// END -- SOCIAL SECTION

	// START -- FOOTER SECTION

	// Name
	$footer_section = 'memoria_footer';

	// Fields
	$footer_fields = $fields->footer;

	// Add section
	add_settings_section($footer_section, 'Footer', null, MEMORIA_SLUG);

	// Render fields
	memoria_add_fields($footer_fields, $footer_section);

	// END -- FOOTER SECTION

	// Theme options — stored as a single serialized array
	register_setting(MEMORIA_OPTIONS, MEMORIA_OPTIONS, ['sanitize_callback' => 'memoria_sanitize_options']);
});

// Expose theme options to WPGraphQL
add_action('graphql_register_types', function() use($fields)  {
	$type = 'ThemeOptions';
	$description = 'Memoria theme options';

	// Set up types for GraphQL
	$types = [];
	memoria_add_types($fields->social, $types);
	memoria_add_types($fields->footer, $types);

	// Register GraphQL object
	register_graphql_object_type($type, ['description' => $description, 'fields' => $types]);

	// Register GraphQL fields
	register_graphql_field('RootQuery', 'themeOptions', [
		'type' => $type,
		'description' => $description,
		'resolve' => function() use ($fields) {
			$options = get_option(MEMORIA_OPTIONS, []);
			$values = [];

			// Add values to fields
			foreach ($fields->social as $key => $label) {
				$values[$label->graphQL] = $options[$key] ?? '';
			}
			foreach ($fields->footer as $key => $label) {
				$values[$label->graphQL] = $options[$key] ?? '';
			}

			return $values;
		},
	]);
});

// Loop through fields and add settings
function memoria_add_fields($fields, $section) {
	foreach ($fields as $key => $label) {
		add_settings_field($key, $label->label, $label->field, MEMORIA_SLUG, $section, ['key' => $key]);
	}
}

// Build GraphQL type map from a fields object
function memoria_add_types($fields, &$types) {
	foreach ($fields as $key => $label) {
		$types[$label->graphQL] = ['type' => 'String'];
	}
}

// Loop through fields and register settings
function memoria_register_fields($fields, $section) {
	foreach ($fields as $key => $label) {
		register_setting(MEMORIA_OPTIONS, $key, ['sanitize_callback' => $label->sanitize_callback]);
	}
}

// Render a text input that reads/writes a core WP option directly
function memoria_render_core_text_field(array $args): void {
	$key   = $args['key'];
	$value = get_option($key, '');
	printf('<input type="text" name="%s" value="%s" class="regular-text" />', esc_attr($key), esc_attr($value));
}

// Render the site icon media upload field
function memoria_render_site_icon_field(): void {
		$attachment_id = (int) get_option('site_icon', 0);
		$image_url= $attachment_id ? wp_get_attachment_image_url($attachment_id, 'thumbnail') : '';
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

// Render a plain text input
function memoria_render_text_field(array $args): void {
	$options = get_option(MEMORIA_OPTIONS, []);
	$key     = $args['key'];
	$value   = $options[$key] ?? '';
	printf('<input type="text" name="' . MEMORIA_OPTIONS .'[%s]" value="%s" class="regular-text" />', esc_attr($key), esc_attr($value));
}

// Render a textarea
function memoria_render_textarea_field(array $args): void {
	$options = get_option(MEMORIA_OPTIONS, []);
	$key     = $args['key'];
	$value   = $options[$key] ?? '';
	printf('<textarea name="' . MEMORIA_OPTIONS .'[%s]" rows="5" class="large-text">%s</textarea>', esc_attr($key), esc_textarea($value));
}

// Render the Theme Options admin page
function memoria_theme_options_page(): void {
		$config = memoria_config();
		$is_dev = memoria_is_dev();

		if (!current_user_can('manage_options')) {
			return;
		}
	?>
		<div class="wrap">
			<h1><?php echo esc_html(get_admin_page_title()); ?></h1>

			<form method="post" action="options.php">
				<?php
					settings_fields(MEMORIA_OPTIONS);
					do_settings_sections(MEMORIA_SLUG);
					submit_button();
				?>
			</form>
		</div>
	<?php
}

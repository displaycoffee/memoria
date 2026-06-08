<?php
/**
* Theme Options page, settings, and GraphQL exposure
*
* @package memoria
* @since 1.0.0
*/

// Exit if accessed directly
if (!defined('ABSPATH')) { exit; }

// Include theme files
require_once get_template_directory() . '/includes/helpers.php';
require_once get_template_directory() . '/includes/fields.php';
require_once get_template_directory() . '/includes/render.php';
require_once get_template_directory() . '/includes/sanitize.php';
require_once get_template_directory() . '/includes/shortcodes.php';

// Variables
define('MEMORIA_SLUG', 'memoria-theme-options');
define('MEMORIA_OPTIONS', 'memoria_theme_options');

// Define fields
$sections = require get_template_directory() . '/pages/options-sections.php';
$sections_site = $sections->site;
$sections_custom = $sections->custom;

// Add Theme Options page under Appearance in WP admin
function memoria_add_theme_options(): void {
	add_theme_page(
		'Theme Options', // Page title
		'Options', // Submenu label
		'manage_options',
		MEMORIA_SLUG,
		MEMORIA_OPTIONS . '_page'
	);
}
add_action('admin_menu', 'memoria_add_theme_options');

// Register and render Site Identity fields — each stored as its own WP core option
function memoria_build_site_identity_options(object $sections_site): void {
	foreach ($sections_site as $section) {
		$section_handle = $section->handle;
		$section_label = $section->label;
		$section_fields = $section->fields;

		// Register core fields
		foreach ($section_fields as $key => $label) {
			register_setting(MEMORIA_OPTIONS, $key, ['sanitize_callback' => $label->sanitize_callback]);
		}

		// Add section
		add_settings_section($section_handle, $section_label, null, MEMORIA_SLUG);

		// Render fields
		memoria_add_fields($section_fields, $section_handle);
	}
}
add_action('admin_init', function() use ($sections_site) { memoria_build_site_identity_options($sections_site); });

// Register and render Social/Footer fields — stored together as one serialized option
function memoria_build_theme_options(object $sections_custom): void {
	foreach ($sections_custom as $section) {
		$section_handle = $section->handle;
		$section_label = $section->label;
		$section_fields = $section->fields;

		// Add section
		add_settings_section($section_handle, $section_label, null, MEMORIA_SLUG);

		// Render fields
		memoria_add_fields($section_fields, $section_handle);

		// Theme options — stored as a single serialized array
		register_setting(MEMORIA_OPTIONS, MEMORIA_OPTIONS, [
			'sanitize_callback' => function(array $input) use ($section_fields): array {
				return memoria_sanitize_options($input, $section_fields);
			}
		]);
	}
}
add_action('admin_init', function() use ($sections_custom) { memoria_build_theme_options($sections_custom); });

// Expose theme options to WPGraphQL
function memoria_register_graphql_options(object $sections_custom): void {
	$type = 'ThemeOptions';
	$description = 'Memoria theme options';

	// Set up types for GraphQL — site_identity lives in $sections_site and is stored/exposed
	// differently, so $sections_custom already holds exactly what GraphQL should expose
	$types = [];
	foreach ($sections_custom as $section) {
		memoria_add_types($section->fields, $types);
	}

	// Register GraphQL object
	register_graphql_object_type($type, ['description' => $description, 'fields' => $types]);

	// Register GraphQL fields
	register_graphql_field('RootQuery', 'themeOptions', [
		'type' => $type,
		'description' => $description,
		'resolve' => function($source, $args, $context) use ($sections_custom) {
			$options = get_option(MEMORIA_OPTIONS, []);
			$values = [];

			foreach ($sections_custom as $section) {
				foreach ($section->fields as $key => $label) {
					$value = $options[$key] ?? '';

					// Image fields store an attachment ID — defer to the post loader so
					// WPGraphQL can resolve the MediaItem's sourceUrl, altText, etc.
					if (!empty($label->is_image)) {
						$values[$label->graphQL] = $value ? $context->get_loader('post')->load_deferred((int) $value) : null;
						continue;
					}

					// Run shortcode-enabled fields through the parser so the API returns rendered
					// HTML, matching how WPGraphQL exposes rendered post content
					if (!empty($label->parse_shortcodes) && $value !== '') {
						$value = do_shortcode(esc_html($value));
					}

					$values[$label->graphQL] = $value;
				}
			}

			return $values;
		},
	]);
}
add_action('graphql_register_types', function() use ($sections_custom) { memoria_register_graphql_options($sections_custom); });

// Render the Theme Options admin page
function memoria_theme_options_page(): void {
	$config = memoria_config();
	$is_dev = memoria_is_dev();

	if (!current_user_can('manage_options')) {
		return;
	}
?>
	<div class="memoria-theme-options">
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
	</div>
<?php
}

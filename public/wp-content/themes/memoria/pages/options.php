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
require_once get_template_directory() . '/includes/shortcodes.php';

// Variables
define('MEMORIA_SLUG', 'memoria-theme-options');
define('MEMORIA_OPTIONS', 'memoria_theme_options');

// Define fields
$sections = require get_template_directory() . '/pages/options-sections.php';
$sections_site = $sections->site;
$sections_custom = $sections->custom;

// Enqueue media library scripts on options page
function memoria_enqueue_options_scripts(string $hook): void {
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
}
add_filter('admin_enqueue_scripts', 'memoria_enqueue_options_scripts', 10, 3);

// Add attribute to vite script 
function memoria_add_script_attribute(string $tag, string $handle, string $src): string {
	$script_array = ['vite', 'memoria-bundle1', 'vite-index'];

	if (in_array($handle, $script_array)) {
		return '<script type="module" src="' . esc_url($src) . '"></script>';
	}

    return $tag;
}
add_filter('script_loader_tag', 'memoria_add_script_attribute', 10, 3);

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
		'resolve' => function() use ($sections_custom) {
			$options = get_option(MEMORIA_OPTIONS, []);
			$values = [];

			foreach ($sections_custom as $section) {
				foreach ($section->fields as $key => $label) {
					$value = $options[$key] ?? '';

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

// Functions to build the above actions and filters

// Loop through fields and add settings
function memoria_add_fields(object $fields, string $section): void {
	foreach ($fields as $key => $label) {
		add_settings_field($key, $label->label, $label->render, MEMORIA_SLUG, $section, [
			'key' => $key,
			'type' => $label->type ?? 'text',
			'description' => $label->description ?? '',
			'default' => $label->default ?? '',
			'maxlength' => $label->maxlength ?? null,
			'is_icon' => $label->is_icon ?? false
		]);
	}
}

// Build GraphQL type map from a fields object
function memoria_add_types(object $fields, array &$types): void {
	foreach ($fields as $key => $label) {
		$types[$label->graphQL] = ['type' => 'String'];
	}
}

// Render a text input that reads/writes a core WP option directly
function memoria_render_core_text_field(array $args): void {
	$key = $args['key'];
	$description = $args['description'] ?? '';
	$value = get_option($key, '');
	printf('<input class="regular-text" type="text" name="%s" value="%s" />', esc_attr($key), esc_attr($value));
	echo($description ? '<p class="description">' . $description . '</p>' : '');
}

// Render the media picker field
function memoria_render_media_picker_field(array $args): void {
		$key = $args['key'];
		$description = $args['description'] ?? '';
		$is_icon = $args['is_icon'];
		$blog_name = (string) get_option('blogname');

		// Icon pickers post directly to their own core option; everything else needs
		// to be nested under memoria_theme_options[...] so it lands in the serialized array
		$name = $is_icon ? $key : MEMORIA_OPTIONS . '[' . $key . ']';

		// Setup image details — icon pickers are stored as their own core option,
		// everything else lives inside the serialized memoria_theme_options array
		$image_id = $is_icon
			? (int) get_option($key, 0)
			: (int) (get_option(MEMORIA_OPTIONS, [])[$key] ?? 0);
		$image_url= $image_id ? wp_get_attachment_image_url($image_id, 'thumbnail') : '';
		$image_file_path = $image_id ? get_attached_file($image_id) : '';
		$image_file_name = $image_id ? wp_basename($image_file_path) : '';
		$image_alt_text = $image_id ? get_post_meta($image_id, '_wp_attachment_image_alt', true) : '';

		// Create alt text
		$alt_text = '';
		if ($image_id) {
			$context = $is_icon ? 'icon' : 'image';
			$preview_text = $image_alt_text ? $context . ' preview: Current image: ' . $image_alt_text . '.' : $context . ' preview: The current image has no alternative text.';
			$file_text = 'The file name is: ' . $image_file_name . '.';
			$alt_text = $preview_text . ' ' . $file_text;
		}

		// Button labels differ between icon and generic image pickers
		$labels = $is_icon
			? ['choose' => 'Choose a Site Icon', 'change' => 'Change Site Icon', 'remove' => 'Remove Site Icon']
			: ['choose' => 'Choose an Image', 'change' => 'Change Image', 'remove' => 'Remove Image'];
	?>
		<div class="media-picker">
			<?php if ($is_icon) : ?>
				<div class="media-picker-preview site-icon-preview <?php echo $image_id ? 'has-media' : 'hidden'; ?>">
					<style>
						:root {
							--site-icon-url: url( '<?php echo esc_url($image_url); ?>' );
						}
					</style>
					<div class="media-picker-wrap direction-wrap">
						<?php if ($image_url) : ?>
							<img class="app-media-picker-preview app-icon-preview" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr('App ' . $alt_text); ?>" />
						<?php else: ?>
							<img class="app-media-picker-preview app-icon-preview" src alt />
						<?php endif; ?>

						<div class="media-picker-preview-browser site-icon-preview-browser">
							<svg role="img" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg" class="browser-buttons">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M0 20a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm18 0a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm24-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"></path>
							</svg>

							<div class="media-picker-preview-tab site-icon-preview-tab">
								<?php if ($image_url) : ?>
									<img class="browser-media-picker-preview browser-icon-preview" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr('Browser ' . $alt_text); ?>">
								<?php else: ?>
									<img class="browser-media-picker-preview browser-icon-preview" src alt />
								<?php endif; ?>
								<div class="media-picker-preview-site-title site-icon-preview-site-title" aria-hidden="true">
									<?php echo esc_html($blog_name); ?>
								</div>
								<svg role="img" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg" class="close-button">
									<path d="M12 13.0607L15.7123 16.773L16.773 15.7123L13.0607 12L16.773 8.28772L15.7123 7.22706L12 10.9394L8.28771 7.22705L7.22705 8.28771L10.9394 12L7.22706 15.7123L8.28772 16.773L12 13.0607Z"></path>
								</svg>
							</div>
						</div>
					</div>
				</div>
			<?php else: ?>
				<div class="media-picker-preview <?php echo $image_id ? 'has-media' : 'hidden'; ?>">
					<div class="media-picker-wrap direction-wrap">
						<?php if ($image_url) : ?>
							<img class="app-media-picker-preview" src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr('App ' . $alt_text); ?>" />
						<?php else: ?>
							<img class="app-media-picker-preview" src alt />
						<?php endif; ?>
					</div>
				</div>
			<?php endif; ?>

			<input type="hidden" class="media-picker-input" name="<?php echo esc_attr($name); ?>" value="<?php echo esc_attr($image_id ?: ''); ?>" />

			<div class="media-picker-action-buttons">
				<button type="button" class="media-picker-select button">
					<?php echo $image_id ? $labels['change'] : $labels['choose']; ?>
				</button>
				<button type="button" class="media-picker-remove button button-secondary reset<?php echo $image_id ? '' : ' hidden'; ?>">
					<?php echo $labels['remove']; ?>
				</button>
			</div>
		</div>

		<?php echo($description ? '<p class="description">' . $description . '</p>' : ''); ?>
	<?php
}

// Render a text input
function memoria_render_text_field(array $args): void {
	$options = get_option(MEMORIA_OPTIONS, []);
	$key = $args['key'];
	$type = $args['type'];
	$description = $args['description'] ?? '';
	$value = $options[$key] ?? $args['default'];
	printf('<input class="regular-text" type="%s" name="' . MEMORIA_OPTIONS .'[%s]" value="%s" />', esc_attr($type), esc_attr($key), esc_attr($value));
	echo($description ? '<p class="description">' . $description . '</p>' : '');
}

// Render a textarea
function memoria_render_textarea_field(array $args): void {
	$options = get_option(MEMORIA_OPTIONS, []);
	$key = $args['key'];
	$description = $args['description'] ?? '';
	$value = $options[$key] ?? $args['default'];
	$maxlength = $args['maxlength'] ?? null;
	$maxlength_attr = $maxlength ? sprintf(' maxlength="%d"', $maxlength) : '';
	printf('<textarea name="' . MEMORIA_OPTIONS .'[%s]" rows="5"%s>%s</textarea>', esc_attr($key), $maxlength_attr, esc_textarea($value));
	echo($description ? '<p class="description">' . $description . '</p>' : '');
}

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

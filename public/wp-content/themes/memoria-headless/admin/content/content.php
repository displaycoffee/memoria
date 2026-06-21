<?php
/**
* Post and page meta and GraphQL field registration
*
* @package memoria
* @since 1.0.0
*/

// Add meta box to the post edit screen
function memoria_add_post_meta_boxes(): void {
	add_meta_box(
		'memoria_post_options',
		'Options',
		'memoria_render_post_options_meta_box',
		['post', 'page'],
		'side',
		'default'
	);
}
add_action('add_meta_boxes', 'memoria_add_post_meta_boxes');

// Render the meta box
function memoria_render_post_options_meta_box(WP_Post $post): void {
	$hide_sidebar = (bool) get_post_meta($post->ID, 'memoria_headless_hide_sidebar', true);
	wp_nonce_field('memoria_post_options_nonce', 'memoria_post_options_nonce');
	?>
	<label>
		<input type="checkbox" name="memoria_headless_hide_sidebar" value="1" <?php checked($hide_sidebar, true); ?> />
		<?php esc_html_e('Hide sidebar'); ?>
	</label>
	<?php
}

// Save meta box data
function memoria_save_post_meta(int $post_id): void {
	if (!isset($_POST['memoria_post_options_nonce']) || !wp_verify_nonce($_POST['memoria_post_options_nonce'], 'memoria_post_options_nonce')) {
		return;
	}
	if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
		return;
	}
	if (!current_user_can('edit_post', $post_id)) {
		return;
	}
	update_post_meta($post_id, 'memoria_headless_hide_sidebar', isset($_POST['memoria_headless_hide_sidebar']));
}
add_action('save_post', 'memoria_save_post_meta');

// Register post meta fields
function memoria_register_post_meta(): void {
	foreach (['post', 'page'] as $post_type) {
		register_post_meta($post_type, 'memoria_headless_hide_sidebar', [
			'type'          => 'boolean',
			'single'        => true,
			'default'       => false,
			'show_in_rest'  => false,
			'auth_callback' => '__return_true',
		]);
	}
}
add_action('init', 'memoria_register_post_meta');

// Expose post meta to WPGraphQL
function memoria_register_graphql_fields(): void {
	$args = [
		'type'        => 'Boolean',
		'description' => 'Whether to hide the sidebar',
		'resolve'     => function ($post) {
			return (bool) get_post_meta($post->databaseId, 'memoria_headless_hide_sidebar', true);
		},
	];
	register_graphql_field('Post', 'hideSidebar', $args);
	register_graphql_field('Page', 'hideSidebar', $args);
}
add_action('graphql_register_types', 'memoria_register_graphql_fields');

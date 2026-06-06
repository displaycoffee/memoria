<?php
/**
* Memoria theme functions and definitions
* Note: This theme is not used on the frontend. It is only for connecting to the headless frontend.
*
* @link https://developer.wordpress.org/themes/basics/theme-functions/
*
* @package memoria
* @since 1.0.0
*/

// Include theme files
require_once get_template_directory() . '/pages/options.php';

// Theme support declarations
function memoria_theme_setup(): void {
	add_theme_support('menus');
	add_theme_support('post-thumbnails');
	add_theme_support('post-formats', ['aside', 'audio', 'gallery', 'image', 'link', 'quote', 'video']);
	add_theme_support('align-wide');
	add_theme_support('html5', ['gallery', 'caption']);
}
add_action('after_setup_theme', 'memoria_theme_setup');

// Register nav menus so they appear in WP admin and are queryable
function memoria_init_menus(): void {
	register_nav_menus([
		'primary' => __('Primary Navigation'),
		'footer'  => __('Footer Navigation'),
	]);
}
add_action('init', 'memoria_init_menus');

// Allow Astro dev server to call the API without CORS errors
function memoria_init_dev_api(): void {
	remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

	add_filter('rest_pre_serve_request', function ($value) {
		$allowed = ['http://localhost:4321'];
		$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

		if (in_array($origin, $allowed, true)) {
			header('Access-Control-Allow-Origin: ' . $origin);
			header('Access-Control-Allow-Methods: GET, OPTIONS');
			header('Access-Control-Allow-Credentials: true');
		}

		return $value;
	});
}
add_action('rest_api_init', 'memoria_init_dev_api');

// Remove unused Appearance submenu items (priority 999 ensures WP has registered them first)
function memoria_admin_menu_removal(): void {
	global $submenu;

	// Customizer slug includes a dynamic ?return=... param so remove_submenu_page can't match it — scan directly
	if (isset($submenu['themes.php'])) {
		foreach ($submenu['themes.php'] as $key => $item) {
			if (isset($item[2]) && strpos($item[2], 'customize.php') !== false) {
				unset($submenu['themes.php'][$key]);
			}
		}
	}

	remove_submenu_page('themes.php', 'theme-editor.php'); // Theme File Editor
	remove_submenu_page('themes.php', 'site-editor.php?p=/pattern'); // Patterns
	remove_submenu_page('themes.php', 'font-library.php'); // Fonts
}
add_action('admin_menu', 'memoria_admin_menu_removal', 999);
<?php
/**
* Memoria theme functions and definitions
* Note: This theme is not use on the frontend. It is only for connecting to the headless frontend.
* 
* @link https://developer.wordpress.org/themes/basics/theme-functions/
*
* @package memoria
* @since 1.0.0
*/

// Makes nav menus available via REST API (/wp-json/wp/v2/menus)
add_action('after_setup_theme', function () {
	add_theme_support('menus');
});

// Register nav menus so they appear in WP admin and are queryable
add_action('init', function () {
	register_nav_menus([
		'primary' => __('Primary Navigation'),
		'footer'  => __('Footer Navigation'),
	]);
});

// Allow Astro dev server to call the REST API without CORS errors
add_action('rest_api_init', function () {
	remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

	add_filter('rest_pre_serve_request', function ($value) {
		$allowed = [
			'http://localhost:4321', // Astro default dev port
		];

		$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

		if (in_array($origin, $allowed, true)) {
			header('Access-Control-Allow-Origin: ' . $origin);
			header('Access-Control-Allow-Methods: GET, OPTIONS');
			header('Access-Control-Allow-Credentials: true');
		}

		return $value;
	});
});

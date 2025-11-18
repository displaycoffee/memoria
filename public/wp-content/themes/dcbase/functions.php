<?php
/*
* Functions and definitions
*
* @link https://developer.wordpress.org/themes/basics/theme-functions/
*
* @package dcbase
* @since 1.0.0
*/

/* Add theme support */
function dcbase_setup() {
	// Load additional block styles
	$styled_blocks = ['quote'];
	foreach ($styled_blocks as $block_name) {
		$path = 'assets/css/blocks/' . $block_name . '.css';
		$args = array(
			'handle' => 'dcbase-' . $block_name,
			'src'    => get_theme_file_uri($path),
			'path'   => get_theme_file_path($path),
		);

		// Replace the "core" prefix i you are styling blocks from plugins.
		wp_enqueue_block_style('core/' . $block_name, $args);
	}
}
add_action('after_setup_theme', 'dcbase_setup');

/* Set whitelist for checking if on dev */
function getWhitelist() {
	$domain = $_SERVER['HTTP_HOST'];
	return str_contains($domain, 'ddev.site') ? true : false;
}

/* Enqueue scripts */
function dcbase_scripts() {
	if (getWhitelist()) {
		wp_enqueue_script('vite-index', 'https://localhost:5173/themes/dcbase/index.js', [], wp_get_theme()->get('Version'), );
	} else {
		wp_enqueue_script('dcbase-bundle', get_theme_file_uri('assets/js/bundle.js'));
	}
}
add_action('wp_enqueue_scripts', 'dcbase_scripts');

/* Add attribute to vite script */ 
function add_attribute_to_script_tag($tag, $handle, $src) {
	if (in_array($handle, ['vite', 'dcbase-bundle1', 'vite-index'])) {
		return '<script type="module" src="' . esc_url($src) . '"></script>';
	}
    return $tag;
}
add_filter('script_loader_tag', 'add_attribute_to_script_tag', 10, 3);

/* Enqueue styles */
function dcbase_styles() {
	if (getWhitelist()) {
		// Local styles will be served from index.js script
	} else {
		wp_enqueue_style('dcbase-styles', get_theme_file_uri('assets/css/styles.css'), [], wp_get_theme()->get('Version'));
	}
}
add_action('wp_enqueue_scripts', 'dcbase_styles');

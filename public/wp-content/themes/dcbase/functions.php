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

/* Set whitelist for checking if on localhost */
function getWhitelist() {
	return array('127.0.0.1', '::1', 'localhost');
}

/* Enqueue scripts */
function dcbase_scripts() {
	$whitelist = getWhitelist();
	if (in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
		wp_enqueue_script('vite', 'https://localhost:3000/@vite/client');
		//wp_enqueue_script('dcbase-bundle1', 'https://localhost:3000/dist/wp-content/themes/dcbase/assets/js/bundle.js', [], wp_get_theme()->get('Version'), );
		wp_enqueue_script('dcbase-bundle2', 'https://localhost:3000/src/themes/dcbase/index.js', [], wp_get_theme()->get('Version'), );
	} else {
		wp_enqueue_script('dcbase-bundle', get_theme_file_uri('assets/js/bundle.js'));
	}
}
add_action('wp_enqueue_scripts', 'dcbase_scripts');

// 
function add_attribute_to_script_tag($tag, $handle, $src) {
	if (in_array($handle, ['vite', 'dcbase-bundle1', 'dcbase-bundle2'])) {
        return '<script type="module" src="' . esc_url($src) . '"></script>';
    }

    return $tag;
 }
 add_filter('script_loader_tag', 'add_attribute_to_script_tag', 10, 3);

/* Enqueue styles */
function dcbase_styles() {
	$whitelist = getWhitelist();
	if (in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
		// Local styles will be served from index.js script
	} else {
		wp_enqueue_style('dcbase-styles', get_theme_file_uri('assets/css/styles.css'), [], wp_get_theme()->get('Version'));
	}

	// Always enque main style
//	wp_enqueue_style('dcbase-styles', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'dcbase_styles');

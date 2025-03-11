<?php
	/**
	* Template for adding function helpers
	*/

	// Exit if accessed directly
	if ( !defined( 'ABSPATH' ) ) { exit; }

	// Function for setting up variable object
	function dcbase_config() {
		// Variables for config object
		$prefix = 'dcbase';
		$theme = get_template_directory_uri();
		$theme_assets = $theme . '/assets/dist';

		// Set up default config
		$config = (object) [
			'id'      => get_queried_object_id() ? get_queried_object_id() : false,
			'home'    => get_home_url( '/' ),
			'images'  => (object) [
				'sizes' => array( '180x180', '192x192', '32x32', '16x16' )
			],
			'lang'    => $prefix,
			'name'    => get_bloginfo( 'name' ),
			'paths'   => (object) [
				'css'    => $theme_assets . '/css',
				'images' => $theme_assets . '/images',
				'js'     => $theme_assets . '/js',
				'lang'   => $theme . '/languages'
			],
			'prefix'  => $prefix,
			'search'  => (object) [
				'label'   => 'Search for:',
				'results' => 'Search results for:',
				'text'    => 'Search'
			],
			'type'    => 'page'
		];

		// // Check what type of page it is and assign page type
		// if ( is_front_page() ) {
		// 	$config->type = 'home';
		// }
		// if ( is_home() ) {
		// 	$config->type = 'blog';
		// }
		// if ( is_archive() ) {
		// 	$config->type = 'archive';
		// }
		// if ( is_search() ) {
		// 	$config->type = 'search';
		// }
		// if ( is_attachment() ) {
		// 	$config->type = 'attachment';
		// }
		// if ( is_404() ) {
		// 	$config->type = 'error404';
		// }

		// // Add extra details using default config
		// $config->images->thumbnail = $config->paths->images . '/publisher-logo.png';
		// $config->images->thumbnail_width = '600';
		// $config->images->thumbnail_height = '60';
		// $config->paths->favicons = $config->paths->images . '/favicons';

		// // Update image thumbnail
		// if ( $config->id && get_the_post_thumbnail_url( $config->id ) ) {
		// 	$thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id(), 'thumbnail' );
		// 	$config->images->thumbnail = $thumbnail[0];
		// 	$config->images->thumbnail_width = $thumbnail[1];
		// 	$config->images->thumbnail_height = $thumbnail[2];
		// }

		return $config;
	}
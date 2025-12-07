<?php
/**
* memoria theme functions and definitions
*
* @link https://developer.wordpress.org/themes/basics/theme-functions/
*
* @package memoria
* @since 1.0.0
*/

// Include extra function files
require_once( 'functions/helpers.php' );

// Add theme support
function memoria_setup() {
	$config = memoria_config();

	// load_theme_textdomain( 'memoria', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	// add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'html5', array( 'search-form' ) );
	// add_theme_support( 'html5', array( 'search-form', 'comment-list', 'comment-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'responsive-embeds' );
	// add_theme_support( 'align-wide' );
	// add_theme_support( 'wp-block-styles' );
	// add_theme_support( 'editor-styles' );
	// add_theme_support( 'appearance-tools' );
	// add_theme_support( 'woocommerce' );
	// add_editor_style( 'editor-style.css' );

	// global $content_width;

	// if ( !isset( $content_width ) ) {
	// 	$content_width = 1920;
	// }

	// Register navigation menus
	register_nav_menus(
		array(
			'primary' => esc_html__( 'Primary menu', $config->settings->lang ),
			'footer'  => esc_html__( 'Footer menu', $config->settings->lang )
		)
	);
}
add_action( 'after_setup_theme', 'memoria_setup' );

// Add theme support
// function memoria_setup() {
// 	// Load additional block styles
// 	$styled_blocks = ['quote'];
// 	foreach ($styled_blocks as $block_name) {
// 		$path = 'assets/css/blocks/' . $block_name . '.css';
// 		$args = array(
// 			'handle' => 'memoria-' . $block_name,
// 			'src'    => get_theme_file_uri($path),
// 			'path'   => get_theme_file_path($path),
// 		);

// 		// Replace the "core" prefix i you are styling blocks from plugins.
// 		wp_enqueue_block_style('core/' . $block_name, $args);
// 	}
// }
// add_action('after_setup_theme', 'memoria_setup');

// Check if on dev / local
function memoria_check_dev() {
	$config = memoria_config();
	$domain = $_SERVER['HTTP_HOST'];

	return str_contains( $domain, $config->dev->ddev ) ? true : false;
}

// Enqueue scripts
function memoria_scripts() {
	$config = memoria_config();

	if ( memoria_check_dev() ) {
		wp_enqueue_script( 'vite-index', $config->dev->index, [], wp_get_theme()->get( 'Version' ) );
	} else {
		wp_enqueue_script( 'memoria-bundle', $config->paths->js . '/bundle.js' );
	}
}
add_action( 'wp_enqueue_scripts', 'memoria_scripts' );

// Add attribute to vite script 
function memoria_add_attribute_to_script_tag($tag, $handle, $src) {
	$script_array = ['vite', 'memoria-bundle1', 'vite-index'];

	if ( in_array( $handle, $script_array ) ) {
		return '<script type="module" src="' . esc_url( $src ) . '"></script>';
	}

    return $tag;
}
add_filter( 'script_loader_tag', 'memoria_add_attribute_to_script_tag', 10, 3 );

// Enqueue styles
function memoria_styles() {
	$config = memoria_config();

	// Local styles will be served from index.js script
	if ( memoria_check_dev() ) {
	} else {
		wp_enqueue_style( 'memoria-styles', $config->paths->css . '/styles.css', [], wp_get_theme()->get( 'Version' ) );
	}
}
add_action( 'wp_enqueue_scripts', 'memoria_styles' );

// Remove certain core styles
function memoria_remove_core_styles() {
	// wp_dequeue_style( 'wp-block-library' );
	// wp_dequeue_style( 'wp-block-library-theme' );
	// wp_dequeue_style( 'wc-block-styles' ); // REMOVE WOOCOMMERCE BLOCK CSS
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme' );
	// wp_dequeue_style( 'block-style-variation-styles' ); // REMOVE THEME.JSON
	// wp_dequeue_style( 'core-block-supports' );

	// global $wp_styles;

	// foreach ( $wp_styles->queue as $key => $handle ) {
	// 	if ( strpos( $handle, 'wp-block-' ) === 0 ) {
	// 		wp_dequeue_style( $handle );
	// 	}
	// }
}
// add_action( 'wp_enqueue_scripts', 'memoria_remove_core_styles', 100 );
// remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
// remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );

// // Adds theme support for post formats.
// if ( ! function_exists( 'twentytwentyfive_post_format_setup' ) ) :
// 	/**
// 	 * Adds theme support for post formats.
// 	 *
// 	 * @since Twenty Twenty-Five 1.0
// 	 *
// 	 * @return void
// 	 */
// 	function twentytwentyfive_post_format_setup() {
// 		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );
// 	}
// endif;
// add_action( 'after_setup_theme', 'twentytwentyfive_post_format_setup' );

// // Enqueues editor-style.css in the editors.
// if ( ! function_exists( 'twentytwentyfive_editor_style' ) ) :
// 	/**
// 	 * Enqueues editor-style.css in the editors.
// 	 *
// 	 * @since Twenty Twenty-Five 1.0
// 	 *
// 	 * @return void
// 	 */
// 	function twentytwentyfive_editor_style() {
// 		add_editor_style( 'assets/css/editor-style.css' );
// 	}
// endif;
// add_action( 'after_setup_theme', 'twentytwentyfive_editor_style' );

// // Enqueues style.css on the front.
// if ( ! function_exists( 'twentytwentyfive_enqueue_styles' ) ) :
// 	/**
// 	 * Enqueues style.css on the front.
// 	 *
// 	 * @since Twenty Twenty-Five 1.0
// 	 *
// 	 * @return void
// 	 */
// 	function twentytwentyfive_enqueue_styles() {
// 		wp_enqueue_style(
// 			'twentytwentyfive-style',
// 			get_parent_theme_file_uri( 'style.css' ),
// 			array(),
// 			wp_get_theme()->get( 'Version' )
// 		);
// 	}
// endif;
// add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles' );

// // Registers custom block styles.
// if ( ! function_exists( 'twentytwentyfive_block_styles' ) ) :
// 	/**
// 	 * Registers custom block styles.
// 	 *
// 	 * @since Twenty Twenty-Five 1.0
// 	 *
// 	 * @return void
// 	 */
// 	function twentytwentyfive_block_styles() {
// 		register_block_style(
// 			'core/list',
// 			array(
// 				'name'         => 'checkmark-list',
// 				'label'        => __( 'Checkmark', 'twentytwentyfive' ),
// 				'inline_style' => '
// 				ul.is-style-checkmark-list {
// 					list-style-type: "\2713";
// 				}

// 				ul.is-style-checkmark-list li {
// 					padding-inline-start: 1ch;
// 				}',
// 			)
// 		);
// 	}
// endif;
// add_action( 'init', 'twentytwentyfive_block_styles' );

// // Registers pattern categories.
// if ( ! function_exists( 'twentytwentyfive_pattern_categories' ) ) :
// 	/**
// 	 * Registers pattern categories.
// 	 *
// 	 * @since Twenty Twenty-Five 1.0
// 	 *
// 	 * @return void
// 	 */
// 	function twentytwentyfive_pattern_categories() {

// 		register_block_pattern_category(
// 			'twentytwentyfive_page',
// 			array(
// 				'label'       => __( 'Pages', 'twentytwentyfive' ),
// 				'description' => __( 'A collection of full page layouts.', 'twentytwentyfive' ),
// 			)
// 		);

// 		register_block_pattern_category(
// 			'twentytwentyfive_post-format',
// 			array(
// 				'label'       => __( 'Post formats', 'twentytwentyfive' ),
// 				'description' => __( 'A collection of post format patterns.', 'twentytwentyfive' ),
// 			)
// 		);
// 	}
// endif;
// add_action( 'init', 'twentytwentyfive_pattern_categories' );

// // Registers block binding sources.
// if ( ! function_exists( 'twentytwentyfive_register_block_bindings' ) ) :
// 	/**
// 	 * Registers the post format block binding source.
// 	 *
// 	 * @since Twenty Twenty-Five 1.0
// 	 *
// 	 * @return void
// 	 */
// 	function twentytwentyfive_register_block_bindings() {
// 		register_block_bindings_source(
// 			'twentytwentyfive/format',
// 			array(
// 				'label'              => _x( 'Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive' ),
// 				'get_value_callback' => 'twentytwentyfive_format_binding',
// 			)
// 		);
// 	}
// endif;
// add_action( 'init', 'twentytwentyfive_register_block_bindings' );

// // Registers block binding callback function for the post format name.
// if ( ! function_exists( 'twentytwentyfive_format_binding' ) ) :
// 	/**
// 	 * Callback function for the post format name block binding source.
// 	 *
// 	 * @since Twenty Twenty-Five 1.0
// 	 *
// 	 * @return string|void Post format name, or nothing if the format is 'standard'.
// 	 */
// 	function twentytwentyfive_format_binding() {
// 		$post_format_slug = get_post_format();

// 		if ( $post_format_slug && 'standard' !== $post_format_slug ) {
// 			return get_post_format_string( $post_format_slug );
// 		}
// 	}
// endif;
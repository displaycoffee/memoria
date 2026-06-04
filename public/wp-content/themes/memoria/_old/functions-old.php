<?php
// add_action( 'after_setup_theme', 'memoria_setup' );
// function memoria_setup() {
// 	load_theme_textdomain( 'memoria', get_template_directory() . '/languages' );
// 	add_theme_support( 'title-tag' );
// 	add_theme_support( 'automatic-feed-links' );
// 	add_theme_support( 'post-thumbnails' );
// 	add_theme_support( 'custom-logo' );
// 	add_theme_support( 'html5', array( 'search-form', 'comment-list', 'comment-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
// 	add_theme_support( 'responsive-embeds' );
// 	add_theme_support( 'align-wide' );
// 	add_theme_support( 'wp-block-styles' );
// 	add_theme_support( 'editor-styles' );
// 	add_editor_style( 'editor-style.css' );
// 	add_theme_support( 'appearance-tools' );
// 	add_theme_support( 'woocommerce' );

// 	global $content_width;

// 	if ( !isset( $content_width ) ) {
// 		$content_width = 1920;
// 	}

// 	register_nav_menus( array( 'main-menu' => esc_html__( 'Main Menu', 'memoria' ) ) );
// }

add_action( 'admin_notices', 'memoria_notice' );
function memoria_notice() {
$user_id = get_current_user_id();
if ( !$user_id || !current_user_can( 'manage_options' ) || get_user_meta( $user_id, 'memoria_notice_dismissed_2026', true ) ) {
return;
}
$dismiss_url = add_query_arg( array( 'memoria_dismiss' => '1', 'memoria_nonce' => wp_create_nonce( 'memoria_dismiss_notice' ) ), admin_url() );
echo '<div class="notice notice-info"><p><a href="' . esc_url( $dismiss_url ) . '" class="alignright" style="text-decoration:none"><big>' . esc_html__( '×', 'memoria' ) . '</big></a><big><strong>' . esc_html__( '📝 Thank you for using BlankSlate!', 'memoria' ) . '</strong></big><p>' . esc_html__( 'Powering over 10k websites! Buy me a sandwich! 🥪', 'memoria' ) . '</p><a href="https://github.com/webguyio/memoria/issues/57" class="button-primary" target="_blank" rel="noopener noreferrer"><strong>' . esc_html__( 'How do you use BlankSlate?', 'memoria' ) . '</strong></a> <a href="https://opencollective.com/memoria" class="button-primary" style="background-color:green;border-color:green" target="_blank" rel="noopener noreferrer"><strong>' . esc_html__( 'Donate', 'memoria' ) . '</strong></a> <a href="https://wordpress.org/support/theme/memoria/reviews/#new-post" class="button-primary" style="background-color:purple;border-color:purple" target="_blank" rel="noopener noreferrer"><strong>' . esc_html__( 'Review', 'memoria' ) . '</strong></a> <a href="https://github.com/webguyio/memoria/issues" class="button-primary" style="background-color:orange;border-color:orange" target="_blank" rel="noopener noreferrer"><strong>' . esc_html__( 'Support', 'memoria' ) . '</strong></a></p></div>';
}
add_action( 'admin_init', 'memoria_notice_dismissed' );
function memoria_notice_dismissed() {
$user_id = get_current_user_id();
if ( isset( $_GET['memoria_dismiss'], $_GET['memoria_nonce'] ) && wp_verify_nonce( $_GET['memoria_nonce'], 'memoria_dismiss_notice' ) && current_user_can( 'manage_options' ) ) {
add_user_meta( $user_id, 'memoria_notice_dismissed_2026', 'true', true );
}
}
add_action( 'wp_enqueue_scripts', 'memoria_enqueue' );
function memoria_enqueue() {
wp_enqueue_style( 'memoria-style', get_stylesheet_uri() );
wp_enqueue_script( 'jquery' );
}
add_action( 'wp_footer', 'memoria_footer' );
function memoria_footer() {
?>
<script>
(function() {
const ua = navigator.userAgent.toLowerCase();
const html = document.documentElement;
if (/(iphone|ipod|ipad)/.test(ua)) {
html.classList.add('ios', 'mobile');
}
else if (/android/.test(ua)) {
html.classList.add('android', 'mobile');
}
else {
html.classList.add('desktop');
}
if (/chrome/.test(ua) && !/edg|brave/.test(ua)) {
html.classList.add('chrome');
}
else if (/safari/.test(ua) && !/chrome/.test(ua)) {
html.classList.add('safari');
}
else if (/edg/.test(ua)) {
html.classList.add('edge');
}
else if (/firefox/.test(ua)) {
html.classList.add('firefox');
}
else if (/brave/.test(ua)) {
html.classList.add('brave');
}
else if (/opr|opera/.test(ua)) {
html.classList.add('opera');
}
})();
</script>
<?php
}
add_filter( 'document_title_separator', 'memoria_document_title_separator' );
function memoria_document_title_separator( $sep ) {
$sep = esc_html( '|' );
return $sep;
}
add_filter( 'the_title', 'memoria_title' );
function memoria_title( $title ) {
if ( $title == '' ) {
return esc_html( '...' );
} else {
return wp_kses_post( $title );
}
}

// function memoria_schema_type() {
// 	$schema = 'https://schema.org/';
// 	if ( is_single() ) {
// 		$type = "Article";
// 	} elseif ( is_author() ) {
// 		$type = 'ProfilePage';
// 	} elseif ( is_search() ) {
// 		$type = 'SearchResultsPage';
// 	} else {
// 		$type = 'WebPage';
// 	}
// 	echo 'itemscope itemtype="' . esc_url( $schema ) . esc_attr( $type ) . '"';
// }

// add_filter( 'nav_menu_link_attributes', 'memoria_schema_url', 10 );

// function memoria_schema_url( $atts ) {
// 	$atts['itemprop'] = 'url';
// 	return $atts;
// }

if ( !function_exists( 'memoria_wp_body_open' ) ) {
function memoria_wp_body_open() {
do_action( 'wp_body_open' );
}
}
add_action( 'wp_body_open', 'memoria_skip_link', 5 );
function memoria_skip_link() {
echo '<a href="#content" class="skip-link screen-reader-text">' . esc_html__( 'Skip to the content', 'memoria' ) . '</a>';
}
add_filter( 'the_content_more_link', 'memoria_read_more_link' );
function memoria_read_more_link() {
if ( !is_admin() ) {
return ' <a href="' . esc_url( get_permalink() ) . '" class="more-link">' . sprintf( __( '...%s', 'memoria' ), '<span class="screen-reader-text">  ' . esc_html( get_the_title() ) . '</span>' ) . '</a>';
}
}
add_filter( 'excerpt_more', 'memoria_excerpt_read_more_link' );
function memoria_excerpt_read_more_link( $more ) {
if ( !is_admin() ) {
global $post;
return ' <a href="' . esc_url( get_permalink( $post->ID ) ) . '" class="more-link">' . sprintf( __( '...%s', 'memoria' ), '<span class="screen-reader-text">  ' . esc_html( get_the_title() ) . '</span>' ) . '</a>';
}
}
add_filter( 'big_image_size_threshold', '__return_false' );
add_filter( 'intermediate_image_sizes_advanced', 'memoria_image_insert_override' );
function memoria_image_insert_override( $sizes ) {
unset( $sizes['medium_large'] );
unset( $sizes['1536x1536'] );
unset( $sizes['2048x2048'] );
return $sizes;
}
add_action( 'widgets_init', 'memoria_widgets_init' );
function memoria_widgets_init() {
register_sidebar( array(
'name' => esc_html__( 'Sidebar Widget Area', 'memoria' ),
'id' => 'primary-widget-area',
'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
'after_widget' => '</li>',
'before_title' => '<h3 class="widget-title">',
'after_title' => '</h3>',
) );
}
add_action( 'wp_head', 'memoria_pingback_header' );
function memoria_pingback_header() {
if ( is_singular() && pings_open() ) {
printf( '<link rel="pingback" href="%s">' . "\n", esc_url( get_bloginfo( 'pingback_url' ) ) );
}
}
add_action( 'comment_form_before', 'memoria_enqueue_comment_reply_script' );
function memoria_enqueue_comment_reply_script() {
if ( get_option( 'thread_comments' ) ) {
wp_enqueue_script( 'comment-reply' );
}
}
function memoria_custom_pings( $comment ) {
?>
<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>"><?php comment_author_link(); ?></li>
<?php
}
add_filter( 'get_comments_number', 'memoria_comment_count', 0 );
function memoria_comment_count( $count ) {
if ( !is_admin() ) {
global $id;
$get_comments = get_comments( 'status=approve&post_id=' . $id );
$comments_by_type = separate_comments( $get_comments );
return count( $comments_by_type['comment'] );
} else {
return $count;
}
}
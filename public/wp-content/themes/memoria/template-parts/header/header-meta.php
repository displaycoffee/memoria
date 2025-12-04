<?php
	/**
	* Meta tags for header
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }	

	// Variables for meta tags
	$charset = get_bloginfo( 'charset' ) ? esc_attr( get_bloginfo( 'charset' ) ) : 'UTF-8';
	$description = get_bloginfo( 'description' ) ? esc_attr( get_bloginfo( 'description' ) ) : false;
	$locale = get_bloginfo( 'language' ) ? esc_attr( str_replace( '-', '_', get_bloginfo( 'language' ) ) ) : false;
	$name = get_bloginfo( 'name' ) ? esc_attr( get_bloginfo( 'name' ) ) : false;
	$url = get_bloginfo( 'wpurl' ) ? esc_url( get_bloginfo( 'wpurl' ) ) : false;
	$type = 'blog';

	// Get custom logo
	$logo = get_theme_mod( 'custom_logo' );
	$logo_src = wp_get_attachment_image_src( $logo , 'full' );
	$image = $logo_src && $logo_src[0] ? esc_url( $logo_src[0] ) : false;
?>
<!-- Standard meta tags -->
<meta charset="<?php echo $charset; ?>" />
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<?php if ( $description ) : ?>
	<meta name="description" content="<?php echo $description; ?>" />
<?php endif; ?>
<!-- Open Graph meta tags: https://ogp.me -->
<?php if ( $name ) : ?>
	<meta property="og:title" content="<?php echo $name; ?>" />
	<meta property="og:site_name" content="<?php echo $name; ?>" />
<?php endif; ?>	
<?php if ( $url ) : ?>
	<meta property="og:url" content="<?php echo $url; ?>" />
<?php endif; ?>	
<?php if ( $locale ) : ?>
	<meta property="og:locale" content="<?php echo $locale; ?>">
<?php endif; ?>	
<?php if ( $description ) : ?>
	<meta property="og:description" content="<?php echo $description; ?>" />
<?php endif; ?>
<?php if ( $image ) : ?>
	<meta property="og:image" content="<?php echo $image; ?>" />
<?php endif; ?>
<meta property="og:type" content="<?php echo $type; ?>" />	
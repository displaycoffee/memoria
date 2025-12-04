<?php
	/**
	* Template for header.
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }	
?>
<!doctype html>
<html <?php language_attributes(); ?>>
	<head>
		<?php get_template_part( 'template-parts/header/header-meta' ); ?>
		<?php wp_head(); ?>
	</head>

	<body <?php body_class(); ?>>
		<?php wp_body_open(); ?>
<div id="wrapper" class="hfeed">
<header id="header" role="banner">
<div id="branding">
<div id="site-title" itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
<?php
if ( is_front_page() || is_home() || is_front_page() && is_home() ) { echo '<h1>'; }
echo '<a href="' . esc_url( home_url( '/' ) ) . '" title="' . esc_attr( get_bloginfo( 'name' ) ) . '" rel="home" itemprop="url"><span itemprop="name">' . esc_html( get_bloginfo( 'name' ) ) . '</span></a>';
if ( is_front_page() || is_home() || is_front_page() && is_home() ) { echo '</h1>'; }
?>
</div>
<div id="site-description"<?php if ( !is_single() ) { echo ' itemprop="description"'; } ?>><?php bloginfo( 'description' ); ?></div>
</div>
<nav id="menu" role="navigation" aria-label="<?php esc_attr_e( 'Primary Navigation', 'memoria' ); ?>" itemscope itemtype="https://schema.org/SiteNavigationElement">
<?php wp_nav_menu( array( 'theme_location' => 'main-menu', 'link_before' => '<span itemprop="name">', 'link_after' => '</span>' ) ); ?>
<div id="search" role="search" aria-label="<?php esc_attr_e( 'Search', 'memoria' ); ?>"><?php get_search_form(); ?></div>
</nav>
</header>
<div id="container">
<main id="content" role="main">
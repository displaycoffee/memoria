<?php
	/**
	* Main header used throughout site
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }

	// Add config object
	$config = memoria_config();
	
	// Get objects from config
	$site = $config->site;
	$settings = $config->settings;

	// Determine if page is front or home page
	$is_home = memoria_is_home();
?>
<header class="header">
	<div class="site-details row row-wrap row-auto row-align-items-center row-spacing-20">
		<?php if ( $site->logo ) : ?>
			<div class="site-logo column">
				<div class="image-wrapper">
					<?php if ( $site->name ) : ?>
						<img src="<?php echo $site->logo; ?>" alt="<?php echo $site->name; ?>" title="<?php echo $site->name; ?>" loading="lazy" />
					<?php else : ?>
						<img src="<?php echo $site->logo; ?>" loading="lazy" />
					<?php endif; ?>
				</div>
			</div>
		<?php endif; ?>

		<?php if ( $site->name ) : ?>
			<div class="site-name column">
				<h1><?php echo $site->name; ?></h1>
			</div>
		<?php endif; ?>

		<?php if ( $site->description ) : ?>
			<div class="site-description column">
				<p><?php echo $site->description; ?></p>
			</div>
		<?php endif; ?>
	</div>

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
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
	<div class="header-details site-details flex-wrap flex-align-items-center">
		<?php if ( $site->logo ) : ?>
			<div class="site-logo">
				<div class="image-wrapper">
					<a href="<?php echo $site->url; ?>">
						<?php if ( $site->name ) : ?>
							<img src="<?php echo $site->logo; ?>" alt="<?php echo $site->name; ?>" title="<?php echo $site->name; ?>" loading="lazy" />
						<?php else : ?>
							<img src="<?php echo $site->logo; ?>" loading="lazy" />
						<?php endif; ?>
						</a>
				</div>
			</div>
		<?php endif; ?>

		<?php if ( $site->name ) : ?>
			<div class="site-name">
				<h1>
					<a href="<?php echo $site->url; ?>">
						<?php echo $site->name; ?>
					</a>
				</h1>
			</div>
		<?php endif; ?>

		<?php if ( $site->description ) : ?>
			<div class="site-description">
				<p><?php echo $site->description; ?></p>
			</div>
		<?php endif; ?>

		<div class="site-search">
			<?php get_search_form(); ?>
		</div>
	</div>

	<nav class="header-navigation">
		<span class="icon-wrapper icon-wrapper-large">
			<svg class="icon icon-equalizer">
				<use xlink:href="#icon-equalizer"></use>
			</svg>
		</span>
		<?php
			wp_nav_menu(
				array(
					'theme_location' => 'header',
					'menu_class'     => 'menu flex-wrap flex-align-items-center unstyled',
					'container'      => false,
					'after'          => 'test 2', // add an icon here
					'depth'          => 2
				)
			);
		?>
	</nav>
</header>
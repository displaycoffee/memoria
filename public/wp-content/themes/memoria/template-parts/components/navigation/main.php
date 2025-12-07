<?php
	/**
	* Main navigation
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }
?>
<nav class="navigation navigation-main">
	<?php
		wp_nav_menu(
			array(
				'theme_location' => 'main',
				'menu_class'     => 'menu flex-wrap flex-align-items-center unstyled',
				'container'      => false,
				'after'          => 'test 2', // add an icon here
				'depth'          => 2
			)
		);
	?>

	<?php get_template_part( 'template-parts/components/slideout/slideout-button' ); ?>
</nav>

<?php get_template_part( 'template-parts/components/slideout/slideout-menu' ); ?>


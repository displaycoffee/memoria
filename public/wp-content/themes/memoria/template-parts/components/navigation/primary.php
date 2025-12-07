<?php
	/**
	* Main navigation
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }
?>
<nav class="navigation navigation-primary">
	<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'menu_class'     => 'menu unstyled',
				'container'      => false,
				'depth'          => 2
			)
		);
	?>

	<?php get_template_part( 'template-parts/components/slideout/slideout-button' ); ?>
</nav>

<?php get_template_part( 'template-parts/components/slideout/slideout-menu' ); ?>


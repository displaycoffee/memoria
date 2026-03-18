<?php
	/**
	* Template for header include
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }
?>
<!doctype html>
<html <?php language_attributes(); ?>>
	<?php get_template_part( 'template-parts/layout/header/head' ); ?>

	<body <?php body_class(); ?>>
		<?php wp_body_open(); ?>

		<?php get_template_part( 'template-parts/components/svg-map/svg-map' ); ?>

		<div class="container">
			<?php get_template_part( 'template-parts/layout/header/header-main' ); ?>
			
			<?php get_template_part( 'template-parts/components/navigation/primary' ); ?>

			<main id="content" role="main">
				
<?php
	/**
	* Template for header
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }
?>
<!doctype html>
<html <?php language_attributes(); ?>>
	<head>
		<?php get_template_part( 'template-parts/layout/header/meta' ); ?>

		<?php wp_head(); ?>
	</head>

	<body <?php body_class(); ?>>
		<?php wp_body_open(); ?>

		<?php get_template_part( 'template-parts/layout/header/svg-map' ); ?>

		<div class="container container-main">
			<?php get_template_part( 'template-parts/layout/header/header' ); ?>
			
			<?php get_template_part( 'template-parts/components/navigation/main' ); ?>

			<div id="container">
				<main id="content" role="main">
<?php
	/**
	* Template for head element
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }

	// Add config object
	$config = memoria_config();

	// Get objects from config
	$site = $config->site;
	$settings = $config->settings;
?>
<head>
	<?php get_template_part( 'template-parts/layout/header/meta' ); ?>
	
	<?php wp_head(); ?>
</head>
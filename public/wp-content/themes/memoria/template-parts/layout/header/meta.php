<?php
	/**
	* Template for head element meta tags
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
<!-- Standard meta tags -->
<meta charset="<?php echo $settings->charset ?>" />
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<?php if ( $site->description ) : ?>
	<meta name="description" content="<?php echo $site->description; ?>" />
<?php endif; ?>
<!-- Open Graph meta tags: https://ogp.me -->
<?php if ( $site->name ) : ?>
	<meta property="og:title" content="<?php echo $site->name; ?>" />
	<meta property="og:site_name" content="<?php echo $site->name; ?>" />
<?php endif; ?>	
<?php if ( $site->url ) : ?>
	<meta property="og:url" content="<?php echo $site->url; ?>" />
<?php endif; ?>	
<?php if ( $settings->locale ) : ?>
	<meta property="og:locale" content="<?php echo $settings->locale; ?>">
<?php endif; ?>	
<?php if ( $site->description ) : ?>
	<meta property="og:description" content="<?php echo $site->description; ?>" />
<?php endif; ?>
<?php if ( $site->logo ) : ?>
	<meta property="og:image" content="<?php echo $site->logo; ?>" />
<?php endif; ?>
<meta property="og:type" content="<?php echo $site->type; ?>" />
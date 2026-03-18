<?php
	/**
	* Template for search form
	*
	* Exit if accessed directly
	**/
	if ( !defined( 'ABSPATH' ) ) { exit; }

	// Add config object
	$config = memoria_config();
		
	// Get objects from config
	$site = $config->site;
	$settings = $config->settings;
	$search = $config->search;

	// Create search form id
	if ( $args && count( $args ) && $args['id'] ) {
		$search_id = $search->prefix . $args['id'];
	} else {
		$search_id = $search->prefix . wp_unique_id();
	}
	$search_id = esc_attr( $search_id );

	// Create search input id
	$search_input_id = esc_attr( $search_id . '-input' );

	// Set placeholder text
	$placeholder = esc_attr_x( $search->text, 'placeholder', $settings->lang );

	// Create title value
	if ( get_search_query() ) {
		$title = esc_attr_x( $search->results . ' ' . get_search_query(), 'title', $settings->lang );
	} else {
		$title = $placeholder;
	}
?>
<form id="<?php echo $search_id; ?>" class="search-form flex-nowrap flex-align-items-center" role="search" method="get" action="<?php echo $site->url; ?>">
	<div class="form-field form-field-close">
		<label class="label" for="<?php echo $search_input_id; ?>">
			<?php _e( $search->label, $settings->lang ); ?>
		</label>
	
		<input id="<?php echo $search_input_id; ?>" class="input" type="text" placeholder="<?php echo $placeholder; ?>" value="<?php echo get_search_query() ?>" title="<?php echo $title; ?>" name="s" />

		<button class="button-close unstyled icon-wrapper" type="button">
			<svg class="icon icon-close">
				<use xlink:href="#icon-close"></use>
			</svg>
		</button>
	</div>

	<button class="button" type="submit">
		<span class="icon-wrapper">
			<svg class="icon icon-search">
				<use xlink:href="#icon-search"></use>
			</svg>
		</span>
		<span class="button-label">
			<?php _e( $search->text, $settings->lang ); ?>
		</span>
	</button>
</form>
<?php
/**
* Helpers for functionality
*
* @package memoria
* @since 1.0.0
*/

// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) { exit; }

// Check if on dev / local
function memoria_check_dev() {
	$domain = $_SERVER['HTTP_HOST'];
	//https://localhost:3000/themes/memoria/targets/index/index.js

	return str_contains( $domain, 'ddev.site' ) ? true : false;
}
<?php
/**
* Functions to sanitize field settings
*
* @package memoria
* @since 1.0.0
*/

// Exit if accessed directly
if (!defined('ABSPATH')) { exit; }

// Sanitize all theme options before saving
function memoria_sanitize_options(array $input): array {
	$clean = [];
	foreach ($input as $key => $value) {
		$clean[$key] = sanitize_text_field($value);
	}
	return $clean;
}
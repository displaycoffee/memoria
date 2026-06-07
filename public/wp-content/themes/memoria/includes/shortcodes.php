<?php
/**
* Custom shortcodes for theme option content exposed over GraphQL
*
* @package memoria
* @since 1.0.0
*/

// Exit if accessed directly
if (!defined('ABSPATH')) { exit; }

// [b]bold text[/b] -> <strong>bold text</strong>
add_shortcode('b', function ($atts, $content = null): string {
	return '<strong>' . esc_html($content ?? '') . '</strong>';
});

// [i]italic text[/i] -> <em>italic text</em>
add_shortcode('i', function ($atts, $content = null): string {
	return '<em>' . esc_html($content ?? '') . '</em>';
});

// [a href="https://example.com"]link text[/a] -> <a href="...">link text</a>
add_shortcode('a', function ($atts, $content = null): string {
	$atts = shortcode_atts(['href' => ''], $atts, 'a');
	$url = esc_url($atts['href']);

	// Drop the link wrapper entirely if the href is missing or fails URL sanitization
	if (!$url) {
		return esc_html($content ?? '');
	}

	return sprintf('<a href="%s" rel="noopener noreferrer">%s</a>', $url, esc_html($content ?? ''));
});

<?php
/**
* Sections for the Theme Options page
*
* @package memoria
* @since 1.0.0
*/

// Exit if accessed directly
if (!defined('ABSPATH')) { exit; }

return (object) [
	'site' => (object) [
		'site_identity' => (object) [
			'handle' => 'memoria_site_identity',
			'label' => 'Site Identity',
			'fields' => (object) [
				'blogname' => (object) [
					'label' => 'Site Title',
					'render' => 'memoria_render_core_text_field',
					'sanitize_callback' => 'sanitize_text_field'
				],
				'blogdescription' => (object) [
					'label' => 'Tagline',
					'render' => 'memoria_render_core_text_field',
					'description' => 'In a few words, explain what this site is about. Example: "Just another WordPress site."',
					'sanitize_callback' => 'sanitize_text_field',
				],
				'site_icon' => (object) [
					'label' => 'Site Icon',
					'render' => 'memoria_render_media_picker_field',
					'description' => 'The "Site Icon" is what you see in browser tabs, bookmark bars, and within the WordPress mobile apps. It should be square and at least <code>512 by 512</code> pixels.',
					'sanitize_callback' => 'absint',
					'is_icon' => true,
				],
			]
		],
	],
	'custom' => (object) [
		'social' => (object) [
			'handle' => 'memoria_social',
			'label' => 'Social Links',
			'fields' => (object) [
				'social_facebook' => (object) [
					'label' => 'Facebook URL',
					'type' => 'url',
					'render' => 'memoria_render_text_field',
					'sanitize_callback' => 'sanitize_url',
					'graphQL' => 'socialFacebook',
				],
				'social_instagram' => (object) [
					'label' => 'Instagram URL',
					'type' => 'url',
					'render' => 'memoria_render_text_field',
					'sanitize_callback' => 'sanitize_url',
					'graphQL' => 'socialInstagram',
				],
				'social_twitter' => (object) [
					'label' => 'Twitter / X URL',
					'type' => 'url',
					'render' => 'memoria_render_text_field',
					'sanitize_callback' => 'sanitize_url',
					'graphQL' => 'socialTwitter',
				],
				'social_github' => (object) [
					'label' => 'GitHub URL',
					'type' => 'url',
					'render' => 'memoria_render_text_field',
					'sanitize_callback' => 'sanitize_url',
					'graphQL' => 'socialGithub',
				],
			],
		],
		'sidebar' => (object) [
			'handle' => 'memoria_sidebar',
			'label' => 'Sidebar Content',
			'fields' => (object) [
				'sidebar_slug' => (object) [
					'label' => 'Slug',
					'type' => 'text',
					'render' => 'memoria_render_text_field',
					'description' => 'Enter a slug to show sidebar content from a particular page. This <strong>must</strong> be a page and not a post.',
					'sanitize_callback' => 'sanitize_text_field',
					'graphQL' => 'sidebarSlug',
				],
			],
		],
		'header' => (object) [
			'handle' => 'memoria_header',
			'label' => 'Header',
			'fields' => (object) [
				'header_logo' => (object) [
					'label' => 'Logo',
					'type' => 'url',
					'render' => 'memoria_render_media_picker_field',
					'description' => 'Header logo. If left blank, no logo will show.',
					'sanitize_callback' => 'absint',
					'graphQL' => 'headerLogo',
				],
			],
		],
		'footer_block_01' => (object) [
			'handle' => 'memoria_footer_block_01',
			'label' => 'Footer Block 01',
			'fields' => (object) [
				'footer_block_01_order' => (object) [
					'label' => 'Order',
					'type' => 'number',
					'default' => 1,
					'render' => 'memoria_render_text_field',
					'description' => 'The order of the first footer block. By default it will be in the first position.',
					'sanitize_callback' => 'absint',
					'graphQL' => 'footerBlock01Order',
				],
				'footer_block_01_content' => (object) [
					'label' => 'Content',
					'type' => 'textarea',
					'render' => 'memoria_render_textarea_field',
					'description' => 'You can use <code>[b]</code>, <code>[i]</code>, and <code>[a href="https://example.com"]</code> to format text.',
					'maxlength' => 500,
					'sanitize_callback' => 'sanitize_textarea_field',
					'parse_shortcodes' => true,
					'graphQL' => 'footerBlock01Content',
				],
			],
		],
		'footer_block_02' => (object) [
			'handle' => 'memoria_footer_block_02',
			'label' => 'Footer Block 02',
			'fields' => (object) [
				'footer_block_02_order' => (object) [
					'label' => 'Order',
					'type' => 'number',
					'default' => 2,
					'render' => 'memoria_render_text_field',
					'description' => 'The order of the second footer block. By default it will be in the second position.',
					'sanitize_callback' => 'absint',
					'graphQL' => 'footerBlock02Order',
				],
				'footer_block_02_content' => (object) [
					'label' => 'Content',
					'type' => 'textarea',
					'render' => 'memoria_render_textarea_field',
					'description' => 'You can use <code>[b]</code>, <code>[i]</code>, and <code>[a href="https://example.com"]</code> to format text.',
					'maxlength' => 500,
					'sanitize_callback' => 'sanitize_textarea_field',
					'parse_shortcodes' => true,
					'graphQL' => 'footerBlock02Content',
				],
			],
		],
		'footer_block_03' => (object) [
			'handle' => 'memoria_footer_block_03',
			'label' => 'Footer Block 03',
			'fields' => (object) [
				'footer_block_03_order' => (object) [
					'label' => 'Order',
					'type' => 'number',
					'default' => 3,
					'render' => 'memoria_render_text_field',
					'description' => 'The order of the third footer block. By default it will be in the third position.',
					'sanitize_callback' => 'absint',
					'graphQL' => 'footerBlock03Order',
				],
				'footer_block_03_content' => (object) [
					'label' => 'Content',
					'type' => 'textarea',
					'render' => 'memoria_render_textarea_field',
					'description' => 'You can use <code>[b]</code>, <code>[i]</code>, and <code>[a href="https://example.com"]</code> to format text.',
					'maxlength' => 500,
					'sanitize_callback' => 'sanitize_textarea_field',
					'parse_shortcodes' => true,
					'graphQL' => 'footerBlock03Content',
				],
			],
		],
	],
];
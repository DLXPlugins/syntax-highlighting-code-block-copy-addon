<?php
/**
 * Plugin Name:  Syntax-highlighting Code Block Copy Addon
 * Plugin URI:   https://github.com/DLXPlugins/syntax-highlighting-code-block-copy-addon
 * Description:  Adds a copy icon to the code block. Can be disabled in the block settings or per filter or per block editor settings.
 * Version:      1.0.0
 * Author:       Ronald Huereca
 * Author URI:   https://dlxplugins.com
 * License:      GPL2
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  syntax-highlighting-code-block-copy-addon
 * Requires PHP: 7.4
 *
 * @package Syntax_Highlighting_Code_Block
 */

namespace DLXPlugins\SyntaxHighlighterCodeBlockCopyAddon;

define( 'DLX_SYNTAX_HIGHLIGHTER_CODE_BLOCK_COPY_ADDON_VERSION', '1.0.0' );
define( 'DLX_SYNTAX_HIGHLIGHTER_CODE_BLOCK_COPY_ADDON_FILE', __FILE__ );

// When syntax highlighter parent loads, let's begin our init.
add_action( 'syntax_highlighting_code_block_boot', __NAMESPACE__ . '\boot' );

/**
 * Boot up our plugin.
 */
function boot() {

	// Add action for when the code block is rendered.
	add_action( 'syntax_highlighting_code_block_render', __NAMESPACE__ . '\on_render' );

	// Let's add our copy SVG and structure to markup.
	add_filter( 'syntax_highlighting_code_block_injected_markup', __NAMESPACE__ . '\add_copy_markup', 10, 2 );

	// Add data attribute to <pre> markup.
	add_filter( 'syntax_highlighting_code_block_start_tag_attributes', __NAMESPACE__ . '\add_copy_attribute', 10, 2 );
}

/**
 * Add copy data attribute to the code block.
 *
 * @param array $tag_attributes   The HTML attributes of the start tag.
 * @param array $block_attributes The block attributes.
 *t
 * @return array key/value pair of data attributes.
 */
function add_copy_attribute( $tag_attributes, $block_attributes ) {
	// Check if copy is enabled.
	$is_copy_enabled = $block_attributes['copyEnabled'] ?? true;

	if ( ! $is_copy_enabled ) {
		return $tag_attributes;
	}

	// Add data-copy attribute.
	$tag_attributes['data-copy-enabled'] = 'true';

	return $tag_attributes;
}



/**
 * Add copy markup and icon after code block.
 *
 * @param string $markup     The existing block markup.
 * @param array  $attributes The block attributes.
 *
 * @return string Markup with copy code block.
 */

function add_copy_markup( $markup, $attributes ) {
	// Check attributes to see if copy is enabled.
	$is_copy_enabled = $attributes['copyEnabled'] ?? true;

	// Add filter for copy.
	$is_copy_enabled = apply_filters( 'syntax_highlighting_code_block_copy_enabled', (bool) $is_copy_enabled, $attributes );

	// If copy is not enabled, return the original markup.
	if ( ! $is_copy_enabled ) {
		return $markup;
	}

	// Get copy label, empty by default.
	$copy_label = $attributes['copyLabel'] ?? '';
	$copy_label = apply_filters( 'syntax_highlighting_code_block_copy_label', $copy_label, $attributes );
	if ( empty( $copy_label ) ) {
		$copy_label = __( 'Copy', 'syntax-highlighting-code-block-copy-addon' );
	}

	// Get copied label, empty by default.
	$copied_label = $attributes['copiedLabel'] ?? '';
	$copied_label = apply_filters( 'syntax_highlighting_code_block_copied_label', $copied_label, $attributes );
	if ( empty( $copied_label ) ) {
		$copied_label = __( 'Copied!', 'syntax-highlighting-code-block-copy-addon' );
	}

	// Start output buffer and begin markup.
	ob_start();

	?>
	<div class="dlx-syntax-highlighting-code-block-copy-container">
		<button class="dlx-syntax-highlighting-code-block-copy-button" aria-label="<?php echo esc_attr( $copy_label ); ?>">
			<svg class="dlx-syntax-highlighting-code-block-copy-icon" width="24" height="24" aria-hidden="true">
				<use xlink:href="#lucide-copy"></use>
			</svg>
			<span class="dlx-syntax-highlighting-code-block-copy-label"><?php echo esc_html( $copy_label ); ?></span>
			<span class="dlx-syntax-highlighting-code-block-copied-label"><?php echo esc_html( $copied_label ); ?></span>
		</button>
	</div>
	<?php
	$copy_markup = ob_get_clean();

	// Add copy markup to the end of start tag.
	$markup .= $copy_markup;

	return $markup;
}

/**
 * When plugin is rendered, let's hook into footer so we can load our copy SVG.
 */
function on_render() {
	add_action( 'wp_footer', __NAMESPACE__ . '\render_copy_svg' );
	add_action( 'wp_footer', __NAMESPACE__ . '\render_footer_styles' );

	add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_block_scripts' );
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_block_scripts_frontend' );
}

/**
 * Enqueue block scripts (in the footer).
 */
function enqueue_block_scripts() {
	// Retrieve the dependency script file.
	$asset_file = include plugin_dir_path( DLX_SYNTAX_HIGHLIGHTER_CODE_BLOCK_COPY_ADDON_FILE ) . 'build/copy.asset.php';

	// Enqueue JS.
	wp_enqueue_script(
		'syntax-highlighting-code-block-copy-addon',
		plugins_url( 'build/copy.js', DLX_SYNTAX_HIGHLIGHTER_CODE_BLOCK_COPY_ADDON_FILE ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	// Allow others to set default copy options.
	wp_localize_script(
		'syntax-highlighting-code-block-copy-addon',
		'dlxSyntaxHighlightingCodeBlockCopyAddon',
		apply_filters(
			'syntax_highlighting_code_block_copy_addon_default_options',
			array(
				'copyLabel'   => __( 'Copy', 'syntax-highlighting-code-block-copy-addon' ),
				'copiedLabel' => __( 'Copied!', 'syntax-highlighting-code-block-copy-addon' ),
				'copyEnabled' => true,
			)
		)
	);
}

/**
 * Enqueue block scripts (in the footer).
 */
function enqueue_block_scripts_frontend() {
	// Retrieve the dependency script file.
	$asset_file = include plugin_dir_path( DLX_SYNTAX_HIGHLIGHTER_CODE_BLOCK_COPY_ADDON_FILE ) . 'build/copy-frontend.asset.php';

	// Enqueue JS.
	wp_enqueue_script(
		'syntax-highlighting-code-block-copy-addon-frontend',
		plugins_url( 'build/copy-frontend.js', DLX_SYNTAX_HIGHLIGHTER_CODE_BLOCK_COPY_ADDON_FILE ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);
}

/**
 * Render any footer styles for the copy icon.
 */
function render_footer_styles() {
	?>
	<style>
		:root {
			--dlx-syntax-highlighting-code-block-copy-icon-color: #999;
			--dlx-syntax-highlighting-code-block-copy-icon-color-hover: #333;
			--dlx-syntax-highlighting-code-block-copy-svgs-width: 24px;
			--dlx-syntax-highlighting-code-block-copy-svgs-height: 24px;
		}
		/* Target the pre with data attribute */
		pre[data-copy-enabled="true"] {
			position: relative;
		}
		.dlx-syntax-highlighting-code-block-copy-container {
			display: inline-flex;
			position: absolute;
			top: 0;
			right: 0;
			padding: 0.5em;
			z-index: 1;
		}
		.dlx-syntax-highlighting-code-block-copy-container span {
			display: none;
		}
		.dlx-syntax-highlighting-code-block-copy-container button,
		.dlx-syntax-highlighting-code-block-copy-container button:focus,
		.dlx-syntax-highlighting-code-block-copy-container button:hover {
			background: none;
			color: inherit;
			border: none;
			padding: 0;
			cursor: pointer;
			outline: inherit;
			text-transform: unset;
			display: inline-flex;
			width: var(--dlx-syntax-highlighting-code-block-copy-svgs-width);
			height: var(--dlx-syntax-highlighting-code-block-copy-svgs-height);
			transition: color 0.25s ease-in-out;
		}
		.dlx-syntax-highlighting-code-block-copy-container button svg {
			display: block;
			width: 100%;
			height: 100%;
			color: var(--dlx-syntax-highlighting-code-block-copy-icon-color);
			transition: color 0.25s ease-in-out;
		}
		.dlx-syntax-highlighting-code-block-copy-container button:focus svg,
		.dlx-syntax-highlighting-code-block-copy-container button:hover svg {
			color: var(--dlx-syntax-highlighting-code-block-copy-icon-color-hover);
			transition: color 0.25s ease-in-out;
		}

	</style>
	<?php
}
/**
 * Render the copy SVG.
 */
function render_copy_svg() {
	?>
	<svg width="0" height="0" class="hidden" style="display: none;">
		<symbol aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy" id="lucide-copy">
			<rect fill="none" color="currentColor" width="14" height="14" x="8" y="8" rx="2" ry="2"/><path fill="none" color="currentColor" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
		</symbol>
		<symbol aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-check" id="lucide-copy-check">
			<path fill="none" color="currentColor" d="m12 15 2 2 4-4"/><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path fill="none" color="currentColor" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
		</symbol>
	</svg>
	<?php
}

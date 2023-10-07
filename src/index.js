import {
	ToggleControl,
	TextControl
} from '@wordpress/components';

import {
	addFilter,
} from '@wordpress/hooks';
import {
	__
} from '@wordpress/i18n';

import './edit.js';

const BLOCK_NAME = 'core/code';

/**
 * Add custom attributes to `westonruter/syntax-highlighting-code-block-type` block.
 */
const addAttributes = ( settings, name ) => {
	if ( name !== BLOCK_NAME ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		showCopyButton: {
			type: 'boolean',
			default: dlxSyntaxHighlightingCodeBlockCopyAddon.copyEnabled,
		},
		copyLabel: {
			type: 'string',
			default: dlxSyntaxHighlightingCodeBlockCopyAddon.copyLabel,
		},
		copiedLabel: {
			type: 'string',
			default: dlxSyntaxHighlightingCodeBlockCopyAddon.copiedLabel,
		},
	};

	return settings;
}
addFilter(
	'blocks.registerBlockType',
	'dlxplugins/syntax-highlighting-code-block-type/attributes',
	addAttributes,
);
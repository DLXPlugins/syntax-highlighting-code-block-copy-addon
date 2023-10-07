import {
	ToggleControl,
	TextControl,
	PanelBody
} from '@wordpress/components';
import {
	createHigherOrderComponent
} from '@wordpress/compose';
import {
	addFilter,
} from '@wordpress/hooks';
import {
	InspectorControls
} from '@wordpress/block-editor';
import {
	__
} from '@wordpress/i18n';

const withCopyControlsAdded = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( props.name !== 'core/code' ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;

		const {
			showCopyButton,
			copyLabel,
			copiedLabel,
		} = attributes;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Copy Button', 'syntax-highlighting-code-block-copy-addon' ) }
						initialOpen={ true }
					>
						<ToggleControl
							label={ __( 'Show Copy Button', 'syntax-highlighting-code-block-copy-addon' ) }
							checked={ showCopyButton }
							onChange={ ( value ) => setAttributes( { showCopyButton: value } ) }
							help={ __( 'Show a button to copy the code block to the clipboard. Please note this will only display for browsers that support it.', 'syntax-highlighting-code-block-copy-addon' ) }
						/>
						<TextControl
							label={ __( 'Copy Button Label', 'syntax-highlighting-code-block-copy-addon' ) }
							value={ copyLabel }
							onChange={ ( value ) => setAttributes( { copyLabel: value } ) }
						/>
						<TextControl
							label={ __( 'Copied Label', 'syntax-highlighting-code-block-copy-addon' ) }
							value={ copiedLabel }
							onChange={ ( value ) => setAttributes( { copiedLabel: value } ) }
						/>
					</PanelBody>

				</InspectorControls>
			</>
		)
	};
} );

addFilter(
	'editor.BlockEdit',
	'dlxplugins/syntax-highlighting-code-block-type-with-copy-controls',
	withCopyControlsAdded,
);
<?php
use phpseclib3\Math\BinaryField\Integer;

define( 'theInt_AWESOME_PLUGIN_VERSION', '1.0.0' );

function codeinwp_options_assets() {
	wp_enqueue_script( 'theint-script', plugins_url( '/', __FILE__ ) . 'build/build.js', array( 'wp-api', 'wp-i18n', 'wp-components', 'wp-element', 'jquery' ), theInt_AWESOME_PLUGIN_VERSION, true );
	wp_enqueue_style( 'theint-style', plugins_url( '/', __FILE__ ) . 'build/build.css', array( 'wp-components' ) );

	$last_training = get_site_option( 'theintelligent-last-training' );
	$has_suggestions = get_option( 'theint_suggestions' ) ? true : false;
	$trained_at = 'Never';
	if ( $last_training ) {
		if ( is_numeric( $last_training ) ) {
			$trained_at =  date( "d-m-Y - h:ia", $last_training );
		} else {
			$trained_at =  $last_training;
		}
	}
	$data = [
		'nonce' => wp_create_nonce( 'theint_nonce' ),
		'ajax_url' => admin_url('admin-ajax.php'),
		'last_training' => $trained_at,
		'has_suggestions' => $has_suggestions,
	];

	wp_localize_script( 'theint-script', 'theint_ja_data', $data );
}

function codeinwp_menu_callback() {
	echo '<div id="theint"></div>';
}

function codeinwp_add_option_menu() {
	$page_hook_suffix = add_submenu_page(
		'woocommerce',
		'The Intelligent', 
		'The Intelligent', 
		'manage_options', 
		'theintelligent', 
		'codeinwp_menu_callback',
	);

	add_action( "admin_print_scripts-{$page_hook_suffix}", 'codeinwp_options_assets' );
}

add_action( 'admin_menu', 'codeinwp_add_option_menu' );


function theint_option_group(){
	return 'theint_options';
}

function theint_options(){
	return [
		'last_updated' => [
			'type'         => 'boolean',
			'show_in_rest' => true,
			'default'      => '',
		],
		'theintAfterCart' => [
			'type'         => 'boolean',
			'show_in_rest' => true,
			'default'      => false,
		],
		'theintAfterCartTable' => [
			'type'         => 'boolean',
			'show_in_rest' => true,
			'default'      => true,
		],
		'intelligentCartNumber' => [
			'type'         => 'integer',
			'show_in_rest' => true,
			'default'      => 3,
		],
		'theintAfterCheckout' => [
			'type'         => 'boolean',
			'show_in_rest' => true,
			'default'      => true,
		],
		'intelligentCheckoutNumber' => [
			'type'         => 'integer',
			'show_in_rest' => true,
			'default'      => 3,
		],
		'theintelligent_after_cart_table_title' => [
			'type'         => 'string',
			'show_in_rest' => true,
			'default'      => 'Recommended products for you',
		],
		'theintelligent_exclude_out_of_stock' => [
			'type'         => 'boolean',
			'show_in_rest' => true,
			'default'      => false,
		],
		'theintelligent_related_products' => [
			'type'         => 'boolean',
			'show_in_rest' => true,
			'default'      => false,
		],
	];
}


function codeinwp_register_settings() {
	
	foreach( theint_options() as $key => $value ) {
		register_setting(
			theint_option_group(),
			$key,
			$value
		);
	}
	
}

add_action( 'init', 'codeinwp_register_settings' );

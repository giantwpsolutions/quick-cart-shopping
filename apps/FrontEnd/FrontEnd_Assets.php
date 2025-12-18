<?php
/**
 * Front End Assets Manager
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd;

use QuickCartShopping\Traits\SingletonTrait;
use QuickCartShopping\FrontEnd\SettingsProvider;

class FrontEnd_Assets{

    use SingletonTrait;

    /**
     * Constructor
     */
    public function __construct(){
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
        add_filter( 'script_loader_tag', [ $this, 'add_type_module' ], 10, 2 );
    }

    /**
     * Enqueue frontend scripts and styles
     *
     * @return void
     */
    public function enqueue_frontend_assets(){
        // Check if Quick Cart Shopping is enabled
        if ( ! SettingsProvider::is_enabled() ) {
            return;
        }

        $plugin_url = plugin_dir_url( dirname( dirname( __FILE__ ) ) );
        $plugin_version = defined( 'QUICK_CART_SHOPPING_VERSION' ) ? QUICK_CART_SHOPPING_VERSION : '1.0.0';

        // Enqueue CSS
        wp_enqueue_style(
            'qc-cart-toggle',
            $plugin_url . 'assets/frontend/css/cart-toggle.css',
            [],
            $plugin_version
        );

        wp_enqueue_style(
            'qc-cart-panel',
            $plugin_url . 'assets/frontend/css/cart-panel.css',
            [],
            $plugin_version
        );

        wp_enqueue_style(
            'qc-variable-popup',
            $plugin_url . 'assets/frontend/css/variable-product-popup.css',
            [],
            $plugin_version
        );

        // Enqueue WooCommerce variation scripts (required for variable products)
        if ( class_exists( 'WooCommerce' ) ) {
            wp_enqueue_script( 'wc-add-to-cart-variation' );
        }

        // Enqueue JavaScript as ES6 module
        wp_enqueue_script(
            'qc-cart-main',
            $plugin_url . 'assets/frontend/main.js',
            [ 'jquery' ], // Add jQuery as dependency
            $plugin_version,
            [ 'in_footer' => true, 'strategy' => 'defer' ]
        );

        // Localize script with settings data
        wp_localize_script(
            'qc-cart-main',
            'qcShoppingData',
            SettingsProvider::get_all_settings()
        );
    }

    /**
     * Add type="module" attribute to main script
     *
     * @param string $tag Script tag HTML
     * @param string $handle Script handle
     * @return string Modified script tag
     */
    public function add_type_module( $tag, $handle ) {
        if ( 'qc-cart-main' === $handle ) {
            $tag = str_replace( '<script ', '<script type="module" ', $tag );
        }
        return $tag;
    }
}

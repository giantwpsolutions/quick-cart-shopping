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
    }

    /**
     * Enqueue frontend scripts and styles
     *
     * @return void
     */
    public function enqueue_frontend_assets(){
        // Debug: Always enqueue for now
        // if ( ! SettingsProvider::is_enabled() ) {
        //     return;
        // }

        $plugin_url = plugin_dir_url( dirname( dirname( __FILE__ ) ) );
        $plugin_version = defined( 'QUICK_CART_SHOPPING_VERSION' ) ? QUICK_CART_SHOPPING_VERSION : '1.0.0';

        // Enqueue CSS
        wp_enqueue_style(
            'qc-cart-toggle',
            $plugin_url . 'assets/frontend/css/cart-toggle.css',
            [],
            $plugin_version
        );

        // Enqueue JavaScript as ES6 module
        wp_enqueue_script(
            'qc-cart-main',
            $plugin_url . 'assets/frontend/main.js',
            [],
            $plugin_version,
            [ 'in_footer' => true, 'strategy' => 'defer' ]
        );

        // Add type="module" attribute
        add_filter( 'script_loader_tag', function( $tag, $handle ) {
            if ( 'qc-cart-main' === $handle ) {
                $tag = str_replace( '<script ', '<script type="module" ', $tag );
            }
            return $tag;
        }, 10, 2 );

        // Localize script with settings data
        wp_localize_script(
            'qc-cart-main',
            'qcShoppingData',
            SettingsProvider::get_all_settings()
        );
    }
}

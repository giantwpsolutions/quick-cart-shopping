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
        $plugin_version = QCSHOP_VERSION;

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

        // Add dynamic CSS for cart settings
        $this->add_cart_dynamic_css();

        wp_enqueue_style(
            'qc-variable-popup',
            $plugin_url . 'assets/frontend/css/variable-product-popup.css',
            [],
            $plugin_version
        );

        // Add dynamic CSS for variation popup settings
        $this->add_variation_popup_dynamic_css();

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

    /**
     * Add dynamic CSS for cart settings
     *
     * @return void
     */
    private function add_cart_dynamic_css() {
        $settings = SettingsProvider::get_cart_settings();

        $css = "
        .qc-cart-coupon-btn {
            background-color: " . esc_attr( $settings['couponBtnBgColor'] ) . " !important;
            color: " . esc_attr( $settings['couponBtnTextColor'] ) . " !important;
        }

        .qc-cart-coupon-btn:hover {
            background-color: " . esc_attr( $settings['couponBtnBgColor'] ) . " !important;
            opacity: 0.9;
        }

        .qc-cart-checkout-btn {
            background-color: " . esc_attr( $settings['checkoutBtnBgColor'] ) . " !important;
            color: " . esc_attr( $settings['checkoutBtnTextColor'] ) . " !important;
        }

        .qc-cart-checkout-btn:hover {
            background-color: " . esc_attr( $settings['checkoutBtnBgColor'] ) . " !important;
            opacity: 0.9;
        }

        .qc-cart-view-cart-btn {
            background-color: " . esc_attr( $settings['viewCartBtnBgColor'] ) . " !important;
            color: " . esc_attr( $settings['viewCartBtnTextColor'] ) . " !important;
        }

        .qc-cart-view-cart-btn:hover {
            background-color: " . esc_attr( $settings['viewCartBtnBgColor'] ) . " !important;
            opacity: 0.9;
        }
        ";

        wp_add_inline_style( 'qc-cart-panel', $css );
    }

    /**
     * Add dynamic CSS for variation popup settings
     *
     * @return void
     */
    private function add_variation_popup_dynamic_css() {
        $settings = SettingsProvider::get_variation_popup_settings();

        $css = "
        .qc-variable-popup {
            max-width: " . absint( $settings['popupWidth'] ) . "px !important;
        }

        .qc-variable-close {
            background: " . esc_attr( $settings['closeButtonBgColor'] ) . " !important;
        }

        .qc-variable-close svg {
            stroke: " . esc_attr( $settings['closeButtonIconColor'] ) . " !important;
        }

        .qc-variable-form .single_add_to_cart_button {
            background: " . esc_attr( $settings['addToCartButtonBgColor'] ) . " !important;
            color: " . esc_attr( $settings['addToCartButtonTextColor'] ) . " !important;
        }

        .qc-variable-form .single_add_to_cart_button:hover {
            background: " . esc_attr( $settings['addToCartButtonBgColor'] ) . " !important;
            opacity: 0.9;
        }

        .qc-variable-form .single_add_to_cart_button:disabled:hover {
            background: " . esc_attr( $settings['addToCartButtonBgColor'] ) . " !important;
        }
        ";

        wp_add_inline_style( 'qc-variable-popup', $css );
    }
}

<?php
/**
 * Settings Provider
 *
 * Fetches and formats plugin settings for frontend use
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd;

use QuickCartShopping\Traits\SingletonTrait;

class SettingsProvider{

    use SingletonTrait;

    /**
     * Get all frontend settings
     *
     * @return array
     */
    public static function get_all_settings(){
        return [
            'general' => self::get_general_settings(),
            'toggle' => self::get_toggle_settings(),
            'layout' => self::get_layout_settings(),
            'cart' => self::get_cart_settings(),
            'checkout' => self::get_checkout_settings(),
            'variationPopup' => self::get_variation_popup_settings(),
            'upsell' => self::get_upsell_settings(),
            'meta' => self::get_meta_data(),
            'i18n' => self::get_translations(),
        ];
    }

    /**
     * Get general settings
     *
     * @return array
     */
    public static function get_general_settings(){
        $settings = get_option( 'qcshopping_general_settings', [] );

        $defaults = [
            'enableQuickCart' => true,
            'enableVarProduct' => true,
            'enableDragAndDrop' => true,
            'enableDirectCheckout' => true,
        ];

        return wp_parse_args( $settings, $defaults );
    }

    /**
     * Get toggle settings
     *
     * @return array
     */
    public static function get_toggle_settings(){
        $settings = get_option( 'qcshopping_toggle_settings', [] );

        $defaults = [
            'iconPosition' => 'bottom-right',
            'iconStyle' => 'cart',
            'iconSize' => 60,
            'showBadge' => true,
            'badgeBgColor' => '#3498db',
            'badgeTextColor' => '#ffffff',
            'iconBgColor' => '#05291B',
            'iconColor' => '#ffffff',
            'hideOnPages' => [],
            'borderShape' => 'circle',
            'offsetTop' => 20,
            'offsetBottom' => 20,
            'offsetLeft' => 20,
            'offsetRight' => 20,
        ];

        return wp_parse_args( $settings, $defaults );
    }

    /**
     * Get layout settings
     *
     * @return array
     */
    public static function get_layout_settings(){
        $settings = get_option( 'qcshopping_layout_settings', [] );

        $defaults = [
            'cartOption' => 'side',
            'cartWidth' => 650,
            'animation' => 'slide',
        ];

        return wp_parse_args( $settings, $defaults );
    }

    /**
     * Get cart settings
     *
     * @return array
     */
    public static function get_cart_settings(){
        $settings = get_option( 'qcshopping_cart_settings', [] );

        $defaults = [
            'showShipping' => true,
            'showCouponField' => true,
            'couponBtnBgColor' => '#05291B',
            'couponBtnTextColor' => '#ffffff',
            'checkoutBtnBgColor' => '#05291B',
            'checkoutBtnTextColor' => '#ffffff',
            'viewCartBtnBgColor' => '#ffffff',
            'viewCartBtnTextColor' => '#05291B',
            'showCheckoutBtn' => true,
        ];

        return wp_parse_args( $settings, $defaults );
    }

    /**
     * Get checkout settings
     *
     * @return array
     */
    public static function get_checkout_settings(){
        $settings = get_option( 'qcshopping_checkout_settings', [] );

        $defaults = [
            'enableStep1' => true,
            'step1Label' => 'Order Review',
            'enableStep2' => true,
            'step2Label' => 'Billing & Shipping',
            'enableStep3' => true,
            'step3Label' => 'Payment',
            'progressBarStyle' => 'style1',
            'progressBarColor' => '#05291B',
            'progressLabelTextColor' => '#ffffff',
            'progressLabelBgColor' => '#3498db',
            'nextBtnBgColor' => '#05291B',
            'nextBtnTextColor' => '#ffffff',
            'previousBtnBgColor' => '#6b7280',
            'previousBtnTextColor' => '#ffffff',
            'backToCartBtnBgColor' => '#e5e7eb',
            'backToCartBtnTextColor' => '#374151',
        ];

        return wp_parse_args( $settings, $defaults );
    }

    /**
     * Get variation popup settings
     *
     * @return array
     */
    public static function get_variation_popup_settings(){
        $settings = get_option( 'qcshopping_variation_popup_settings', [] );

        $defaults = [
            'closeButtonBgColor' => '#f5f5f5',
            'closeButtonIconColor' => '#666666',
            'popupWidth' => 1000,
            'addToCartButtonBgColor' => '#05291B',
            'addToCartButtonTextColor' => '#ffffff',
        ];

        return wp_parse_args( $settings, $defaults );
    }

    /**
     * Get upsell settings
     *
     * @return array
     */
    public static function get_upsell_settings(){
        $settings = get_option( 'qcshopping_general_settings', [] );

        $defaults = [
            'showUpsellProducts' => false,
            'upsellProducts' => [],
        ];

        return wp_parse_args( $settings, $defaults );
    }

    /**
     * Get meta data (URLs, nonce, etc.)
     *
     * @return array
     */
    public static function get_meta_data(){
        return [
            'pluginUrl' => plugin_dir_url( dirname( dirname( __FILE__ ) ) ),
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'restUrl' => esc_url_raw( rest_url( 'quick-cart-shopping/v2/' ) ),
            'nonce' => wp_create_nonce( 'qcshopping_nonce' ),
            'currentPageId' => get_the_ID(),
            'isAdmin' => is_admin(),
            'isUserLoggedIn' => is_user_logged_in(),
            'placeholderImage' => wc_placeholder_img_src(),
            'checkoutUrl' => class_exists( 'WooCommerce' ) ? wc_get_checkout_url() : '/checkout',
            'cartUrl' => class_exists( 'WooCommerce' ) ? wc_get_cart_url() : '/cart',
        ];
    }

    /**
     * Get translation strings for frontend
     *
     * @return array
     */
    public static function get_translations(){
        return [
            'shoppingCart' => __( 'Shopping Cart', 'quick-cart-shopping' ),
            'closeCart' => __( 'Close cart', 'quick-cart-shopping' ),
            'emptyCartTitle' => __( 'Your cart is empty', 'quick-cart-shopping' ),
            'emptyCartSubtext' => __( 'Add some products to get started!', 'quick-cart-shopping' ),
            'product' => __( 'Product', 'quick-cart-shopping' ),
            'price' => __( 'Price', 'quick-cart-shopping' ),
            'quantity' => __( 'Quantity', 'quick-cart-shopping' ),
            'subtotal' => __( 'Subtotal', 'quick-cart-shopping' ),
            'removeItem' => __( 'Remove item', 'quick-cart-shopping' ),
            'subtotalLabel' => __( 'Subtotal:', 'quick-cart-shopping' ),
            'shipping' => __( 'Shipping:', 'quick-cart-shopping' ),
            'calculatedAtCheckout' => __( 'Calculated at checkout', 'quick-cart-shopping' ),
            'flatRate' => __( 'Flat rate:', 'quick-cart-shopping' ),
            'localPickup' => __( 'Local pickup', 'quick-cart-shopping' ),
            'shippingTo' => __( 'Shipping to', 'quick-cart-shopping' ),
            'shippingLocation' => __( 'your location', 'quick-cart-shopping' ),
            'total' => __( 'Total:', 'quick-cart-shopping' ),
            'couponCode' => __( 'Coupon code', 'quick-cart-shopping' ),
            'apply' => __( 'Apply', 'quick-cart-shopping' ),
            'proceedToCheckout' => __( 'Proceed to Checkout', 'quick-cart-shopping' ),
            'viewCart' => __( 'View Cart', 'quick-cart-shopping' ),
            'emptyCart' => __( 'Empty Cart', 'quick-cart-shopping' ),
            // Multi-step checkout translations
            'loading' => __( 'Loading...', 'quick-cart-shopping' ),
            'backToCart' => __( 'Back to Cart', 'quick-cart-shopping' ),
            'previous' => __( 'Previous', 'quick-cart-shopping' ),
            'next' => __( 'Next', 'quick-cart-shopping' ),
            'placeOrder' => __( 'Place Order', 'quick-cart-shopping' ),
        ];
    }

    /**
     * Check if current page should hide toggle
     *
     * @return bool
     */
    public static function should_hide_toggle(){
        $toggle_settings = self::get_toggle_settings();
        $current_page_id = get_the_ID();

        // Check if current page is in hideOnPages array
        if ( ! empty( $toggle_settings['hideOnPages'] ) && is_array( $toggle_settings['hideOnPages'] ) ) {
            return in_array( $current_page_id, $toggle_settings['hideOnPages'], true );
        }

        return false;
    }

    /**
     * Check if quick cart is enabled
     *
     * @return bool
     */
    public static function is_enabled(){
        $general_settings = self::get_general_settings();
        return isset( $general_settings['enableQuickCart'] ) && $general_settings['enableQuickCart'];
    }
}

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
        $settings = get_option( 'quick_cart_general_settings', [] );

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
        $settings = get_option( 'quick_cart_toggle_settings', [] );

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
        ];

        return wp_parse_args( $settings, $defaults );
    }

    /**
     * Get layout settings
     *
     * @return array
     */
    public static function get_layout_settings(){
        $settings = get_option( 'quick_cart_layout_settings', [] );

        $defaults = [
            'cartOption' => 'side',
            'cartWidth' => 400,
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
        $settings = get_option( 'quick_cart_cart_settings', [] );

        $defaults = [
            'showShipping' => true,
            'showCouponField' => true,
            'checkoutBtnBgColor' => '#05291B',
            'checkoutBtnTextColor' => '#ffffff',
            'showCheckoutBtn' => true,
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
            'nonce' => wp_create_nonce( 'qc_shopping_nonce' ),
            'currentPageId' => get_the_ID(),
            'isAdmin' => is_admin(),
            'isUserLoggedIn' => is_user_logged_in(),
            'placeholderImage' => wc_placeholder_img_src(),
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
            'couponCode' => __( 'Coupon code', 'quick-cart-shopping' ),
            'apply' => __( 'Apply', 'quick-cart-shopping' ),
            'proceedToCheckout' => __( 'Proceed to Checkout', 'quick-cart-shopping' ),
            'viewCart' => __( 'View Cart', 'quick-cart-shopping' ),
            'emptyCart' => __( 'Empty Cart', 'quick-cart-shopping' ),
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

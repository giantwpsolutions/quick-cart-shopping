<?php
/**
 * Cart Settings Data Sanitization Helper.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Helper\Sanitization;

defined('ABSPATH') || exit;

/**
 * Cart Data Sanitization Helper Class
 */
class CartDataSanitization
{
    /**
     * Sanitize cart settings data.
     *
     * @param array $data The raw cart settings data.
     * @return array The sanitized data.
     */
    public static function sanitize_cart_settings( $data )
    {
        if ( !is_array( $data ) ) {
            return [];
        }

        return [
            'id'                   => sanitize_text_field( $data['id'] ?? time() ),
            'createdAt'            => sanitize_text_field( $data['createdAt'] ?? current_time('c') ),
            'status'               => isset( $data['status'] ) && in_array( $data['status'], ['on', 'off'] ) ? $data['status'] : 'on',
            'showShipping'         => isset( $data['showShipping'] ) ? (bool) $data['showShipping'] : true,
            'showCouponField'      => isset( $data['showCouponField'] ) ? (bool) $data['showCouponField'] : true,
            'couponBtnBgColor'     => self::sanitize_color( $data['couponBtnBgColor'] ?? '#05291B' ),
            'couponBtnTextColor'   => self::sanitize_color( $data['couponBtnTextColor'] ?? '#ffffff' ),
            'checkoutBtnBgColor'   => self::sanitize_color( $data['checkoutBtnBgColor'] ?? '#05291B' ),
            'checkoutBtnTextColor' => self::sanitize_color( $data['checkoutBtnTextColor'] ?? '#ffffff' ),
            'viewCartBtnBgColor'   => self::sanitize_color( $data['viewCartBtnBgColor'] ?? '#ffffff' ),
            'viewCartBtnTextColor' => self::sanitize_color( $data['viewCartBtnTextColor'] ?? '#05291B' ),
            'showCheckoutBtn'      => isset( $data['showCheckoutBtn'] ) ? (bool) $data['showCheckoutBtn'] : true,
        ];
    }

    /**
     * Sanitize color value (hex or rgba)
     *
     * @param string $color Color value
     * @return string Sanitized color
     */
    private static function sanitize_color( $color )
    {
        // Remove any whitespace
        $color = trim( $color );

        // Check if it's a valid hex color
        if ( preg_match( '/^#[a-fA-F0-9]{6}$/', $color ) || preg_match( '/^#[a-fA-F0-9]{3}$/', $color ) ) {
            return $color;
        }

        // Check if it's a valid rgba color
        if ( preg_match( '/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/', $color ) ) {
            return $color;
        }

        // Return default if invalid
        return '#000000';
    }
}

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
            'couponBtnBgColor'     => sanitize_text_field( $data['couponBtnBgColor'] ?? '#05291B' ),
            'couponBtnTextColor'   => sanitize_text_field( $data['couponBtnTextColor'] ?? '#ffffff' ),
            'checkoutBtnBgColor'   => sanitize_text_field( $data['checkoutBtnBgColor'] ?? '#05291B' ),
            'checkoutBtnTextColor' => sanitize_text_field( $data['checkoutBtnTextColor'] ?? '#ffffff' ),
            'showCheckoutBtn'      => isset( $data['showCheckoutBtn'] ) ? (bool) $data['showCheckoutBtn'] : true,
        ];
    }
}

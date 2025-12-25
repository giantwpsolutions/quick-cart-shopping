<?php
/**
 * Coupon Handler
 *
 * Handles coupon operations via AJAX
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Cart;

defined('ABSPATH') || exit;

class CouponHandler {

    /**
     * Apply coupon code
     *
     * @return void
     */
    public static function apply_coupon() {
        check_ajax_referer( 'qcshopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        $coupon_code = isset( $_POST['coupon_code'] ) ? sanitize_text_field( wp_unslash( $_POST['coupon_code'] ) ) : '';

        if ( empty( $coupon_code ) ) {
            wp_send_json_error( [ 'message' => 'Please enter a coupon code' ] );
        }

        // Apply the coupon
        $result = WC()->cart->apply_coupon( $coupon_code );

        if ( $result ) {
            // Calculate cart totals
            WC()->cart->calculate_totals();

            // Get discount amount
            $discount_total = WC()->cart->get_discount_total();
            $discount_tax = WC()->cart->get_discount_tax();
            $total_discount = $discount_total + $discount_tax;

            wp_send_json_success( [
                'message' => 'Coupon applied successfully!',
                'coupon_code' => $coupon_code,
                'discount' => wc_price( $total_discount ),
                'cart_totals' => [
                    'subtotal' => WC()->cart->get_cart_subtotal(),
                    'total' => WC()->cart->get_cart_total(),
                ]
            ] );
        } else {
            // Get WooCommerce error messages
            $notices = wc_get_notices( 'error' );
            $error_message = 'Invalid coupon code';

            if ( ! empty( $notices ) ) {
                $error_message = reset( $notices )['notice'];
            }

            // Clear notices
            wc_clear_notices();

            wp_send_json_error( [ 'message' => $error_message ] );
        }
    }

    /**
     * Remove coupon code
     *
     * @return void
     */
    public static function remove_coupon() {
        check_ajax_referer( 'qcshopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        $coupon_code = isset( $_POST['coupon_code'] ) ? sanitize_text_field( wp_unslash( $_POST['coupon_code'] ) ) : '';

        if ( empty( $coupon_code ) ) {
            wp_send_json_error( [ 'message' => 'Please provide a coupon code to remove' ] );
        }

        // Remove the coupon
        $result = WC()->cart->remove_coupon( $coupon_code );

        if ( $result ) {
            // Calculate cart totals
            WC()->cart->calculate_totals();

            wp_send_json_success( [
                'message' => 'Coupon removed successfully!',
                'coupon_code' => $coupon_code,
            ] );
        } else {
            wp_send_json_error( [ 'message' => 'Failed to remove coupon' ] );
        }
    }
}

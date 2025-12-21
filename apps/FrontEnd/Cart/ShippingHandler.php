<?php
/**
 * Shipping Handler
 *
 * Handles shipping method updates via AJAX
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Cart;

defined('ABSPATH') || exit;

class ShippingHandler {

    /**
     * Update shipping method
     *
     * @return void
     */
    public static function update_shipping_method() {
        check_ajax_referer( 'qcshopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        $shipping_method = isset( $_POST['shipping_method'] ) ? sanitize_text_field( $_POST['shipping_method'] ) : '';

        if ( empty( $shipping_method ) ) {
            wp_send_json_error( [ 'message' => 'Please select a shipping method' ] );
        }

        // Update chosen shipping method
        WC()->session->set( 'chosen_shipping_methods', [ $shipping_method ] );

        // Recalculate cart totals
        WC()->cart->calculate_totals();

        wp_send_json_success( [
            'message' => 'Shipping method updated successfully!',
            'shipping_method' => $shipping_method,
        ] );
    }
}

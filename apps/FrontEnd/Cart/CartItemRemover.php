<?php
/**
 * Cart Item Remover
 *
 * Handles removing cart items via AJAX
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Cart;

defined('ABSPATH') || exit;

class CartItemRemover {

    /**
     * Remove cart item via AJAX
     *
     * @return void
     */
    public static function remove_cart_item() {
        check_ajax_referer( 'qcshopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        $cart_item_key = isset( $_POST['cart_item_key'] ) ? sanitize_text_field( $_POST['cart_item_key'] ) : '';

        if ( empty( $cart_item_key ) ) {
            wp_send_json_error( [ 'message' => 'Invalid cart item' ] );
        }

        $cart = WC()->cart;
        $cart->remove_cart_item( $cart_item_key );
        $cart->calculate_totals();

        wp_send_json_success( [
            'count'    => $cart->get_cart_contents_count(),
            'subtotal' => wc_price( $cart->get_subtotal() ),
            'total'    => wc_price( $cart->get_total( 'edit' ) ),
        ] );
    }
}

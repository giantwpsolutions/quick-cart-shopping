<?php
/**
 * Cart Item Updater
 *
 * Handles updating cart item quantities via AJAX
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Cart;

defined('ABSPATH') || exit;

class CartItemUpdater {

    /**
     * Update cart item quantity via AJAX
     *
     * @return void
     */
    public static function update_cart_item() {
        check_ajax_referer( 'qc_shopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        $cart_item_key = isset( $_POST['cart_item_key'] ) ? sanitize_text_field( $_POST['cart_item_key'] ) : '';
        $quantity = isset( $_POST['quantity'] ) ? absint( $_POST['quantity'] ) : 1;

        if ( empty( $cart_item_key ) ) {
            wp_send_json_error( [ 'message' => 'Invalid cart item' ] );
        }

        $cart = WC()->cart;

        if ( $quantity === 0 ) {
            $cart->remove_cart_item( $cart_item_key );
        } else {
            $cart->set_quantity( $cart_item_key, $quantity, true );
        }

        $cart->calculate_totals();

        wp_send_json_success( [
            'count'    => $cart->get_cart_contents_count(),
            'subtotal' => wc_price( $cart->get_subtotal() ),
            'total'    => wc_price( $cart->get_total( 'edit' ) ),
        ] );
    }
}

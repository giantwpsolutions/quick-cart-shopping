<?php
/**
 * Add to Cart Handler
 *
 * Handles AJAX add to cart operations for variable products
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Cart;

defined('ABSPATH') || exit;

class AddToCartHandler {

    /**
     * AJAX Add to Cart for both simple and variable products
     *
     * @return void
     */
    public static function ajax_add_to_cart() {
        check_ajax_referer( 'qcshopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'error' => 'WooCommerce not active' ] );
        }

        $product_id   = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;
        $variation_id = isset( $_POST['variation_id'] ) ? absint( $_POST['variation_id'] ) : 0;
        $quantity     = isset( $_POST['quantity'] ) ? absint( $_POST['quantity'] ) : 1;

        if ( ! $product_id ) {
            wp_send_json_error( [ 'error' => 'Invalid product' ] );
        }

        $variation_data = [];

        // Get variation attributes from POST if this is a variable product
        if ( $variation_id ) {
            foreach ( $_POST as $key => $value ) {
                if ( strpos( $key, 'attribute_' ) === 0 ) {
                    $variation_data[ $key ] = sanitize_text_field( $value );
                }
            }
        }

        // Validate before adding to cart
        $passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity, $variation_id, $variation_data );

        if ( $passed_validation ) {
            $cart_item_key = WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation_data );

            if ( $cart_item_key ) {
                do_action( 'woocommerce_ajax_added_to_cart', $product_id );

                // Return cart fragments
                if ( class_exists( 'WC_AJAX' ) ) {
                    \WC_AJAX::get_refreshed_fragments();
                } else {
                    wp_send_json_success( [
                        'fragments' => apply_filters( 'woocommerce_add_to_cart_fragments', [] ),
                        'cart_hash' => WC()->cart->get_cart_hash(),
                    ] );
                }
            } else {
                wp_send_json_error( [ 'error' => 'Failed to add to cart' ] );
            }
        } else {
            wp_send_json_error( [ 'error' => 'Product validation failed' ] );
        }
    }
}

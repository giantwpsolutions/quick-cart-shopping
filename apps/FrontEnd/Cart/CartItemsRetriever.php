<?php
/**
 * Cart Items Retriever
 *
 * Handles retrieving cart items via AJAX
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Cart;

defined('ABSPATH') || exit;

class CartItemsRetriever {

    /**
     * Get cart items via AJAX
     *
     * @return void
     */
    public static function get_cart_items() {
        check_ajax_referer( 'qc_shopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        $cart = WC()->cart;

        // Ensure cart totals are calculated before returning data
        $cart->calculate_totals();

        $items = [];
        $subtotal = 0;

        foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) {
            $product = $cart_item['data'];

            if ( ! $product ) {
                continue;
            }

            $items[] = [
                'key'      => $cart_item_key,
                'id'       => $cart_item['product_id'],
                'name'     => $product->get_name(),
                'price'    => wc_price( $product->get_price() ),
                'quantity' => $cart_item['quantity'],
                'subtotal' => wc_price( $cart_item['line_subtotal'] ),
                'image'    => wp_get_attachment_image_url( $product->get_image_id(), 'thumbnail' ) ?: wc_placeholder_img_src(),
                'permalink' => $product->get_permalink(),
            ];

            $subtotal += $cart_item['line_subtotal'];
        }

        // Get applied coupons
        $applied_coupons = [];

        foreach ( $cart->get_applied_coupons() as $coupon_code ) {
            $discount_amount = $cart->get_coupon_discount_amount( $coupon_code );
            $discount_tax = $cart->get_coupon_discount_tax_amount( $coupon_code );
            $total_coupon_discount = $discount_amount + $discount_tax;

            $applied_coupons[] = [
                'code' => $coupon_code,
                'discount' => wc_price( $total_coupon_discount ),
            ];
        }

        // Get available shipping methods
        $shipping_methods = [];
        $packages = WC()->shipping()->get_packages();

        foreach ( $packages as $package ) {
            if ( ! empty( $package['rates'] ) ) {
                foreach ( $package['rates'] as $rate ) {
                    $shipping_methods[] = [
                        'id' => $rate->get_id(),
                        'label' => $rate->get_label(),
                        'cost' => $rate->get_cost(),
                        'cost_formatted' => wc_price( $rate->get_cost() ),
                        'selected' => ( WC()->session->get( 'chosen_shipping_methods' )[0] ?? '' ) === $rate->get_id(),
                    ];
                }
            }
        }

        // Get shipping destination
        $customer = WC()->customer;
        $shipping_destination = '';

        if ( $customer ) {
            $address_parts = array_filter([
                $customer->get_shipping_address_1(),
                $customer->get_shipping_address_2(),
                $customer->get_shipping_city(),
                $customer->get_shipping_state(),
                $customer->get_shipping_postcode(),
                $customer->get_shipping_country(),
            ]);

            if ( ! empty( $address_parts ) ) {
                $shipping_destination = implode( ', ', $address_parts );
            }
        }

        wp_send_json_success( [
            'items'    => $items,
            'count'    => $cart->get_cart_contents_count(),
            'subtotal' => wc_price( $cart->get_subtotal() ),
            'discount_total' => $cart->get_discount_total(),
            'discount_tax' => $cart->get_discount_tax(),
            'shipping_total' => $cart->get_shipping_total(),
            'shipping_tax' => $cart->get_shipping_tax(),
            'cart_contents_tax' => $cart->get_cart_contents_tax(),
            'fee_total' => $cart->get_fee_total(),
            'fee_tax' => $cart->get_fee_tax(),
            'total_tax' => $cart->get_total_tax(),
            'total'    => wc_price( $cart->get_total( 'edit' ) ),
            'total_raw' => $cart->get_total( 'edit' ),
            'coupons'  => $applied_coupons,
            'shipping_methods' => $shipping_methods,
            'shipping_destination' => $shipping_destination,
        ] );
    }
}

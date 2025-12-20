<?php
/**
 * Order Review Renderer
 *
 * Handles rendering of order review step in checkout
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Checkout;

defined('ABSPATH') || exit;

class OrderReviewRenderer {

    /**
     * Render order review (Step 1)
     *
     * @param object $checkout WooCommerce checkout object
     * @return void
     */
    public static function render( $checkout ) {
        echo '<div class="qc-order-review-fields qc-checkout-form">';
        echo '<h3>' . esc_html__( 'Order Review', 'quick-cart-shopping' ) . '</h3>';

        echo '<div class="qc-order-review">';

        // Display cart items
        self::render_cart_items();

        // Display totals
        self::render_cart_totals();

        echo '</div>';

        echo '</div>';
    }

    /**
     * Render cart items table
     *
     * @return void
     */
    private static function render_cart_items() {
        echo '<table class="shop_table woocommerce-checkout-review-order-table">';
        echo '<thead><tr>';
        echo '<th class="product-name">' . esc_html__( 'Product', 'quick-cart-shopping' ) . '</th>';
        echo '<th class="product-total">' . esc_html__( 'Subtotal', 'quick-cart-shopping' ) . '</th>';
        echo '</tr></thead>';
        echo '<tbody>';

        foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
            $_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );

            if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 ) {
                echo '<tr class="cart_item">';
                echo '<td class="product-name">';
                echo wp_kses_post( $_product->get_name() ) . ' <strong class="product-quantity">&times;&nbsp;' . $cart_item['quantity'] . '</strong>';
                echo '</td>';
                echo '<td class="product-total">';
                echo WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] );
                echo '</td>';
                echo '</tr>';
            }
        }

        echo '</tbody>';
    }

    /**
     * Render cart totals (subtotal, shipping, total)
     *
     * @return void
     */
    private static function render_cart_totals() {
        echo '<tfoot>';

        // Subtotal
        echo '<tr class="cart-subtotal">';
        echo '<th>' . esc_html__( 'Subtotal', 'quick-cart-shopping' ) . '</th>';
        echo '<td>' . WC()->cart->get_cart_subtotal() . '</td>';
        echo '</tr>';

        // Shipping
        if ( WC()->cart->needs_shipping() && WC()->cart->show_shipping() ) {
            echo '<tr class="shipping">';
            echo '<th>' . esc_html__( 'Shipping', 'quick-cart-shopping' ) . '</th>';
            echo '<td>' . ( WC()->cart->get_cart_shipping_total() ?: esc_html__( 'Calculated at next step', 'quick-cart-shopping' ) ) . '</td>';
            echo '</tr>';
        }

        // Total
        echo '<tr class="order-total">';
        echo '<th>' . esc_html__( 'Total', 'quick-cart-shopping' ) . '</th>';
        echo '<td><strong>' . WC()->cart->get_total() . '</strong></td>';
        echo '</tr>';

        echo '</tfoot>';
        echo '</table>';
    }
}

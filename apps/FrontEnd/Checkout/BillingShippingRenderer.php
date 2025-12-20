<?php
/**
 * Billing & Shipping Fields Renderer
 *
 * Handles rendering of billing and shipping fields in checkout
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Checkout;

defined('ABSPATH') || exit;

class BillingShippingRenderer {

    /**
     * Render billing and shipping fields (Step 2)
     *
     * @param object $checkout WooCommerce checkout object
     * @return void
     */
    public static function render( $checkout ) {
        echo '<div class="qc-billing-shipping-fields qc-checkout-form">';

        // Billing fields
        self::render_billing_fields( $checkout );

        // Shipping fields
        self::render_shipping_fields( $checkout );

        echo '</div>';
    }

    /**
     * Render billing fields
     *
     * @param object $checkout WooCommerce checkout object
     * @return void
     */
    private static function render_billing_fields( $checkout ) {
        echo '<h3>' . esc_html__( 'Billing Details', 'quick-cart-shopping' ) . '</h3>';

        foreach ( $checkout->get_checkout_fields( 'billing' ) as $key => $field ) {
            woocommerce_form_field( $key, $field, $checkout->get_value( $key ) );
        }
    }

    /**
     * Render shipping fields with toggle checkbox
     *
     * @param object $checkout WooCommerce checkout object
     * @return void
     */
    private static function render_shipping_fields( $checkout ) {
        // Ship to different address checkbox
        echo '<h4 style="margin-top: 20px;">' . esc_html__( 'Shipping Details', 'quick-cart-shopping' ) . '</h4>';
        echo '<p class="form-row form-row-wide ship-to-different-address">';
        echo '<label class="checkbox">';
        echo '<input type="checkbox" class="input-checkbox" id="ship-to-different-address-checkbox" name="ship_to_different_address" value="1" /> ';
        echo esc_html__( 'Ship to a different address?', 'quick-cart-shopping' );
        echo '</label>';
        echo '</p>';

        // Shipping fields (hidden by default)
        echo '<div class="shipping_address" style="display: none;">';
        foreach ( $checkout->get_checkout_fields( 'shipping' ) as $key => $field ) {
            woocommerce_form_field( $key, $field, $checkout->get_value( $key ) );
        }
        echo '</div>';
    }
}

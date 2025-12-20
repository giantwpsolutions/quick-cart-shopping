<?php
/**
 * Payment Method Renderer
 *
 * Handles rendering of payment method fields in checkout
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Checkout;

defined('ABSPATH') || exit;

class PaymentRenderer {

    /**
     * Render payment fields (Step 3)
     *
     * @param object $checkout WooCommerce checkout object
     * @return void
     */
    public static function render( $checkout ) {
        echo '<div class="qc-payment-method-fields qc-checkout-form">';
        echo '<h3>' . esc_html__( 'Payment Method', 'quick-cart-shopping' ) . '</h3>';

        echo '<div class="qc-payment-section">';
        echo '<div id="payment" class="woocommerce-checkout-payment">';

        // Get available payment gateways
        $available_gateways = WC()->payment_gateways->get_available_payment_gateways();

        if ( ! empty( $available_gateways ) ) {
            self::render_payment_methods( $available_gateways );
        } else {
            echo '<p>' . esc_html__( 'No payment methods available.', 'quick-cart-shopping' ) . '</p>';
        }

        echo '</div>';
        echo '</div>';

        echo '</div>';
    }

    /**
     * Render payment method list
     *
     * @param array $available_gateways Available payment gateways
     * @return void
     */
    private static function render_payment_methods( $available_gateways ) {
        echo '<ul class="wc_payment_methods payment_methods methods">';

        foreach ( $available_gateways as $gateway ) {
            self::render_payment_method_item( $gateway );
        }

        echo '</ul>';
    }

    /**
     * Render single payment method item
     *
     * @param object $gateway Payment gateway object
     * @return void
     */
    private static function render_payment_method_item( $gateway ) {
        ?>
        <li class="wc_payment_method payment_method_<?php echo esc_attr( $gateway->id ); ?>">
            <input id="payment_method_<?php echo esc_attr( $gateway->id ); ?>"
                   type="radio"
                   class="input-radio"
                   name="payment_method"
                   value="<?php echo esc_attr( $gateway->id ); ?>"
                   <?php checked( $gateway->chosen, true ); ?> />
            <label for="payment_method_<?php echo esc_attr( $gateway->id ); ?>">
                <?php echo wp_kses_post( $gateway->get_title() ); ?>
                <?php echo wp_kses_post( $gateway->get_icon() ); ?>
            </label>
            <?php if ( $gateway->has_fields() || $gateway->get_description() ) : ?>
                <div class="payment_box payment_method_<?php echo esc_attr( $gateway->id ); ?>" style="display: none;">
                    <?php $gateway->payment_fields(); ?>
                </div>
            <?php endif; ?>
        </li>
        <?php
    }
}

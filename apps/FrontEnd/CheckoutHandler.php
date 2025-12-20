<?php
/**
 * Checkout Handler - AJAX operations for multi-step checkout
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd;

use QuickCartShopping\Traits\SingletonTrait;
use QuickCartShopping\FrontEnd\Checkout\OrderReviewRenderer;
use QuickCartShopping\FrontEnd\Checkout\BillingShippingRenderer;
use QuickCartShopping\FrontEnd\Checkout\PaymentRenderer;

class CheckoutHandler {

    use SingletonTrait;

    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'wp_ajax_qc_get_checkout_fields', [ $this, 'get_checkout_fields' ] );
        add_action( 'wp_ajax_nopriv_qc_get_checkout_fields', [ $this, 'get_checkout_fields' ] );

        add_action( 'wp_ajax_qc_process_checkout', [ $this, 'process_checkout' ] );
        add_action( 'wp_ajax_nopriv_qc_process_checkout', [ $this, 'process_checkout' ] );

        add_action( 'wp_ajax_qc_save_checkout_address', [ $this, 'save_checkout_address' ] );
        add_action( 'wp_ajax_nopriv_qc_save_checkout_address', [ $this, 'save_checkout_address' ] );
    }

    /**
     * Get checkout fields via AJAX
     */
    public function get_checkout_fields() {
        check_ajax_referer( 'qc_shopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        $field_type = isset( $_POST['field_type'] ) ? sanitize_text_field( $_POST['field_type'] ) : 'billing';

        WC()->frontend_includes();
        $checkout = WC()->checkout();

        ob_start();

        switch ( $field_type ) {
            case 'review':
                OrderReviewRenderer::render( $checkout );
                break;
            case 'billing':
                BillingShippingRenderer::render( $checkout );
                break;
            case 'payment':
                PaymentRenderer::render( $checkout );
                break;
        }

        $html = ob_get_clean();
        wp_send_json_success( $html );
    }

    /**
     * Process checkout via AJAX
     */
    public function process_checkout() {
        check_ajax_referer( 'qc_shopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        WC()->frontend_includes();

        if ( ! defined( 'WOOCOMMERCE_CHECKOUT' ) ) {
            define( 'WOOCOMMERCE_CHECKOUT', true );
        }

        $checkout = WC()->checkout();

        try {
            $data = $this->sanitize_checkout_data( $_POST );

            // Validate required fields
            $this->validate_required_fields( $data );

            // Create order
            $order_id = $checkout->create_order( $data );

            if ( is_wp_error( $order_id ) ) {
                throw new \Exception( $order_id->get_error_message() );
            }

            $order = wc_get_order( $order_id );

            if ( ! $order ) {
                throw new \Exception( 'Failed to create order' );
            }

            // Process payment
            $payment_result = $this->process_payment( $order_id, $data );

            wp_send_json_success( [
                'message' => 'Order placed successfully!',
                'redirect' => $payment_result['redirect'],
                'order_id' => $order_id,
            ] );

        } catch ( \Exception $e ) {
            wp_send_json_error( [ 'message' => $e->getMessage() ] );
        }
    }

    /**
     * Validate required fields
     */
    private function validate_required_fields( $data ) {
        $required_fields = [ 'billing_first_name', 'billing_last_name', 'billing_email' ];

        foreach ( $required_fields as $field ) {
            if ( empty( $data[ $field ] ) ) {
                throw new \Exception( sprintf( 'Field %s is required', $field ) );
            }
        }
    }

    /**
     * Sanitize checkout data
     */
    private function sanitize_checkout_data( $post_data ) {
        $data = [];

        foreach ( $post_data as $key => $value ) {
            if ( $this->is_checkout_field( $key ) ) {
                $data[ $key ] = sanitize_text_field( $value );
            }
        }

        return $data;
    }

    /**
     * Check if field is a checkout field
     */
    private function is_checkout_field( $key ) {
        $valid_prefixes = [ 'billing_', 'shipping_' ];
        $valid_keys = [ 'payment_method', 'terms', 'ship_to_different_address' ];

        foreach ( $valid_prefixes as $prefix ) {
            if ( strpos( $key, $prefix ) === 0 ) {
                return true;
            }
        }

        return in_array( $key, $valid_keys, true );
    }

    /**
     * Process payment
     */
    private function process_payment( $order_id, $data ) {
        $available_gateways = WC()->payment_gateways->get_available_payment_gateways();
        $payment_method = isset( $data['payment_method'] ) ? $data['payment_method'] : '';

        if ( ! isset( $available_gateways[ $payment_method ] ) ) {
            wp_send_json_error( [ 'message' => 'Invalid payment method' ] );
        }

        $payment_result = $available_gateways[ $payment_method ]->process_payment( $order_id );

        if ( ! isset( $payment_result['result'] ) || $payment_result['result'] !== 'success' ) {
            wp_send_json_error( [ 'message' => 'Payment processing failed' ] );
        }

        return $payment_result;
    }

    /**
     * Save checkout address to WooCommerce customer session
     * This allows shipping rates to be recalculated based on the entered address
     */
    public function save_checkout_address() {
        check_ajax_referer( 'qc_shopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        WC()->frontend_includes();

        $customer = WC()->customer;
        if ( ! $customer ) {
            wp_send_json_error( [ 'message' => 'Customer session not available' ] );
        }

        // Billing address fields
        $billing_fields = [
            'billing_first_name' => 'set_billing_first_name',
            'billing_last_name' => 'set_billing_last_name',
            'billing_company' => 'set_billing_company',
            'billing_address_1' => 'set_billing_address_1',
            'billing_address_2' => 'set_billing_address_2',
            'billing_city' => 'set_billing_city',
            'billing_state' => 'set_billing_state',
            'billing_postcode' => 'set_billing_postcode',
            'billing_country' => 'set_billing_country',
            'billing_email' => 'set_billing_email',
            'billing_phone' => 'set_billing_phone',
        ];

        // Shipping address fields
        $shipping_fields = [
            'shipping_first_name' => 'set_shipping_first_name',
            'shipping_last_name' => 'set_shipping_last_name',
            'shipping_company' => 'set_shipping_company',
            'shipping_address_1' => 'set_shipping_address_1',
            'shipping_address_2' => 'set_shipping_address_2',
            'shipping_city' => 'set_shipping_city',
            'shipping_state' => 'set_shipping_state',
            'shipping_postcode' => 'set_shipping_postcode',
            'shipping_country' => 'set_shipping_country',
        ];

        // Update billing address
        foreach ( $billing_fields as $field => $method ) {
            if ( isset( $_POST[ $field ] ) && method_exists( $customer, $method ) ) {
                $customer->$method( sanitize_text_field( $_POST[ $field ] ) );
            }
        }

        // Check if shipping to different address
        $ship_to_different = isset( $_POST['ship_to_different_address'] ) && $_POST['ship_to_different_address'];

        if ( $ship_to_different ) {
            // Update shipping address with provided shipping fields
            foreach ( $shipping_fields as $field => $method ) {
                if ( isset( $_POST[ $field ] ) && method_exists( $customer, $method ) ) {
                    $customer->$method( sanitize_text_field( $_POST[ $field ] ) );
                }
            }
        } else {
            // Copy billing address to shipping address
            $customer->set_shipping_first_name( $customer->get_billing_first_name() );
            $customer->set_shipping_last_name( $customer->get_billing_last_name() );
            $customer->set_shipping_company( $customer->get_billing_company() );
            $customer->set_shipping_address_1( $customer->get_billing_address_1() );
            $customer->set_shipping_address_2( $customer->get_billing_address_2() );
            $customer->set_shipping_city( $customer->get_billing_city() );
            $customer->set_shipping_state( $customer->get_billing_state() );
            $customer->set_shipping_postcode( $customer->get_billing_postcode() );
            $customer->set_shipping_country( $customer->get_billing_country() );
        }

        // Save customer data
        $customer->save();

        // Recalculate shipping based on new address
        WC()->cart->calculate_shipping();
        WC()->cart->calculate_totals();

        wp_send_json_success( [
            'message' => 'Address saved successfully',
            'customer_data' => [
                'billing' => $customer->get_billing(),
                'shipping' => $customer->get_shipping(),
            ],
        ] );
    }
}

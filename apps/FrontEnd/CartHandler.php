<?php
/**
 * Cart Handler - AJAX operations for cart
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd;

use QuickCartShopping\Traits\SingletonTrait;

class CartHandler {

    use SingletonTrait;

    /**
     * Constructor
     */
    public function __construct() {
        // AJAX actions for logged in and non-logged in users
        add_action( 'wp_ajax_qc_get_cart_items', [ $this, 'get_cart_items' ] );
        add_action( 'wp_ajax_nopriv_qc_get_cart_items', [ $this, 'get_cart_items' ] );

        add_action( 'wp_ajax_qc_update_cart_item', [ $this, 'update_cart_item' ] );
        add_action( 'wp_ajax_nopriv_qc_update_cart_item', [ $this, 'update_cart_item' ] );

        add_action( 'wp_ajax_qc_remove_cart_item', [ $this, 'remove_cart_item' ] );
        add_action( 'wp_ajax_nopriv_qc_remove_cart_item', [ $this, 'remove_cart_item' ] );

        add_action( 'wp_ajax_qc_get_variable_product', [ $this, 'get_variable_product' ] );
        add_action( 'wp_ajax_nopriv_qc_get_variable_product', [ $this, 'get_variable_product' ] );

        add_action( 'wp_ajax_woocommerce_ajax_add_to_cart', [ $this, 'ajax_add_to_cart' ] );
        add_action( 'wp_ajax_nopriv_woocommerce_ajax_add_to_cart', [ $this, 'ajax_add_to_cart' ] );
    }

    /**
     * Get cart items via AJAX
     */
    public function get_cart_items() {
        check_ajax_referer( 'qc_shopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        $cart = WC()->cart;
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

        wp_send_json_success( [
            'items'    => $items,
            'count'    => $cart->get_cart_contents_count(),
            'subtotal' => wc_price( $subtotal ),
            'total'    => wc_price( $cart->get_total( 'edit' ) ),
        ] );
    }

    /**
     * Update cart item quantity via AJAX
     */
    public function update_cart_item() {
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

    /**
     * Remove cart item via AJAX
     */
    public function remove_cart_item() {
        check_ajax_referer( 'qc_shopping_nonce', 'nonce' );

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

    /**
     * Get variable product data via AJAX
     */
    public function get_variable_product() {
        check_ajax_referer( 'qc_shopping_nonce', 'nonce' );

        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'message' => 'WooCommerce not active' ] );
        }

        $product_id = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;

        if ( ! $product_id ) {
            wp_send_json_error( [ 'message' => 'Invalid product ID' ] );
        }

        $variable_product = wc_get_product( $product_id );

        if ( ! $variable_product || ! $variable_product->is_type( 'variable' ) ) {
            wp_send_json_error( [ 'message' => 'Product not found or not variable' ] );
        }

        // Get product image
        $image_id = $variable_product->get_image_id();
        $image_url = $image_id ? wp_get_attachment_image_url( $image_id, 'full' ) : wc_placeholder_img_src();

        // Get gallery images
        $gallery_ids = $variable_product->get_gallery_image_ids();
        $gallery_images = [];

        // Add main image first
        if ( $image_id ) {
            $gallery_images[] = [
                'url' => $image_url,
                'id'  => $image_id,
            ];
        }

        // Add gallery images
        foreach ( $gallery_ids as $gallery_id ) {
            $gallery_url = wp_get_attachment_image_url( $gallery_id, 'full' );
            if ( $gallery_url ) {
                $gallery_images[] = [
                    'url' => $gallery_url,
                    'id'  => $gallery_id,
                ];
            }
        }

        // Store product data before modifying globals
        $product_data = [
            'id'                => $variable_product->get_id(),
            'name'              => $variable_product->get_name(),
            'price'             => $variable_product->get_price_html(),
            'short_description' => $variable_product->get_short_description(),
            'image'             => $image_url,
            'gallery_images'    => $gallery_images,
        ];

        // Set up global post and product for template rendering
        global $post, $product;

        // Store original values
        $original_post = $post;
        $original_product = $product;

        // Set globals for template
        $post = get_post( $product_id );
        $product = $variable_product;

        // Setup post data
        setup_postdata( $post );

        // Get variations form HTML
        ob_start();
        try {
            wc_get_template( 'single-product/add-to-cart/variable.php', [
                'product'              => $variable_product,
                'available_variations' => $variable_product->get_available_variations(),
                'attributes'           => $variable_product->get_variation_attributes(),
                'selected_attributes'  => $variable_product->get_default_attributes(),
            ] );
            $variations_form = ob_get_clean();
        } catch ( \Exception $e ) {
            ob_end_clean();

            // Restore globals
            $post = $original_post;
            $product = $original_product;
            wp_reset_postdata();

            wp_send_json_error( [ 'message' => 'Failed to render variations form: ' . $e->getMessage() ] );
        }

        // Restore globals
        $post = $original_post;
        $product = $original_product;
        wp_reset_postdata();

        // Add variations form to product data
        $product_data['variations_form'] = $variations_form;

        wp_send_json_success( [
            'product' => $product_data,
        ] );
    }

    /**
     * AJAX Add to Cart for variable products
     */
    public function ajax_add_to_cart() {
        if ( ! class_exists( 'WooCommerce' ) ) {
            wp_send_json_error( [ 'error' => 'WooCommerce not active' ] );
        }

        $product_id   = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;
        $variation_id = isset( $_POST['variation_id'] ) ? absint( $_POST['variation_id'] ) : 0;
        $quantity     = isset( $_POST['quantity'] ) ? absint( $_POST['quantity'] ) : 1;

        if ( ! $product_id ) {
            wp_send_json_error( [ 'error' => 'Invalid product' ] );
        }

        // For variable products, we need the variation ID
        if ( $variation_id ) {
            $variation_data = [];

            // Get variation attributes from POST
            foreach ( $_POST as $key => $value ) {
                if ( strpos( $key, 'attribute_' ) === 0 ) {
                    $variation_data[ $key ] = sanitize_text_field( $value );
                }
            }

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
        } else {
            wp_send_json_error( [ 'error' => 'Please select product options' ] );
        }
    }
}

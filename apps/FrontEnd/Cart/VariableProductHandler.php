<?php
/**
 * Variable Product Handler
 *
 * Handles variable product data retrieval via AJAX
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd\Cart;

defined('ABSPATH') || exit;

class VariableProductHandler {

    /**
     * Get variable product data via AJAX
     *
     * @return void
     */
    public static function get_variable_product() {
        check_ajax_referer( 'qcshopping_nonce', 'nonce' );

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

        // Ensure we have a WC_Product_Variable instance
        if ( ! $variable_product instanceof \WC_Product_Variable ) {
            wp_send_json_error( [ 'message' => 'Invalid variable product' ] );
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

        // Set up global post for template rendering
        global $post;

        // Store original value
        $original_post = $post;

        // Set globals for template
        $post = get_post( $product_id );
        // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
        $GLOBALS['product'] = $variable_product;

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
            wp_reset_postdata();

            wp_send_json_error( [ 'message' => 'Failed to render variations form: ' . $e->getMessage() ] );
        }

        // Restore globals
        $post = $original_post;
        wp_reset_postdata();

        // Add variations form to product data
        $product_data['variations_form'] = $variations_form;

        wp_send_json_success( [
            'product' => $product_data,
        ] );
    }
}

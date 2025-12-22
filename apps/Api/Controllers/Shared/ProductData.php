<?php
/**
 * Product Data Controller
 *
 * Handles product-related API endpoints
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Api\Controllers\Shared;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

class ProductData extends WP_REST_Controller {

    /**
     * Register routes
     */
    public function register_routes() {
        $namespace = 'quick-cart-shopping/v2';
        $base = 'products';

        register_rest_route( $namespace, '/' . $base, [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [ $this, 'get_products' ],
                'permission_callback' => [ $this, 'get_products_permissions_check' ],
                'args'                => $this->get_collection_params(),
            ],
        ] );

        register_rest_route( $namespace, '/' . $base . '/(?P<id>[\d]+)', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [ $this, 'get_product' ],
                'permission_callback' => [ $this, 'get_products_permissions_check' ],
                'args'                => [
                    'id' => [
                        'validate_callback' => function( $param ) {
                            return is_numeric( $param );
                        }
                    ],
                ],
            ],
        ] );
    }

    /**
     * Get products
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response|WP_Error
     */
    public function get_products( $request ) {
        if ( ! class_exists( 'WooCommerce' ) ) {
            return new WP_Error( 'woocommerce_not_active', 'WooCommerce is not active', [ 'status' => 400 ] );
        }

        $per_page = $request->get_param( 'per_page' ) ?: 100;
        $page = $request->get_param( 'page' ) ?: 1;
        $search = $request->get_param( 'search' ) ?: '';

        $args = [
            'post_type'      => 'product',
            'posts_per_page' => $per_page,
            'paged'          => $page,
            'post_status'    => 'publish',
            'orderby'        => 'title',
            'order'          => 'ASC',
        ];

        if ( ! empty( $search ) ) {
            $args['s'] = sanitize_text_field( $search );
        }

        $query = new \WP_Query( $args );
        $products = [];

        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();
                $product_id = get_the_ID();
                $product = wc_get_product( $product_id );

                if ( ! $product ) {
                    continue;
                }

                $products[] = [
                    'id'         => $product_id,
                    'name'       => get_the_title(),
                    'slug'       => get_post_field( 'post_name', $product_id ),
                    'permalink'  => get_permalink( $product_id ),
                    'type'       => $product->get_type(),
                    'price'      => $product->get_price(),
                    'price_html' => $product->get_price_html(),
                    'image'      => wp_get_attachment_image_url( $product->get_image_id(), 'thumbnail' ),
                    'stock_status' => $product->get_stock_status(),
                ];
            }
            wp_reset_postdata();
        }

        return rest_ensure_response( $products );
    }

    /**
     * Get single product
     *
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response|WP_Error
     */
    public function get_product( $request ) {
        if ( ! class_exists( 'WooCommerce' ) ) {
            return new WP_Error( 'woocommerce_not_active', 'WooCommerce is not active', [ 'status' => 400 ] );
        }

        $product_id = $request->get_param( 'id' );
        $product = wc_get_product( $product_id );

        if ( ! $product ) {
            return new WP_Error( 'product_not_found', 'Product not found', [ 'status' => 404 ] );
        }

        $data = [
            'id'         => $product_id,
            'name'       => $product->get_name(),
            'slug'       => $product->get_slug(),
            'permalink'  => $product->get_permalink(),
            'type'       => $product->get_type(),
            'price'      => $product->get_price(),
            'price_html' => $product->get_price_html(),
            'images'     => $this->get_product_images( $product ),
            'stock_status' => $product->get_stock_status(),
        ];

        return rest_ensure_response( $data );
    }

    /**
     * Get product images
     *
     * @param \WC_Product $product Product object
     * @return array
     */
    private function get_product_images( $product ) {
        $images = [];
        $image_ids = [];

        // Main image
        if ( $product->get_image_id() ) {
            $image_ids[] = $product->get_image_id();
        }

        // Gallery images
        $gallery_ids = $product->get_gallery_image_ids();
        if ( ! empty( $gallery_ids ) ) {
            $image_ids = array_merge( $image_ids, $gallery_ids );
        }

        foreach ( $image_ids as $image_id ) {
            $images[] = [
                'id'  => $image_id,
                'src' => wp_get_attachment_image_url( $image_id, 'full' ),
                'thumbnail' => wp_get_attachment_image_url( $image_id, 'thumbnail' ),
                'alt' => get_post_meta( $image_id, '_wp_attachment_image_alt', true ),
            ];
        }

        return $images;
    }

    /**
     * Check permissions
     *
     * @param WP_REST_Request $request Request object
     * @return bool|WP_Error
     */
    public function get_products_permissions_check( $request ) {
        // Allow public access for frontend cart panel upsell products
        // Allow authenticated users for admin
        return true;
    }

    /**
     * Get collection params
     *
     * @return array
     */
    public function get_collection_params() {
        return [
            'per_page' => [
                'description'       => 'Maximum number of items to be returned',
                'type'              => 'integer',
                'default'           => 100,
                'sanitize_callback' => 'absint',
            ],
            'page' => [
                'description'       => 'Current page of the collection',
                'type'              => 'integer',
                'default'           => 1,
                'sanitize_callback' => 'absint',
            ],
            'search' => [
                'description'       => 'Search keyword',
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ];
    }
}

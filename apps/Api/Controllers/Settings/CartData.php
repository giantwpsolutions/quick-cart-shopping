<?php
/**
 * Cart Settings REST API Controller.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Api\Controllers\Settings;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use QuickCartShopping\Helper\Sanitization\CartDataSanitization;

defined('ABSPATH') || exit;

/**
 * Cart Settings REST API Controller
 */
class CartData extends WP_REST_Controller
{
    /**
     * Constructor.
     */
    public function __construct() {
        $this->namespace = 'quick-cart-shopping/v2';
        $this->rest_base = 'save-cart-settings';
    }

    /**
     * Register the routes for Cart Settings.
     *
     * @return void
     */
    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/save-cart-settings',
            [
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'save_form_data' ],
                    'permission_callback' => [ $this, 'get_items_permissions_check' ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/get-cart-settings',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_form_data' ],
                    'permission_callback' => [ $this, 'get_items_permissions_check' ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/update-cart-settings/(?P<id>[a-zA-Z0-9_-]+)',
            [
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_form_data' ],
                    'permission_callback' => [ $this, 'get_items_permissions_check' ],
                    'args'                => [
                        'id' => [
                            'required'    => true,
                            'type'        => 'string',
                            'description' => __( 'The setting ID to update.', 'quick-cart-shopping' ),
                        ],
                    ],
                ],
            ]
        );
    }

    /**
     * Check if the user has permission to access these endpoints.
     *
     * @param WP_REST_Request $request The request object.
     * @return bool|WP_Error True if the user has permission, WP_Error otherwise.
     */
    public function get_items_permissions_check( $request )
    {
        if ( ! current_user_can( 'manage_options' ) ) {
            return new WP_Error(
                'qcshopping_rest_forbidden',
                __( 'You do not have permission to access this resource.', 'quick-cart-shopping' ),
                [ 'status' => 403 ]
            );
        }

        // Verify nonce for write operations (POST, PUT, DELETE)
        $method = $request->get_method();
        if ( in_array( $method, [ 'POST', 'PUT', 'DELETE', 'PATCH' ], true ) ) {
            $nonce = $request->get_header( 'X-WP-Nonce' );
            if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
                return new WP_Error(
                    'qcshopping_rest_cookie_invalid_nonce',
                    __( 'Cookie nonce is invalid', 'quick-cart-shopping' ),
                    [ 'status' => 403 ]
                );
            }
        }

        return true;
    }

    /**
     * Save cart settings data.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function save_form_data( WP_REST_Request $request )
    {
        $params = $request->get_json_params();

        if ( empty( $params ) || ! is_array( $params ) ) {
            return new WP_REST_Response(
                [
                    'success' => false,
                    'message' => __( 'Invalid or empty data provided.', 'quick-cart-shopping' ),
                ],
                400
            );
        }

        $sanitized_data = CartDataSanitization::sanitize_cart_settings( $params );

        $saved = update_option( 'qcshopping_cart_settings', $sanitized_data );

        if ( false === $saved ) {
            return new WP_REST_Response(
                [
                    'success' => false,
                    'message' => __( 'Failed to save data.', 'quick-cart-shopping' ),
                ],
                500
            );
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'message' => __( 'Data saved successfully.', 'quick-cart-shopping' ),
            ],
            200
        );
    }

    /**
     * Get cart settings data.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function get_form_data( WP_REST_Request $request )
    {
        $raw = get_option( 'qcshopping_cart_settings', [] );

        return new WP_REST_Response(
            [
                'success'  => true,
                'settings' => $raw,
            ],
            200
        );
    }

    /**
     * Update cart settings data.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function update_form_data( WP_REST_Request $request )
    {
        $id     = $request->get_param( 'id' );
        $params = $request->get_json_params();

        if ( empty( $params ) || ! is_array( $params ) ) {
            return new WP_REST_Response(
                [
                    'success' => false,
                    'message' => __( 'Invalid or empty data provided.', 'quick-cart-shopping' ),
                ],
                400
            );
        }

        $existing = get_option( 'qcshopping_cart_settings', [] );

        if ( empty( $existing ) || ! isset( $existing['id'] ) || $existing['id'] !== $id ) {
            return new WP_REST_Response(
                [
                    'success' => false,
                    'message' => __( 'Setting not found.', 'quick-cart-shopping' ),
                ],
                404
            );
        }

        $merged         = array_merge( $existing, $params );
        $sanitized_data = CartDataSanitization::sanitize_cart_settings( $merged );

        $updated = update_option( 'qcshopping_cart_settings', $sanitized_data );

        if ( false === $updated ) {
            return new WP_REST_Response(
                [
                    'success' => false,
                    'message' => __( 'Failed to update data.', 'quick-cart-shopping' ),
                ],
                500
            );
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'message' => __( 'Data updated successfully.', 'quick-cart-shopping' ),
            ],
            200
        );
    }
}

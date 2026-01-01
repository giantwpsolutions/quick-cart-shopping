<?php
/**
 * Layout Settings REST API Controller.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Api\Controllers\Settings;

defined( 'ABSPATH' ) || exit;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use QuickCartShopping\Helper\Sanitization\LayoutDataSanitization;

/**
 * Layout Settings Controller class
 */
class LayoutData extends WP_REST_Controller {

    /**
     * Constructor.
     */
    public function __construct() {
        $this->namespace = 'quick-cart-shopping/v2';
        $this->rest_base = 'save-layout-settings';
    }

    /**
     * Registers the routes for the objects of the controller.
     *
     * @return void
     */
    public function register_routes() {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            [
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'save_form_data' ],
                    'permission_callback' => [ $this, 'permission_callback' ],
                ],
            ]
        );

        // This route for fetching layout settings
        register_rest_route(
            $this->namespace,
            '/get-layout-settings',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_settings' ],
                    'permission_callback' => [ $this, 'permission_callback' ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/update-layout-settings/(?P<id>[\w-]+)',
            [
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => [ $this, 'update_settings' ],
                'permission_callback' => [ $this, 'permission_callback' ]
            ]
        );
    }

    /**
     * Checks if a given request has access.
     *
     * @param  \WP_REST_Request $request The request object.
     *
     * @return bool|WP_Error True if the user has permission, WP_Error otherwise.
     */
    public function permission_callback( $request ) {
        if ( ! current_user_can( 'manage_options' ) ) {
            return false;
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
     * Save Layout Settings Data
     *
     * @param  \WP_REST_Request $request
     *
     * @return \WP_REST_Response|WP_Error
     */
    public function save_form_data( WP_REST_Request $request ) {
        $params = $request->get_json_params();

        if ( empty( $params ) ) {
            return new WP_Error(
                'qcshopping_missing_data',
                __( 'No data received.', 'quick-cart-shopping' ),
                ['status' => 400]
            );
        }

        // Sanitize received data
        $sanitized_data = LayoutDataSanitization::sanitize_layout_settings( $params );

        if ( is_wp_error( $sanitized_data ) ) {
            return $sanitized_data;
        }

        // Save to Database
        $saved = update_option( 'qcshopping_layout_settings', $sanitized_data );

        if ( ! $saved && get_option( 'qcshopping_layout_settings' ) === false ) {
            return new WP_Error(
                'qcshopping_save_failed',
                __( 'Failed to save data.', 'quick-cart-shopping' ),
                ['status' => 500]
            );
        }

        return new WP_REST_Response(
            ['success' => true, 'message' => __( 'Data saved successfully.', 'quick-cart-shopping' ) ],
            200
        );
    }

    /**
     * Update layout settings.
     *
     * @param WP_REST_Request $request The request object.
     *
     * @return WP_REST_Response|WP_Error The response object.
     */
    public function update_settings( WP_REST_Request $request ) {
        // Sanitize ID from the URL
        $id = sanitize_text_field( $request->get_param( 'id' ) );

        // Get JSON Data
        $params = $request->get_json_params();
        if ( empty( $params ) ) {
            return new WP_Error( 'qcshopping_missing_data', __( 'No data received.', 'quick-cart-shopping' ), ['status' => 400] );
        }

        // Retrieve Existing Settings
        $existing_data = get_option( 'qcshopping_layout_settings', [] );
        if ( ! is_array( $existing_data ) ) {
            $existing_data = [];
        }

        // If only status is being updated, update it separately
        if ( isset( $params['status'] ) && count( $params ) === 1 ) {
            $existing_data['status'] = sanitize_text_field( $params['status'] );
        } else {
            // Sanitize the received data for a full update
            $sanitized_data = LayoutDataSanitization::sanitize_layout_settings( $params );
            if ( is_wp_error( $sanitized_data ) ) {
                return $sanitized_data;
            }

            // Merge sanitized data with existing settings
            $existing_data = array_merge( $existing_data, $sanitized_data );
        }

        update_option( 'qcshopping_layout_settings', $existing_data );
        return new WP_REST_Response( ['success' => true, 'message' => __( 'Data updated successfully.', 'quick-cart-shopping' ) ], 200 );
    }

    /**
     * Get Layout Settings Data
     *
     * @param  \WP_REST_Request $request
     *
     * @return \WP_REST_Response|WP_Error
     */
    public function get_settings( WP_REST_Request $request ) {
        // Pull option
        $raw = get_option( 'qcshopping_layout_settings', [] );

        // Guarantee an array for the response
        if ( ! is_array( $raw ) ) {
            $raw = [];
        }

        // Return a REST response
        return new WP_REST_Response(
            [
                'success'  => true,
                'settings' => $raw,
            ],
            200
        );
    }
}

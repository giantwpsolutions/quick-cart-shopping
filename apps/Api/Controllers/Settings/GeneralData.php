<?php
/**
 * General Settings REST API Controller.
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
use QuickCartShopping\Helper\Sanitization\GeneralDataSanitization;

/**
 * General Settings Controller class
 */
class GeneralData extends WP_REST_Controller {

    /**
     * Constructor.
     */
    public function __construct() {
        $this->namespace = 'quick-cart-shopping/v2';
        $this->rest_base = 'save-general-settings';
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

        // This route for fetching general settings
        register_rest_route(
            $this->namespace,
            '/get-general-settings',
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
            '/update-general-settings/(?P<id>[\w-]+)',
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
     * @return bool True if the user has permission, false otherwise.
     */
    public function permission_callback() {
        return current_user_can( 'manage_options' );
    }

    /**
     * Save General Settings Data
     *
     * @param  \WP_REST_Request $request
     *
     * @return \WP_REST_Response|WP_Error
     */
    public function save_form_data( WP_REST_Request $request ) {
        $params = $request->get_json_params();

        if ( empty( $params ) ) {
            return new WP_Error(
                'missing_data',
                __( 'No data received.', 'quick-cart-shopping' ),
                ['status' => 400]
            );
        }

        // Sanitize received data
        $sanitized_data = GeneralDataSanitization::sanitize_general_settings( $params );

        if ( is_wp_error( $sanitized_data ) ) {
            return $sanitized_data;
        }

        // Save to Database
        $saved = update_option( 'quick_cart_general_settings', $sanitized_data );

        if ( ! $saved && get_option( 'quick_cart_general_settings' ) === false ) {
            return new WP_Error(
                'save_failed',
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
     * Update general settings.
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
            return new WP_Error( 'missing_data', __( 'No data received.', 'quick-cart-shopping' ), ['status' => 400] );
        }

        // Retrieve Existing Settings
        $existing_data = get_option( 'quick_cart_general_settings', [] );
        if ( ! is_array( $existing_data ) ) {
            $existing_data = [];
        }

        // If only status is being updated, update it separately
        if ( isset( $params['status'] ) && count( $params ) === 1 ) {
            $existing_data['status'] = sanitize_text_field( $params['status'] );
        } else {
            // Sanitize the received data for a full update
            $sanitized_data = GeneralDataSanitization::sanitize_general_settings( $params );
            if ( is_wp_error( $sanitized_data ) ) {
                return $sanitized_data;
            }

            // Merge sanitized data with existing settings
            $existing_data = array_merge( $existing_data, $sanitized_data );
        }

        update_option( 'quick_cart_general_settings', $existing_data );
        return new WP_REST_Response( ['success' => true, 'message' => __( 'Data updated successfully.', 'quick-cart-shopping' ) ], 200 );
    }

    /**
     * Get General Settings Data
     *
     * @param  \WP_REST_Request $request
     *
     * @return \WP_REST_Response|WP_Error
     */
    public function get_settings( WP_REST_Request $request ) {
        // Pull option
        $raw = get_option( 'quick_cart_general_settings', [] );

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

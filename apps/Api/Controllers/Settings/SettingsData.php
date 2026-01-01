<?php
/**
 * Settings REST API Controller.
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
use QuickCartShopping\Helper\Sanitization\SettingsDataSanitization;

/**
 * Settings Controller class
 */
class SettingsData extends WP_REST_Controller {

    /**
     * Constructor.
     */
    public function __construct() {
        $this->namespace = 'quick-cart-shopping/v2';
        $this->rest_base = 'settings';
    }

    /**
     * Registers the routes for the objects of the controller.
     *
     * @return void
     */
    public function register_routes() {
        // Save/Update settings
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            [
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'save_settings' ],
                    'permission_callback' => [ $this, 'permission_callback' ],
                ],
            ]
        );

        // Get settings
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_settings' ],
                    'permission_callback' => [ $this, 'permission_callback' ],
                ],
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
     * Save Settings Data
     *
     * @param  \WP_REST_Request $request
     *
     * @return \WP_REST_Response|WP_Error
     */
    public function save_settings( WP_REST_Request $request ) {
        $params = $request->get_json_params();

        if ( empty( $params ) ) {
            return new WP_Error(
                'qcshopping_missing_data',
                __( 'No data received.', 'quick-cart-shopping' ),
                ['status' => 400]
            );
        }

        // Get existing general settings
        $existing_data = get_option( 'qcshopping_general_settings', [] );
        if ( ! is_array( $existing_data ) ) {
            $existing_data = [];
        }

        // Sanitize received settings data
        $sanitized_data = SettingsDataSanitization::sanitize_settings( $params );

        if ( is_wp_error( $sanitized_data ) ) {
            return $sanitized_data;
        }

        // Merge with existing data
        $updated_data = array_merge( $existing_data, $sanitized_data );

        // Save to Database
        $saved = update_option( 'qcshopping_general_settings', $updated_data );

        if ( ! $saved && get_option( 'qcshopping_general_settings' ) === false ) {
            return new WP_Error(
                'qcshopping_save_failed',
                __( 'Failed to save settings.', 'quick-cart-shopping' ),
                ['status' => 500]
            );
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'message' => __( 'Settings saved successfully.', 'quick-cart-shopping' ),
                'data'    => $updated_data
            ],
            200
        );
    }

    /**
     * Get Settings Data
     *
     * @param  \WP_REST_Request $request
     *
     * @return \WP_REST_Response|WP_Error
     */
    public function get_settings( WP_REST_Request $request ) {
        // Pull option
        $raw = get_option( 'qcshopping_general_settings', [] );

        // Guarantee an array for the response
        if ( ! is_array( $raw ) ) {
            $raw = [];
        }

        // Extract settings-specific data
        $settings = [
            'enableAdvancedSettings' => isset( $raw['enableAdvancedSettings'] ) ? (bool) $raw['enableAdvancedSettings'] : false,
            'showUpsellProducts'     => isset( $raw['showUpsellProducts'] ) ? (bool) $raw['showUpsellProducts'] : false,
            'upsellProducts'         => isset( $raw['upsellProducts'] ) && is_array( $raw['upsellProducts'] ) ? $raw['upsellProducts'] : [],
        ];

        // Return a REST response
        return new WP_REST_Response(
            [
                'success'  => true,
                'settings' => $settings,
            ],
            200
        );
    }
}

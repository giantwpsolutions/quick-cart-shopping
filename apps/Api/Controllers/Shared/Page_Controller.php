<?php
/**
 * Pages REST Controller.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Api\Controllers\Shared;

defined( 'ABSPATH' ) || exit;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Response;
use WP_Error;

class Page_Controller extends WP_REST_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'quick-cart-shopping/v2';
		$this->rest_base = 'pages';
	}

	/**
	 * Register routes.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_pages_data' ),
					'permission_callback' => array( $this, 'get_pages_data_permission' ),
				),
			)
		);
	}

	/**
	 * Permission check.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return true|WP_Error
	 */
	public function get_pages_data_permission( $request ) {
		// Only allow admins/shop managers who can manage WooCommerce settings.
		if ( current_user_can( 'manage_woocommerce' ) ) {
			return true;
		}

		return new WP_Error(
			'qcs_rest_forbidden',
			__( 'Sorry, you are not allowed to access pages.', 'quick-cart-shopping' ),
			array( 'status' => 403 )
		);
	}

	/**
	 * Get all published pages.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return WP_REST_Response
	 */
	public function get_pages_data( $request ) {
		$pages = get_pages(
			array(
				'post_status' => 'publish',
				'sort_column' => 'post_title',
				'sort_order'  => 'ASC',
			)
		);

		$page_list = array();

		foreach ( $pages as $page ) {
			$page_list[] = array(
				'value' => (int) $page->ID,
				'label' => get_the_title( $page->ID ),
			);
		}

		return rest_ensure_response( $page_list );
	}
}

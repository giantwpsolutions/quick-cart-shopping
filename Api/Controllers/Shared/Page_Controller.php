<?php
/**
 * Page Controller
 * Returns list of WordPress pages for dropdown selection
 */

namespace QuickCartShopping\Api\Controllers\Shared;

class Page_Controller {

    /**
     * Get all published pages
     *
     * @return array List of pages with id and title
     */
    public static function get_pages() {
        $pages = get_pages(array(
            'post_status' => 'publish',
            'sort_column' => 'post_title',
            'sort_order'  => 'ASC'
        ));

        $page_list = array();

        foreach ($pages as $page) {
            $page_list[] = array(
                'value' => $page->ID,
                'label' => $page->post_title
            );
        }

        return $page_list;
    }

    /**
     * Register REST API endpoint
     */
    public static function register_routes() {
        register_rest_route('quick-cart-shopping/v1', '/pages', array(
            'methods'  => 'GET',
            'callback' => array(__CLASS__, 'get_pages'),
            'permission_callback' => function() {
                return current_user_can('manage_options');
            }
        ));
    }
}
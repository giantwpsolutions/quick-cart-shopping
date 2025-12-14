<?php 

/**
 * Api Handler for Quick Cart Shopping
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Api;

use QuickCartShopping\Api\Controllers\Shared\Page_Controller;
use QuickCartShopping\Traits\SingletonTrait;

/**
 * Register all api routes
 */
class Api{

    use SingletonTrait;

    /**
     * class constructor
     */

    public function __construct(){
        add_action( 'rest_api_init', [ $this, 'qcshopping_register_api' ] );
    }

    /**
     * Registers REST API routes for all controllers.
     *
     * @return void
     */
    public function qcshopping_register_api(){

        $page_controllers = new Page_Controller();
        $page_controllers->register_routes();
    }
}
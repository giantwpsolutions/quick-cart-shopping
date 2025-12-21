<?php 

/**
 * Api Handler for Quick Cart Shopping
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Api;

use QuickCartShopping\Api\Controllers\Shared\Page_Controller;
use QuickCartShopping\Api\Controllers\Settings\GeneralData;
use QuickCartShopping\Api\Controllers\Settings\LayoutData;
use QuickCartShopping\Api\Controllers\Settings\ToggleData;
use QuickCartShopping\Api\Controllers\Settings\CartData;
use QuickCartShopping\Api\Controllers\Settings\CheckoutData;
use QuickCartShopping\Api\Controllers\Settings\VariationPopupData;
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

        $general_settings_controller = new GeneralData();
        $general_settings_controller->register_routes();

        $layout_settings_controller = new LayoutData();
        $layout_settings_controller->register_routes();

        $toggle_settings_controller = new ToggleData();
        $toggle_settings_controller->register_routes();

        $cart_settings_controller = new CartData();
        $cart_settings_controller->register_routes();

        $checkout_settings_controller = new CheckoutData();
        $checkout_settings_controller->register_routes();

        $variation_popup_settings_controller = new VariationPopupData();
        $variation_popup_settings_controller->register_routes();
    }
}
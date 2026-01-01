<?php
/**
 * Cart Handler - AJAX operations for cart
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd;

use QuickCartShopping\Traits\SingletonTrait;
use QuickCartShopping\FrontEnd\Cart\CartItemsRetriever;
use QuickCartShopping\FrontEnd\Cart\CartItemUpdater;
use QuickCartShopping\FrontEnd\Cart\CartItemRemover;
use QuickCartShopping\FrontEnd\Cart\VariableProductHandler;
use QuickCartShopping\FrontEnd\Cart\AddToCartHandler;
use QuickCartShopping\FrontEnd\Cart\CouponHandler;
use QuickCartShopping\FrontEnd\Cart\ShippingHandler;

class CartHandler {

    use SingletonTrait;

    /**
     * Constructor
     */
    public function __construct() {
        // AJAX actions for logged in and non-logged in users
        add_action( 'wp_ajax_qcshopping_get_cart_items', [ CartItemsRetriever::class, 'get_cart_items' ] );
        add_action( 'wp_ajax_nopriv_qcshopping_get_cart_items', [ CartItemsRetriever::class, 'get_cart_items' ] );

        add_action( 'wp_ajax_qcshopping_update_cart_item', [ CartItemUpdater::class, 'update_cart_item' ] );
        add_action( 'wp_ajax_nopriv_qcshopping_update_cart_item', [ CartItemUpdater::class, 'update_cart_item' ] );

        add_action( 'wp_ajax_qcshopping_remove_cart_item', [ CartItemRemover::class, 'remove_cart_item' ] );
        add_action( 'wp_ajax_nopriv_qcshopping_remove_cart_item', [ CartItemRemover::class, 'remove_cart_item' ] );

        add_action( 'wp_ajax_qcshopping_get_variable_product', [ VariableProductHandler::class, 'get_variable_product' ] );
        add_action( 'wp_ajax_nopriv_qcshopping_get_variable_product', [ VariableProductHandler::class, 'get_variable_product' ] );

        add_action( 'wp_ajax_qcshopping_add_to_cart', [ AddToCartHandler::class, 'ajax_add_to_cart' ] );
        add_action( 'wp_ajax_nopriv_qcshopping_add_to_cart', [ AddToCartHandler::class, 'ajax_add_to_cart' ] );

        add_action( 'wp_ajax_qcshopping_apply_coupon', [ CouponHandler::class, 'apply_coupon' ] );
        add_action( 'wp_ajax_nopriv_qcshopping_apply_coupon', [ CouponHandler::class, 'apply_coupon' ] );

        add_action( 'wp_ajax_qcshopping_remove_coupon', [ CouponHandler::class, 'remove_coupon' ] );
        add_action( 'wp_ajax_nopriv_qcshopping_remove_coupon', [ CouponHandler::class, 'remove_coupon' ] );

        add_action( 'wp_ajax_qcshopping_update_shipping_method', [ ShippingHandler::class, 'update_shipping_method' ] );
        add_action( 'wp_ajax_nopriv_qcshopping_update_shipping_method', [ ShippingHandler::class, 'update_shipping_method' ] );
    }
}

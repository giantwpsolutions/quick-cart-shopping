<?php
  /**
 * Admin Menu Setup for Quick Cart Shopping.
 *
 * @package QuickCartShopping
 */

namespace QuickCartShopping\Admin;

defined( 'ABSPATH' ) || exit;

use QuickCartShopping\Traits\SingletonTrait;

/**
 * Admin Menu Class
 */
class Menu {

    use SingletonTrait;

    /**
     * Class Constructor
     */
    public function __construct() {

        add_action( 'admin_menu', [ $this, 'quickcartshopping_menu' ] );
    }

    /**
     * Registers the Quick Cart Shopping submenu under WooCommerce.
     */
    public function quickcartshopping_menu() {

        global $submenu;
        // Check if WooCommerce is active
        if ( ! is_plugin_active( 'woocommerce/woocommerce.php' ) ) {
            return;  // WooCommerce is not active, don't add the menu
        }

        // Add submenu under WooCommerce Marketing menu

        $parent_slug = 'woocommerce';
        $capability  = 'manage_woocommerce';

        add_submenu_page( $parent_slug, __( 'Quick Cart Shopping', 'quick-cart-shopping' ), __( 'Quick Cart Shopping', 'quick-cart-shopping' ), $capability, 'quick-cart-shopping', [ $this, 'render_page' ] );


        // /**
        //  * Tab Submenu Creation
        //  */
        // if ( current_user_can( $capability ) ) {
        //     $submenu['quick-cart-shopping'][] = [ __( 'Discount Rule', 'giantwp-discount-rules' ), $capability, 'admin.php?page=giantwp-discount-rules#/' ];
        //     $submenu['quick-cart-shopping'][] = [ __( 'Settings', 'giantwp-discount-rules' ), $capability, 'admin.php?page=giantwp-discount-rules#/settings' ];
        // }
    }

    /**
     * Render the submenu page content
     * 
     * @return void
     */
    public function render_page() {

        echo '<div class="wrap"><div id="quick-cart-shopping"></div></div>';
    }
}

<?php
/**
* Plugin Name: Quick Cart Shopping
* Plugin URI: https://giantwpsolutions.com/plugins/quick-cart-shopping
* Description: A modern WooCommerce UX booster — adds floating cart, variation popups, and drag  &drop shopping experience. Convert more customers with smooth, app-like interactions.
* Version: 1.0.2
* Author: Giant WP Solutions
* Author URI: https://giantwpsolutions.com
* License: GPLv2 or later
* Text Domain: quick-cart-shopping
* WC requires at least: 3.0.0
* WC tested up to: 10.4.3
* Requires PHP: 7.4
* WooCommerce HPOS support: yes
* Domain Path: /languages
* @package Quick Cart Shopping
*/

if (! defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__  . '/apps/functions.php';

/**
 * The main plugin class
 */

final class Quick_Cart_Shopping{

      /**
     * The plugin version
     */
    const version = '1.0.2';

    /**
     * Class Constructor
     */
    public function __construct()
    {
        register_activation_hook( __FILE__ , [ $this, 'activate' ] );
        add_action( 'plugins_loaded', [ $this, 'on_plugins_loaded'] );
        add_action( 'admin_notices', [ $this, 'check_woocommerce_active' ] );
        add_action( 'admin_init', [ $this, 'redirect_on_activation' ] );
        add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), [ $this, 'qcshopping_discount_settings_link' ] );
        $this->declare_hpos_compatibility();
        $this->define_constants();
    }

    /**
     * Initializes a singleton instance
     * 
     * @return Quick_Cart_Shopping
     */
    public static function init()
    {
        static $instance = false;

        if ( ! $instance) {
            $instance = new self();
        }

        return $instance;
    }

    /**
     * Necessary plugin constants
     * @return void
     */
    public function define_constants()
    {
        define( 'QCSHOPPING_VERSION', self::version );
        define( 'QCSHOPPING_FILE', __FILE__ );
        define( 'QCSHOPPING_PATH', plugin_dir_path(__FILE__) );
        define( 'QCSHOPPING_LANG_DIR', plugin_basename( dirname(__FILE__) ) . '/languages' );
    }

      /**
     * Load plugin textdomain for translations
     * @return void
     */
    public function on_plugins_loaded()
    {

        if ( class_exists( 'WooCommerce' ) ) {

            new QuickCartShopping\Installer();

        } else {
            add_action( 'admin_notices', [ $this, 'woocommerce_missing_notice' ] );
        }
    }

       /**
     * Declare HPOS compatibility for WooCommerce.
     *
     * @return void
     */
    public function declare_hpos_compatibility() {
        add_action( 'before_woocommerce_init', function () {
            if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
                \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
                    'custom_order_tables',
                    __FILE__,
                    true
                );
            }
        } );
    }

    /**
     * Do stuff upon plugin activation
     * @return void
     */
    public function activate()
    {
        if ( ! class_exists( 'WooCommerce' ) ) {
            deactivate_plugins( plugin_basename( __FILE__ ) );
        
            wp_die(
                esc_html__( 'Quick Cart Shopping requires WooCommerce to be installed and active.', 'quick-cart-shopping' ),
                esc_html__( 'Plugin dependency check', 'quick-cart-shopping' ),
                [ 'back_link' => true ]
            );
        }

        $install_time = get_option( 'qcshopping_installation_time' );

        if ( ! $install_time ) {
            update_option( 'qcshopping_installation_time', time() );
        }

        update_option( 'qcshopping_version', self::version );

        // Set transient for redirect
        set_transient( 'qcshopping_activate_redirect', true, 30 );
    }

    /**
     * Redirect to plugin page after activation
     * @return void
     */
    public function redirect_on_activation()
    {
        if ( get_transient( 'qcshopping_activate_redirect' ) ) {
            delete_transient( 'qcshopping_activate_redirect' );
            wp_safe_remote_post( admin_url( 'admin.php?page=quick-cart-shopping#/general' ) );
            wp_redirect( admin_url( 'admin.php?page=quick-cart-shopping#/general' ) );
            exit;
        }
    }

    /*
     * Woocommerce Missing Notice
     *
     * @return void
     */
    public function woocommerce_missing_notice()
    {
        qcshopping_WoocommerceMissingAlert();
    }

      /**
     * Adds a "Settings" link to the plugin action links on the Plugins screen.
     *
     * This link will redirect the user to the plugin's settings page under the WooCommerce menu.
     *
     * @param array $links An array of existing action links.
     * @return array Modified array of action links with the added "Settings" link.
     */
    public function qcshopping_discount_settings_link( $links ) {
        $settings_link = '<a href="' . esc_url( admin_url( 'admin.php?page=quick-cart-shopping#' ) ) . '">' . esc_html__( 'Settings', 'quick-cart-shopping' ) . '</a>';
        array_unshift( $links, $settings_link );
        return $links;
    }

    /**
     * Show alert if WooCommerce is deactivated
     */
    public function check_woocommerce_active()
    {
        if ( ! class_exists( 'WooCommerce' ) ) {
            qcshopping_WoocommerceDeactivationAlert();
        }
    }




}

/**
 * Initializes the main plugin
 * @return \Quick_Cart_Shopping
 */
function quickCartShopping()
{
    return Quick_Cart_Shopping::init();
}

/**
 * Kick-off the plugin
 */
quickCartShopping();

<?php
  /**
 * Plugin Assets Loader File
 * @package QuickCartShopping
 */

 namespace QuickCartShopping;

use QuickCartShopping\Traits\SingletonTrait;

/**
* Assets Class
*/
 class Assets{

    use SingletonTrait;

    /**
     * class Constructor
     */
    public function __construct() {
        add_action( 'wp_enqueue_scripts', [ $this, 'qcshopping_assets_register' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'qcshopping_admin_assets_register' ] );
        add_filter( 'script_loader_tag',     [ $this, 'add_attribute_type' ], 10, 3 );
        add_action( 'in_admin_header',       [ $this, 'disable_core_update_notifications' ] );

    }

    /**
     * Enqueue Plugin Frontend assets
     */
    public function qcshopping_assets_register(){

        wp_enqueue_style( 'qcshopping-cart-positions', plugin_dir_url(__DIR__). 'assets/css/qcs-cart-position.css', array(), QCSHOPPING_VERSION );
        wp_enqueue_script('qcshopping-script', plugin_dir_url(__DIR__) . 'assets/js/qcs-cart-position.js', ['jquery'], QCSHOPPING_VERSION, true);


          wp_localize_script('qcshopping-script', 'qcshoppingParams', [
        'wc_ajax_url' => \WC_AJAX::get_endpoint('%%endpoint%%'),
        'ajax_url' => admin_url('admin-ajax.php'),
    ]);
    }

    /**
     * Enqueue Plugin Admin panel assets
     */
    public function qcshopping_admin_assets_register(){
      if ( ! is_admin() ) return;

        $screen = get_current_screen();
        if ( ! $screen || $screen->id !== 'woocommerce_page_quick-cart-shopping' ) return;

        wp_enqueue_script( 'wp-i18n' );
        wp_enqueue_script( 'wp-api-fetch' );
        $is_dev        = defined( 'WP_DEBUG' ) && WP_DEBUG;
        $dev_server_js = 'http://localhost:5174/src/main.js';
        $prod_js       = plugin_dir_url(__DIR__) . 'dist/assets/main.js';
        $prod_css      = plugin_dir_url(__DIR__) . 'dist/assets/main.css';

        if ( $is_dev ) {
            wp_enqueue_script( 'qcshopping-admin-vjs', $dev_server_js, ['wp-i18n', 'wp-api-fetch'], '1.0', true );
        }else{
            wp_enqueue_script( 'qcshopping-admin-vjs', $prod_js, ['wp-i18n', 'wp-api-fetch'], '1.0', true );
            wp_enqueue_style( 'qcshopping-admin-styles', $prod_css, [], '1.0' );
        }

           

        wp_localize_script( 'qcshopping-admin-vjs', 'qcshoppingPluginData', [
            'pluginUrl' => esc_url( plugin_dir_url(__DIR__) ),
            'restUrl'   => esc_url_raw( rest_url( trailingslashit('quick-cart-shopping/v2') ) ),
            'nonce'     => wp_create_nonce( 'wp_rest' ),
            'proUrl'    => esc_url( 'https://giantwpsolutions.com/' ),
            'docsUrl'   => esc_url( 'https://www.docs.giantwpsolutions.com/' ),
            'communityUrl' => esc_url( 'https://www.facebook.com/groups/giantwpsolutions' ),
            'supportUrl' => esc_url( 'https://www.giantwpsolutions.com/support/' ),
            'proActive' => defined( 'QUICK_CART_SHOPPING_PRO_ACTIVE' ) && QUICK_CART_SHOPPING_PRO_ACTIVE,
            'primekit_search_url' => esc_url( admin_url( 'plugin-install.php?s=PrimeKit%20Addons&tab=search&type=term' ) ),
            'giantwp_discount_rules_url' => esc_url( admin_url( 'plugin-install.php?s=giantwp%20discount%20rules&tab=search&type=term' ) ),
        ] );

    }

        /**
     * Modify script tag to use type = "module" for Vue builds.
     *
     * @param string $tag    Script tag.
     * @param string $handle Script handle.
     * @param string $src    Script source URL.
     *
     * @return string
     */
    public function add_attribute_type( $tag, $handle, $src ) {
        if ( 'qcshopping-admin-vjs' === $handle ) {
              // Use regex to add type="module" to the existing <script> tag
            return str_replace(
                '<script ',
                '<script type="module" ',
                $tag
            );
        }

        return $tag;
    }

    /**
     * Removes all admin notices from plugin settings page.
     *
     * Ensures a clean experience inside Quick Cart Shopping's admin interface.
     */
    public function disable_core_update_notifications() {
        $screen = get_current_screen();
        if ( $screen && $screen->id === 'woocommerce_page_quick-cart-shopping' ) {
            remove_all_actions( 'admin_notices' );
            remove_all_actions( 'network_admin_notices' );
        }
    }
 }
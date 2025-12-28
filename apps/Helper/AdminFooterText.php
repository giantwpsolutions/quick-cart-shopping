<?php 


namespace QuickCartShopping\Helper;

use QuickCartShopping\Traits\SingletonTrait;

class AdminFooterText{

    use SingletonTrait;
    public function __construct(){

         add_filter( 'admin_footer_text', [ $this, 'qcshopping_admin_footer_text' ] );
    }

    public function qcshopping_admin_footer_text( $text ){
        $screen = function_exists('get_current_screen') ? get_current_screen() : null;

        // Only show on your plugin admin pages
        if ( ! $screen || strpos( $screen->id, 'quick-cart-shopping' ) === false ) {
            return $text; // keep default footer elsewhere
        }

        return sprintf(
            '<i>If you like the plugin please rate us <span style="color:#1A7EFB;">★★★★★</span> on <a href="https://wordpress.org/support/plugin/giantwp-discount-rules/reviews/" target="_blank" style="text-decoration:none;color:#2271b1;">WordPress.org</a> to help us spread the word ♥ from the <b style="color:#1A7EFB;">Giant WP Solutions</b> team.</i>'
        );
    }


}
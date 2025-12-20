<?php
/**
 * Floating Cart Toggle Renderer
 *
 * Renders the cart toggle button HTML in wp_footer
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\FrontEnd;

use QuickCartShopping\Traits\SingletonTrait;

class CartToggleRenderer{

    use SingletonTrait;

    /**
     * Constructor
     */
    public function __construct(){
        add_action( 'wp_footer', [ $this, 'render_cart_toggle' ], 10 );
    }

    /**
     * Render cart toggle button in footer
     *
     * @return void
     */
    public function render_cart_toggle(){
        // Check if Quick Cart Shopping is enabled
        if ( ! SettingsProvider::is_enabled() ) {
            return;
        }

        // Exit if current page should hide toggle
        if ( SettingsProvider::should_hide_toggle() ) {
            return;
        }

        // Get toggle settings
        $settings = SettingsProvider::get_toggle_settings();

        // Render the toggle container (JavaScript will populate it)
        ?>
        <!-- QC Cart Toggle Container -->
        <div id="qc-cart-toggle-container"
             data-position="<?php echo esc_attr( $settings['iconPosition'] ); ?>"
             data-icon-style="<?php echo esc_attr( $settings['iconStyle'] ); ?>"
             data-icon-size="<?php echo esc_attr( $settings['iconSize'] ); ?>"
             data-show-badge="<?php echo esc_attr( $settings['showBadge'] ? '1' : '0' ); ?>"
             data-border-shape="<?php echo esc_attr( $settings['borderShape'] ); ?>"
             data-offset-top="<?php echo esc_attr( $settings['offsetTop'] ?? 20 ); ?>"
             data-offset-bottom="<?php echo esc_attr( $settings['offsetBottom'] ?? 20 ); ?>"
             data-offset-left="<?php echo esc_attr( $settings['offsetLeft'] ?? 20 ); ?>"
             data-offset-right="<?php echo esc_attr( $settings['offsetRight'] ?? 20 ); ?>"
             style="display: none;">
        </div>
        <?php
    }

    /**
     * Get cart icon SVG
     *
     * @param string $style Icon style (cart, bag, basket)
     * @return string
     */
    public static function get_icon_svg( $style = 'cart' ){
        $icons = [
            'cart' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',

            'bag' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',

            'basket' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6 19 18 5 18 3 6"></polyline><path d="M8 10v8"></path><path d="M12 10v8"></path><path d="M16 10v8"></path></svg>',
        ];

        return isset( $icons[ $style ] ) ? $icons[ $style ] : $icons['cart'];
    }
}

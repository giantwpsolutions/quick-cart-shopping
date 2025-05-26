<?php
  /**
 * Cart Position
 * @package QuickCartShopping
 */

namespace QuickCartShopping\Cart;

use QuickCartShopping\Traits\SingletonTrait;

  /**
 * Cart Position Class
 */
class CartPosition {

    use SingletonTrait;

      /**
     * Class Constructor
     */
    public function __construct() {
        add_action('wp_footer', [$this, 'qcshopping_cart_positions']);
    }

      /**
     * Renders the floating cart
     *
     * @return void
     */
    public function qcshopping_cart_positions() {
    $settings = apply_filters('qcs_cart_settings', [
        'position'     => 'left',
        'display_mode' => 'side',
    ]);

    $position_class = 'qcs-' . $settings['position'];
    $mode_class= 'qcs-mode-' . $settings['display_mode'];

    ?>
    <div id= "qcs-floating-cart" class= "<?php echo esc_attr("$position_class $mode_class"); ?>">
    <div id= "qcs-cart-toggle"><i class= "bi bi-cart"></i></div>

        <div id= "qcs-cart-panel" class= "bg-white text-dark shadow-lg">
            <!-- Stepper -->
            <div class = "border-bottom p-3 d-flex justify-content-between align-items-center">
            <ul class = "nav nav-tabs w-100" id= "qcs-stepper" role= "tablist">
            <li class = "nav-item flex-fill text-center" role = "presentation">
            <button class = "nav-link active w-100" id= "cart-tab" data-bs-toggle= "tab" data-bs-target= "#qcs-tab-cart" type= "button" role= "tab">🛒 Cart</button>
                    </li>
                    <li class= "nav-item flex-fill text-center" role = "presentation">
                    <button class= "nav-link w-100" id= "checkout-tab" data-bs-toggle= "tab" data-bs-target= "#qcs-tab-checkout" type= "button" role= "tab">💳 Checkout</button>
                    </li>
                </ul>
                <button id= "qcs-close-cart" class = "btn-close ms-3" aria-label = "Close"></button>
            </div>

            <!-- Tab content -->
            <div class = "tab-content" id = "qcs-tab-content">
                <!-- Cart Tab -->
                <div class = "tab-pane fade show active" id = "qcs-tab-cart" role = "tabpanel" aria-labelledby = "cart-tab">
                <div class = "p-3">
                        <?php
                        $cart        = WC()->cart;
                        $items       = $cart->get_cart();
                        $total_items = $cart->get_cart_contents_count();

                        echo '<p class="px-1 pt-1 small text-muted">You have ' . esc_html($total_items) . ' items in your cart</p>';
                        ?>
                    </div>
                    <div class = "qcs-cart-items-wrapper" style = "max-height: 300px; overflow-y: auto; padding: 0 1rem;">
                        <?php foreach ($items as $cart_item_key => $cart_item): 
                            $product   = $cart_item['data'];
                            $name      = $product->get_name();
                            $quantity  = $cart_item['quantity'];
                            $price     = wc_price($product->get_price() * $quantity);
                            $image     = wp_get_attachment_image($product->get_image_id(), 'thumbnail', false, ['class' => 'img-fluid rounded', 'style' => 'width: 60px; height: auto;']);
                            $variation = wc_get_formatted_cart_item_data($cart_item, true);
                        ?>
                            <div class = "card mb-2">
                            <div class = "card-body d-flex align-items-center justify-content-between p-2">
                            <div class = "d-flex align-items-center">
                            <div class = "me-3"><?php echo $image; ?></div>
                                        <div>
                                            <div class= "fw-semibold"><?php echo esc_html($name); ?></div>
                                            <small class= "text-muted"><?php echo $variation ?: '&nbsp;'; ?></small>
                                        </div>
                                    </div>
                                    <div class= "text-center px-2">
                                        <div><?php echo esc_html($quantity); ?></div>
                                        <div class= "fw-bold"><?php echo $price; ?></div>
                                    </div>
                                    <div>
                                        <a href= "<?php echo esc_url(wc_get_cart_remove_url($cart_item_key)); ?>" class= "text-danger fs-5">
                                        <i class= "bi bi-trash"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <div class="p-3 border-top d-grid gap-2">
                        <a href="<?php echo esc_url(wc_get_cart_url()); ?>" class="btn btn-dark w-100">View Full Cart</a>
                        <button class="btn btn-outline-secondary w-100" data-bs-toggle="tab" data-bs-target="#qcs-tab-checkout">Go to Checkout</button>
                    </div>
                </div>

                <!-- Checkout Tab -->
                <div class="tab-pane fade" id="qcs-tab-checkout" role="tabpanel" aria-labelledby="checkout-tab">
                    <div class="p-3">
                        <p class="text-muted">Checkout content will go here (e.g., checkout form or link).</p>
                        <a href="<?php echo esc_url(wc_get_checkout_url()); ?>" class="btn btn-success w-100">Proceed to Checkout</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
}

}

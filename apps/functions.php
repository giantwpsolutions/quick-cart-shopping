<?php

function qcshopping_check_woocommerce_hpos()
{
    if (class_exists(\Automattic\WooCommerce\Utilities\OrderUtil::class)) {
        if (\Automattic\WooCommerce\Utilities\OrderUtil::custom_orders_table_usage_is_enabled()) {
            return true;
        }
    }
    return false;
}

function qcshopping_WoocommerceDeactivationAlert()
{
?>
    <div class="notice notice-error is-dismissible">
        <p>
            <?php esc_html_e(
                'WooCommerce is deactivated! The "Quick Cart Shopping" plugin requires WooCommerce to function properly. Please reactivate WooCommerce.',
                'quick-cart-shopping'
            ); ?>
        </p>
    </div>
<?php
}


function qcshopping_WoocommerceMissingAlert()
{
?>
    <div class="notice notice-error is-dismissible">
        <p>
            <?php esc_html_e(
                'Quick Cart Shopping requires WooCommerce to be installed and active.',
                'quick-cart-shopping'
            ); ?>
        </p>
    </div>
<?php
}

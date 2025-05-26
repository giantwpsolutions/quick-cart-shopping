<?php

namespace QuickCartShopping\DragAndDrop;




class Drag {
    public function __construct() {
        add_action('wp_ajax_qcs_add_product', [$this, 'add_to_cart']);
        add_action('wp_ajax_nopriv_qcs_add_product', [$this, 'add_to_cart']);
    }

    public function add_to_cart() {
        if (empty($_POST['product_id'])) {
            wp_send_json_error(['message' => 'No product ID']);
        }

        $product_id = intval($_POST['product_id']);
        $added = WC()->cart->add_to_cart($product_id);

        if ($added) {
            wp_send_json_success(['message' => 'Added to cart']);
        }

        wp_send_json_error(['message' => 'Failed']);
    }
}
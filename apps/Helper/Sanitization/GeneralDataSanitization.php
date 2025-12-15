<?php
/**
 * General Settings Data Sanitization Helper.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Helper\Sanitization;

defined('ABSPATH') || exit;

/**
 * General Data Sanitization Helper Class
 */
class GeneralDataSanitization
{
    /**
     * Sanitize general settings data.
     *
     * @param array $data The raw general settings data.
     * @return array The sanitized data.
     */
    public static function sanitize_general_settings( $data )
    {
        if ( !is_array( $data ) ) {
            return [];
        }

        return [
            'id'                          => sanitize_text_field( $data['id'] ?? time() ),
            'createdAt'                   => sanitize_text_field( $data['createdAt'] ?? current_time('c') ),
            'status'                      => isset( $data['status'] ) && in_array( $data['status'], ['on', 'off'] ) ? $data['status'] : 'on',
            'enableQuickCart'             => isset( $data['enableQuickCart'] ) ? (bool) $data['enableQuickCart'] : true,
            'enableVarProduct'            => isset( $data['enableVarProduct'] ) ? (bool) $data['enableVarProduct'] : true,
            'enableDragAndDrop'           => isset( $data['enableDragAndDrop'] ) ? (bool) $data['enableDragAndDrop'] : true,
            'enableDirectCheckout'        => isset( $data['enableDirectCheckout'] ) ? (bool) $data['enableDirectCheckout'] : true,
        ];
    }
}

<?php
/**
 * Layout Settings Data Sanitization Helper.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Helper\Sanitization;

defined('ABSPATH') || exit;

/**
 * Layout Data Sanitization Helper Class
 */
class LayoutDataSanitization
{
    /**
     * Sanitize layout settings data.
     *
     * @param array $data The raw layout settings data.
     * @return array The sanitized data.
     */
    public static function sanitize_layout_settings( $data )
    {
        if ( !is_array( $data ) ) {
            return [];
        }

        return [
            'id'          => sanitize_text_field( $data['id'] ?? time() ),
            'createdAt'   => sanitize_text_field( $data['createdAt'] ?? current_time('c') ),
            'status'      => isset( $data['status'] ) && in_array( $data['status'], ['on', 'off'] ) ? $data['status'] : 'on',
            'cartOption'  => isset( $data['cartOption'] ) && in_array( $data['cartOption'], ['side', 'popup', 'drawer'] )
                             ? $data['cartOption'] : 'side',
            'cartWidth'   => isset( $data['cartWidth'] ) && is_numeric( $data['cartWidth'] )
                             ? max( 300, min( 800, intval( $data['cartWidth'] ) ) ) : 400,
            'animation'   => isset( $data['animation'] ) && in_array( $data['animation'], ['slide', 'fade', 'slide-fade', 'bounce'] )
                             ? $data['animation'] : 'slide',
        ];
    }
}

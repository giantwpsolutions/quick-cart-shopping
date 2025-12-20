<?php
/**
 * Toggle Settings Data Sanitization Helper.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Helper\Sanitization;

defined('ABSPATH') || exit;

/**
 * Toggle Data Sanitization Helper Class
 */
class ToggleDataSanitization
{
    /**
     * Sanitize toggle settings data.
     *
     * @param array $data The raw toggle settings data.
     * @return array The sanitized data.
     */
    public static function sanitize_toggle_settings( $data )
    {
        if ( !is_array( $data ) ) {
            return [];
        }

        return [
            'id'              => sanitize_text_field( $data['id'] ?? time() ),
            'createdAt'       => sanitize_text_field( $data['createdAt'] ?? current_time('c') ),
            'status'          => isset( $data['status'] ) && in_array( $data['status'], ['on', 'off'] ) ? $data['status'] : 'on',
            'iconPosition'    => isset( $data['iconPosition'] ) && in_array( $data['iconPosition'], ['bottom-right', 'bottom-left', 'top-right', 'top-left'] )
                                 ? $data['iconPosition'] : 'bottom-right',
            'iconStyle'       => isset( $data['iconStyle'] ) && in_array( $data['iconStyle'], ['cart', 'cart-solid', 'bag', 'bag-solid'] )
                                 ? $data['iconStyle'] : 'cart',
            'iconSize'        => isset( $data['iconSize'] ) && is_numeric( $data['iconSize'] )
                                 ? max( 40, min( 120, intval( $data['iconSize'] ) ) ) : 60,
            'showBadge'       => isset( $data['showBadge'] ) ? (bool) $data['showBadge'] : true,
            'badgeBgColor'    => sanitize_text_field( $data['badgeBgColor'] ?? '#3498db' ),
            'badgeTextColor'  => sanitize_text_field( $data['badgeTextColor'] ?? '#ffffff' ),
            'iconBgColor'     => sanitize_text_field( $data['iconBgColor'] ?? '#05291B' ),
            'iconColor'       => sanitize_text_field( $data['iconColor'] ?? '#ffffff' ),
            'hideOnPages'     => isset( $data['hideOnPages'] ) && is_array( $data['hideOnPages'] )
                                 ? array_map( 'intval', $data['hideOnPages'] ) : [],
            'borderShape'     => isset( $data['borderShape'] ) && in_array( $data['borderShape'], ['none', 'circle', 'rounded'] )
                                 ? $data['borderShape'] : 'circle',
            'offsetTop'       => isset( $data['offsetTop'] ) && is_numeric( $data['offsetTop'] )
                                 ? (int) max( 0, min( 500, $data['offsetTop'] ) ) : 20,
            'offsetBottom'    => isset( $data['offsetBottom'] ) && is_numeric( $data['offsetBottom'] )
                                 ? (int) max( 0, min( 500, $data['offsetBottom'] ) ) : 20,
            'offsetLeft'      => isset( $data['offsetLeft'] ) && is_numeric( $data['offsetLeft'] )
                                 ? (int) max( 0, min( 500, $data['offsetLeft'] ) ) : 20,
            'offsetRight'     => isset( $data['offsetRight'] ) && is_numeric( $data['offsetRight'] )
                                 ? (int) max( 0, min( 500, $data['offsetRight'] ) ) : 20,
        ];
    }
}

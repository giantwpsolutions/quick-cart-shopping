<?php
/**
 * Variation Popup Settings Data Sanitization Helper.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Helper\Sanitization;

defined('ABSPATH') || exit;

/**
 * Variation Popup Data Sanitization Helper Class
 */
class VariationPopupDataSanitization
{
    /**
     * Sanitize variation popup settings data.
     *
     * @param array $data The raw variation popup settings data.
     * @return array The sanitized data.
     */
    public static function sanitize_variation_popup_settings( $data )
    {
        if ( !is_array( $data ) ) {
            return [];
        }

        return [
            'id'                        => sanitize_text_field( $data['id'] ?? time() ),
            'createdAt'                 => sanitize_text_field( $data['createdAt'] ?? current_time('c') ),
            'status'                    => isset( $data['status'] ) && in_array( $data['status'], ['on', 'off'] ) ? $data['status'] : 'on',
            'closeButtonBgColor'        => self::sanitize_color( $data['closeButtonBgColor'] ?? '#f5f5f5' ),
            'closeButtonIconColor'      => self::sanitize_color( $data['closeButtonIconColor'] ?? '#666666' ),
            'popupWidth'                => self::sanitize_width( $data['popupWidth'] ?? 1000 ),
            'addToCartButtonBgColor'    => self::sanitize_color( $data['addToCartButtonBgColor'] ?? '#05291B' ),
            'addToCartButtonTextColor'  => self::sanitize_color( $data['addToCartButtonTextColor'] ?? '#ffffff' ),
        ];
    }

    /**
     * Sanitize color value (hex or rgba)
     *
     * @param string $color Color value
     * @return string Sanitized color
     */
    private static function sanitize_color( $color )
    {
        // Remove any whitespace
        $color = trim( $color );

        // Check if it's a valid hex color
        if ( preg_match( '/^#[a-fA-F0-9]{6}$/', $color ) || preg_match( '/^#[a-fA-F0-9]{3}$/', $color ) ) {
            return $color;
        }

        // Check if it's a valid rgba color
        if ( preg_match( '/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/', $color ) ) {
            return $color;
        }

        // Return default if invalid
        return '#000000';
    }

    /**
     * Sanitize popup width
     *
     * @param mixed $width Width value
     * @return int Sanitized width
     */
    private static function sanitize_width( $width )
    {
        $width = intval( $width );

        // Ensure width is within reasonable bounds
        if ( $width < 600 ) {
            return 600;
        }

        if ( $width > 1400 ) {
            return 1400;
        }

        return $width;
    }
}

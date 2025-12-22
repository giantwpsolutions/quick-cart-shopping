<?php
/**
 * Settings Data Sanitization Helper.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Helper\Sanitization;

defined('ABSPATH') || exit;

/**
 * Settings Data Sanitization Helper Class
 */
class SettingsDataSanitization
{
    /**
     * Sanitize settings data (for advanced settings like upsell products).
     *
     * @param array $data The raw settings data.
     * @return array The sanitized data.
     */
    public static function sanitize_settings( $data )
    {
        if ( !is_array( $data ) ) {
            return [];
        }

        $sanitized = [];

        // Sanitize enableAdvancedSettings
        if ( isset( $data['enableAdvancedSettings'] ) ) {
            $sanitized['enableAdvancedSettings'] = (bool) $data['enableAdvancedSettings'];
        }

        // Sanitize showUpsellProducts
        if ( isset( $data['showUpsellProducts'] ) ) {
            $sanitized['showUpsellProducts'] = (bool) $data['showUpsellProducts'];
        }

        // Sanitize upsellProducts array (product IDs)
        if ( isset( $data['upsellProducts'] ) && is_array( $data['upsellProducts'] ) ) {
            $sanitized['upsellProducts'] = array_map( 'absint', $data['upsellProducts'] );
            // Limit to 2 products
            $sanitized['upsellProducts'] = array_slice( $sanitized['upsellProducts'], 0, 2 );
        } else {
            $sanitized['upsellProducts'] = [];
        }

        return $sanitized;
    }
}

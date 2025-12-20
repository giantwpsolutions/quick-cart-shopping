<?php
/**
 * Checkout Settings Data Sanitization Helper.
 *
 * @package Quick Cart Shopping
 */

namespace QuickCartShopping\Helper\Sanitization;

defined('ABSPATH') || exit;

/**
 * Checkout Data Sanitization Helper Class
 */
class CheckoutDataSanitization
{
    /**
     * Sanitize checkout settings data.
     *
     * @param array $data The raw checkout settings data.
     * @return array The sanitized data.
     */
    public static function sanitize_checkout_settings( $data )
    {
        if ( !is_array( $data ) ) {
            return [];
        }

        return [
            'id'                      => sanitize_text_field( $data['id'] ?? time() ),
            'createdAt'               => sanitize_text_field( $data['createdAt'] ?? current_time('c') ),
            'status'                  => isset( $data['status'] ) && in_array( $data['status'], ['on', 'off'] ) ? $data['status'] : 'on',
            'enableStep1'             => isset( $data['enableStep1'] ) ? (bool) $data['enableStep1'] : true,
            'step1Label'              => sanitize_text_field( $data['step1Label'] ?? 'Billing & Shipping' ),
            'enableStep2'             => isset( $data['enableStep2'] ) ? (bool) $data['enableStep2'] : true,
            'step2Label'              => sanitize_text_field( $data['step2Label'] ?? 'Order Review' ),
            'enableStep3'             => isset( $data['enableStep3'] ) ? (bool) $data['enableStep3'] : true,
            'step3Label'              => sanitize_text_field( $data['step3Label'] ?? 'Payment' ),
            'progressBarStyle'        => isset( $data['progressBarStyle'] ) && in_array( $data['progressBarStyle'], ['style1', 'style2', 'style3'] )
                                         ? $data['progressBarStyle'] : 'style1',
            'progressBarColor'        => sanitize_text_field( $data['progressBarColor'] ?? '#05291B' ),
            'progressLabelTextColor'  => sanitize_text_field( $data['progressLabelTextColor'] ?? '#ffffff' ),
            'progressLabelBgColor'    => sanitize_text_field( $data['progressLabelBgColor'] ?? '#3498db' ),
            'enableThankYouPage'      => isset( $data['enableThankYouPage'] ) ? (bool) $data['enableThankYouPage'] : true,
            'thankYouDisplay'         => isset( $data['thankYouDisplay'] ) && in_array( $data['thankYouDisplay'], ['popup', 'page'] )
                                         ? $data['thankYouDisplay'] : 'popup',
            'popupBgColor'            => sanitize_text_field( $data['popupBgColor'] ?? '#ffffff' ),
            'showOrderSummary'        => isset( $data['showOrderSummary'] ) ? (bool) $data['showOrderSummary'] : true,
            'thankYouPage'            => isset( $data['thankYouPage'] ) ? intval( $data['thankYouPage'] ) : null,
        ];
    }
}

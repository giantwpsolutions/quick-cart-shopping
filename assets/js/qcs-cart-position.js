jQuery(function ($) {
    const $cartPanel = $('#qcs-cart-panel');
    const $toggleBtn = $('#qcs-cart-toggle');
    const $closeBtn = $('#qcs-close-cart');

    $toggleBtn.on('click', function () {
        $cartPanel.toggleClass('open');
    });

    $closeBtn.on('click', function () {
        $cartPanel.removeClass('open');
    });

    $(document).on('click', function (e) {
        if (
            !$cartPanel.is(e.target) &&
            $cartPanel.has(e.target).length === 0 &&
            !$toggleBtn.is(e.target) &&
            $toggleBtn.has(e.target).length === 0
        ) {
            $cartPanel.removeClass('open');
        }
    });

    // Refresh WooCommerce mini cart on item add
    $(document.body).on('added_to_cart', function () {
        $.post(
            qcshoppingParams.wc_ajax_url.toString().replace('%%endpoint%%', 'get_refreshed_fragments'),
            {},
            function (response) {
                $('#qcs-cart-content').html(response.fragments['div.widget_shopping_cart_content']);
            }
        );
    });
});

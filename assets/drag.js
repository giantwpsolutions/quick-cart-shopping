document.addEventListener("DOMContentLoaded", function () {
    const dropzone = document.getElementById("qcs-dropzone");

    document.querySelectorAll(".qcs-product").forEach(product => {
        product.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("product_id", product.dataset.product_id);
        });
    });

    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("drag-over");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("drag-over");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("drag-over");

        const productId = e.dataTransfer.getData("product_id");

        fetch(qcs_ajax.ajax_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=qcs_add_product&product_id=${productId}`
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    alert('Product added!');
                    jQuery(document.body).trigger('added_to_cart', []);
                } else {
                    alert('Error: ' + response.message);
                }
            });
    });
});

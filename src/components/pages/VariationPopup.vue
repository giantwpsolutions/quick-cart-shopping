<!--
/**
 * Variation Popup Settings Page
 *
 * Configuration options for the variable product popup appearance.
 *
 * @component VariationPopup
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
const model = defineModel({ type: Object, required: true })
</script>

<template>
  <div class="tw-space-y-6 tw-pt-4 tw-pb-2">

    <!-- Close Button Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Close Button Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.closeButtonBgColor"
          size="default"
          show-alpha
          :predefine="['#f5f5f5', '#ffffff', '#e8e8e8', '#05291B', '#000000']"
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.closeButtonBgColor || '#f5f5f5' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Set the background color for the popup close button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Close Button Icon Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Close Button Icon Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.closeButtonIconColor"
          size="default"
          show-alpha
          :predefine="['#666666', '#333333', '#000000', '#ffffff', '#05291B']"
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.closeButtonIconColor || '#666666' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Set the icon color for the popup close button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Popup Width -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Popup Width", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Width (px)", "quick-cart-shopping")}}</label>
        <el-input-number
          v-model="model.popupWidth"
          :min="600"
          :max="1400"
          :step="50"
          size="default"
          style="width: 150px;"
        />
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Set the maximum width of the popup (in pixels). Default: 1000px", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Add to Cart Button Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Add to Cart Button Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.addToCartButtonBgColor"
          size="default"
          show-alpha
          :predefine="['#05291B', '#073d29', '#3498db', '#27ae60', '#000000']"
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.addToCartButtonBgColor || '#05291B' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Set the background color for the add to cart button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Add to Cart Button Text Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Add to Cart Button Text Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.addToCartButtonTextColor"
          size="default"
          show-alpha
          :predefine="['#ffffff', '#000000', '#05291B', '#333333']"
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.addToCartButtonTextColor || '#ffffff' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Set the text color for the add to cart button.", "quick-cart-shopping")}}
      </p>
    </div>

  </div>
</template>

<style scoped>
/* Color picker styling */
:deep(.el-color-picker__trigger) {
  border: 2px solid #d1d5db;
}
</style>

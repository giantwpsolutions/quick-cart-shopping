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

// Props from parent Settings component
const props = defineProps({
  isProPluginInstalled: {
    type: Boolean,
    default: false
  },
  isProActive: {
    type: Boolean,
    default: false
  },
  licenseStatus: {
    type: String,
    default: 'inactive'
  }
})
</script>

<template>
  <div class="tw-space-y-6 tw-pt-4 tw-pb-2">

    <!-- License Warning (only show if Pro plugin installed but license not active) -->
    <div v-if="isProPluginInstalled && !isProActive" class="tw-border tw-border-red-500 tw-rounded-lg tw-p-4 tw-bg-red-50 tw-shadow-sm">
      <div class="tw-flex tw-items-start tw-gap-3">
        <svg class="tw-w-6 tw-h-6 tw-text-red-600 tw-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div>
          <h4 class="tw-font-semibold tw-text-red-800 tw-mb-1">Pro License Required</h4>
          <p class="tw-text-sm tw-text-red-700">
            Variation popup customization is a Pro feature. Please activate your license to use these settings.
            <span v-if="licenseStatus" class="tw-block tw-mt-1 tw-text-xs">
              Current license status: <strong>{{ licenseStatus }}</strong>
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Close Button Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm" :class="{ 'tw-opacity-60 tw-pointer-events-none tw-select-none': !isProActive }">
      <div class="tw-flex tw-items-center tw-gap-2 tw-mb-3">
        <h3 class="tw-text-base tw-font-semibold tw-text-gray-800">{{__("Close Button Background Color", "quick-cart-shopping")}}</h3>
        <span v-if="!isProActive" class="tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold tw-text-white tw-bg-red-600 tw-rounded">PRO</span>
      </div>

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
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm" :class="{ 'tw-opacity-60 tw-pointer-events-none tw-select-none': !isProActive }">
      <div class="tw-flex tw-items-center tw-gap-2 tw-mb-3">
        <h3 class="tw-text-base tw-font-semibold tw-text-gray-800">{{__("Close Button Icon Color", "quick-cart-shopping")}}</h3>
        <span v-if="!isProActive" class="tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold tw-text-white tw-bg-red-600 tw-rounded">PRO</span>
      </div>

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
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm" :class="{ 'tw-opacity-60 tw-pointer-events-none tw-select-none': !isProActive }">
      <div class="tw-flex tw-items-center tw-gap-2 tw-mb-3">
        <h3 class="tw-text-base tw-font-semibold tw-text-gray-800">{{__("Popup Width", "quick-cart-shopping")}}</h3>
        <span v-if="!isProActive" class="tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold tw-text-white tw-bg-red-600 tw-rounded">PRO</span>
      </div>

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
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm" :class="{ 'tw-opacity-60 tw-pointer-events-none tw-select-none': !isProActive }">
      <div class="tw-flex tw-items-center tw-gap-2 tw-mb-3">
        <h3 class="tw-text-base tw-font-semibold tw-text-gray-800">{{__("Add to Cart Button Background Color", "quick-cart-shopping")}}</h3>
        <span v-if="!isProActive" class="tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold tw-text-white tw-bg-red-600 tw-rounded">PRO</span>
      </div>

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
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm" :class="{ 'tw-opacity-60 tw-pointer-events-none tw-select-none': !isProActive }">
      <div class="tw-flex tw-items-center tw-gap-2 tw-mb-3">
        <h3 class="tw-text-base tw-font-semibold tw-text-gray-800">{{__("Add to Cart Button Text Color", "quick-cart-shopping")}}</h3>
        <span v-if="!isProActive" class="tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold tw-text-white tw-bg-red-600 tw-rounded">PRO</span>
      </div>

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

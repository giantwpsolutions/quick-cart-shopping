<!--
/**
 * Cart Settings Page
 *
 * Configuration options for the main shopping cart display and behavior.
 *
 * @component Cart
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
const model = defineModel({ type: Object, required: true })
</script>

<template>
  <div class="tw-space-y-6 tw-pt-4 tw-pb-2">

    <!-- Show Shipping -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Show Shipping", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="model.showShipping"
          class="ml-2"
          size="large"
          inline-prompt
          active-color="#05291B"
          inactive-color="#d1d5db"
          active-text="Yes"
          inactive-text="No"
        />
      </div>
      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Display shipping information in the cart summary.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Show Apply Coupon Field -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Show Apply Coupon Field", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="model.showCouponField"
          class="ml-2"
          size="large"
          inline-prompt
          active-color="#05291B"
          inactive-color="#d1d5db"
          active-text="Yes"
          inactive-text="No"
        />
      </div>
      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Allow customers to apply discount coupons in the cart.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Checkout Button Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Checkout Button Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.checkoutBtnBgColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.checkoutBtnBgColor || '#05291B' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the checkout button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Checkout Button Text Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Checkout Button Text Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.checkoutBtnTextColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.checkoutBtnTextColor || '#ffffff' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the text color for the checkout button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Show Checkout Button -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Show Checkout Button", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="model.showCheckoutBtn"
          class="ml-2"
          size="large"
          inline-prompt
          active-color="#05291B"
          inactive-color="#d1d5db"
          active-text="Yes"
          inactive-text="No"
        />
      </div>
      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Display the checkout button in the cart.", "quick-cart-shopping")}}
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

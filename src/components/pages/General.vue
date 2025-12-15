<!--
/**
 * General Settings Page
 *
 * Controls main plugin features including Quick Cart system,
 * variable product popup, drag and drop cart, and direct checkout.
 *
 * @component General
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
const model = defineModel({ type: Object, required: true })
</script>

<template>
  <div class="tw-space-y-3 tw-pt-4 tw-pb-2">
    <!-- label + switch inline -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Enable Quick Cart Shopping", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="model.enableQuickCart"
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
        {{__("Turn on the Quick Cart system to allow customers to add products and manage their cart instantly without page reloads.", "quick-cart-shopping")}}
      </p>
    </div>
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Enable popup for variable product", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="model.enableVarProduct"
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
        {{__("Automatically show a quick popup for variable products so customers can select variations before adding to the cart.", "quick-cart-shopping")}}
      </p>
    </div>

    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Enable drag and drop cart", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="model.enableDragAndDrop"
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
        {{__("Allow customers to drag products directly into the cart for a faster and more interactive shopping experience.", "quick-cart-shopping")}}
      </p>
    </div>

    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Enable direct checkout", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="model.enableDirectCheckout"
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
        {{__("Skip the cart page and send customers directly to checkout to reduce friction and increase conversions.", "quick-cart-shopping")}}
      </p>
    </div>
  </div>
</template>

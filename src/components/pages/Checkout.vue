<!--
/**
 * Checkout Editor Settings Page
 *
 * Configuration and customization options for the checkout process.
 *
 * @component Checkout
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
import { onMounted } from 'vue'
import { pagesData, isLoadingPagesData, loadPagesData } from '@/data/pageDataFetch'

const model = defineModel({ type: Object, required: true })

const base = (typeof qcshoppingPluginData !== 'undefined' && qcshoppingPluginData.pluginUrl)
  ? (qcshoppingPluginData.pluginUrl.endsWith('/') ? qcshoppingPluginData.pluginUrl : qcshoppingPluginData.pluginUrl + '/')
  : '/';

const progressBarStyles = [
  { value: 'style1', label: 'Style 1', img: `${base}assets/images/progress-1.png` },
  { value: 'style2', label: 'Style 2', img: `${base}assets/images/progress-2.png` },
  { value: 'style3', label: 'Style 3', img: `${base}assets/images/progress-3.png` },
]

const thankYouOptions = [
  { value: 'popup', label: 'Popup' },
  { value: 'page', label: 'Select Page' },
]

onMounted(() => {
  loadPagesData()
})
</script>

<template>
  <div class="tw-space-y-6 tw-pt-4 tw-pb-2">

    <!-- Multi-Step Checkout Configuration -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Multi-Step Checkout Steps", "quick-cart-shopping")}}</h3>

      <p class="tw-text-xs tw-text-gray-600 tw-mb-4">
        {{__("Configure the steps for your multi-step checkout process. You can enable/disable steps and customize their labels.", "quick-cart-shopping")}}
      </p>

      <div class="tw-space-y-3">
        <!-- Step 1: Billing & Shipping -->
        <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 tw-rounded-md">
          <div class="tw-flex-1">
            <div class="tw-flex tw-items-center tw-gap-2">
              <span class="tw-inline-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-bg-[#05291B] tw-text-white tw-text-xs tw-font-semibold tw-rounded-full">1</span>
              <el-input
                v-model="model.step1Label"
                :placeholder="__('Billing & Shipping', 'quick-cart-shopping')"
                size="small"
                style="max-width: 200px;"
              />
            </div>
            <p class="tw-text-[11px] tw-text-gray-500 tw-mt-1 tw-ml-8">{{__("Enter billing and shipping details", "quick-cart-shopping")}}</p>
          </div>
          <el-switch
            v-model="model.enableStep1"
            size="default"
            active-color="#05291B"
            inactive-color="#d1d5db"
          />
        </div>

        <!-- Step 2: Order Review -->
        <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 tw-rounded-md">
          <div class="tw-flex-1">
            <div class="tw-flex tw-items-center tw-gap-2">
              <span class="tw-inline-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-bg-[#05291B] tw-text-white tw-text-xs tw-font-semibold tw-rounded-full">2</span>
              <el-input
                v-model="model.step2Label"
                :placeholder="__('Order Review', 'quick-cart-shopping')"
                size="small"
                style="max-width: 200px;"
              />
            </div>
            <p class="tw-text-[11px] tw-text-gray-500 tw-mt-1 tw-ml-8">{{__("Review cart items and totals with dynamic shipping", "quick-cart-shopping")}}</p>
          </div>
          <el-switch
            v-model="model.enableStep2"
            size="default"
            active-color="#05291B"
            inactive-color="#d1d5db"
          />
        </div>

        <!-- Step 3: Payment -->
        <div class="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 tw-rounded-md">
          <div class="tw-flex-1">
            <div class="tw-flex tw-items-center tw-gap-2">
              <span class="tw-inline-flex tw-items-center tw-justify-center tw-w-6 tw-h-6 tw-bg-[#05291B] tw-text-white tw-text-xs tw-font-semibold tw-rounded-full">3</span>
              <el-input
                v-model="model.step3Label"
                :placeholder="__('Payment', 'quick-cart-shopping')"
                size="small"
                style="max-width: 200px;"
              />
            </div>
            <p class="tw-text-[11px] tw-text-gray-500 tw-mt-1 tw-ml-8">{{__("Choose payment method and place order", "quick-cart-shopping")}}</p>
          </div>
          <el-switch
            v-model="model.enableStep3"
            size="default"
            active-color="#05291B"
            inactive-color="#d1d5db"
          />
        </div>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-3">
        {{__("All steps are required for checkout process.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Progress Bar Style -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Progress Bar Style", "quick-cart-shopping")}}</h3>

      <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-3">
        <label
          v-for="style in progressBarStyles"
          :key="style.value"
          :class="[
            'tw-group tw-block tw-rounded-lg tw-border-2 tw-bg-white tw-cursor-pointer tw-transition-all tw-duration-200 tw-overflow-hidden',
            model.progressBarStyle===style.value
              ? 'tw-border-[#3498db] tw-shadow-md tw-shadow-[#3498db]/30'
              : 'tw-border-gray-300 hover:tw-border-[#3498db]/50 hover:tw-shadow-sm'
          ]"
        >
          <input
            class="tw-sr-only"
            type="radio"
            name="progressBarStyle"
            :value="style.value"
            v-model="model.progressBarStyle"
          />

          <div class="tw-relative tw-aspect-[3/1] tw-overflow-hidden tw-bg-gray-50 tw-p-2">
            <img
              :src="style.img"
              :alt="style.label"
              class="tw-h-full tw-w-full tw-object-contain tw-transition-transform tw-duration-200 group-hover:tw-scale-105"
              loading="lazy"
              decoding="async"
            />
            <div
              v-if="model.progressBarStyle===style.value"
              class="tw-absolute tw-top-2 tw-right-2 tw-bg-gradient-to-r tw-from-[#3498db] tw-to-[#2980b9] tw-text-white tw-px-2 tw-py-0.5 tw-rounded-full tw-text-[10px] tw-font-semibold tw-shadow-md"
            >
              {{__("Selected", "quick-cart-shopping")}}
            </div>
          </div>

          <div class="tw-flex tw-items-center tw-justify-between tw-p-2.5 tw-bg-white">
            <div class="tw-text-xs tw-font-medium tw-text-gray-700">{{ style.label }}</div>
            <span
              :class="[
                'tw-inline-flex tw-h-4 tw-w-4 tw-rounded-full tw-border-2 tw-transition-all tw-duration-200 tw-flex-shrink-0',
                model.progressBarStyle===style.value
                  ? 'tw-bg-[#3498db] tw-border-[#3498db]'
                  : 'tw-border-gray-400 tw-bg-white group-hover:tw-border-[#3498db]'
              ]"
            >
              <svg
                v-if="model.progressBarStyle===style.value"
                class="tw-h-full tw-w-full tw-text-white tw-p-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
        </label>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Select the progress bar design for checkout steps.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Progress Bar Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Progress Bar Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.progressBarColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.progressBarColor || '#05291B' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the color for the progress bar.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Progress Label Text Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Progress Label Text Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.progressLabelTextColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.progressLabelTextColor || '#ffffff' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the text color for progress step labels.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Progress Label Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Progress Label Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.progressLabelBgColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.progressLabelBgColor || '#3498db' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for progress step labels.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Next Button Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Next Button Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.nextBtnBgColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.nextBtnBgColor || '#05291B' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the Next step button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Next Button Text Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Next Button Text Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.nextBtnTextColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.nextBtnTextColor || '#ffffff' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the text color for the Next step button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Previous Button Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Previous Button Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.previousBtnBgColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.previousBtnBgColor || '#6b7280' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the Previous step button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Previous Button Text Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Previous Button Text Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.previousBtnTextColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.previousBtnTextColor || '#ffffff' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the text color for the Previous step button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Back to Cart Button Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Back to Cart Button Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.backToCartBtnBgColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.backToCartBtnBgColor || '#e5e7eb' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the Back to Cart button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Back to Cart Button Text Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Back to Cart Button Text Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.backToCartBtnTextColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.backToCartBtnTextColor || '#374151' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the text color for the Back to Cart button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Enable Thank You Page -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Enable Thank You Page", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="model.enableThankYouPage"
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
        {{__("Enable custom thank you page after order completion.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Thank You Display Options (Conditional) -->
    <div v-if="model.enableThankYouPage" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Thank You Display", "quick-cart-shopping")}}</h3>

      <el-radio-group
        v-model="model.thankYouDisplay"
        class="tw-flex tw-gap-3"
      >
        <el-radio
          v-for="opt in thankYouOptions"
          :key="opt.value"
          :value="opt.value"
          :label="opt.value"
          size="large"
          border
        >
          {{ opt.label }}
        </el-radio>
      </el-radio-group>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose how to display the thank you message.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Popup Background Color (Conditional) -->
    <div v-if="model.enableThankYouPage && model.thankYouDisplay === 'popup'" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Popup Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="model.popupBgColor"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ model.popupBgColor || '#ffffff' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the thank you popup.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Show Order Summary (Conditional - Popup only) -->
    <div v-if="model.enableThankYouPage && model.thankYouDisplay === 'popup'" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Show Order Summary", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="model.showOrderSummary"
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
        {{__("Display order summary in the thank you popup.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Select Thank You Page (Conditional - Page only) -->
    <div v-if="model.enableThankYouPage && model.thankYouDisplay === 'page'" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Select Thank You Page", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-start tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap tw-pt-2">{{__("Page", "quick-cart-shopping")}}</label>
        <el-select
          v-model="model.thankYouPage"
          :placeholder="isLoadingPagesData ? 'Loading pages...' : 'Select a page'"
          :loading="isLoadingPagesData"
          size="default"
          style="width: 100%; max-width: 400px;"
        >
          <el-option
            v-for="page in pagesData"
            :key="page.value"
            :value="page.value"
            :label="page.label"
          />
        </el-select>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Select the page to redirect after order completion.", "quick-cart-shopping")}}
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

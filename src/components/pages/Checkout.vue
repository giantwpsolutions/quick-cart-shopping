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
import { ref, watch, onMounted } from 'vue'
import { pagesData, isLoadingPagesData, loadPagesData } from '@/data/pageDataFetch'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])

const form = ref({ ...props.modelValue })
watch(() => props.modelValue, v => (form.value = { ...v }), { deep: true })

function update(k, v) {
  form.value[k] = v
  emit('update:modelValue', { ...form.value })
}

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

if (!form.value.progressBarStyle) update('progressBarStyle', 'style1')
if (!form.value.progressBarColor) update('progressBarColor', '#05291B')
if (!form.value.progressLabelTextColor) update('progressLabelTextColor', '#ffffff')
if (!form.value.progressLabelBgColor) update('progressLabelBgColor', '#3498db')
if (form.value.enableThankYouPage === undefined) update('enableThankYouPage', true)
if (!form.value.thankYouDisplay) update('thankYouDisplay', 'popup')
if (!form.value.popupBgColor) update('popupBgColor', '#ffffff')
if (form.value.showOrderSummary === undefined) update('showOrderSummary', true)
if (!form.value.thankYouPage) update('thankYouPage', null)
</script>

<template>
  <div class="tw-space-y-6 tw-pt-4 tw-pb-2">

    <!-- Progress Bar Style -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Progress Bar Style", "quick-cart-shopping")}}</h3>

      <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-3">
        <label
          v-for="style in progressBarStyles"
          :key="style.value"
          :class="[
            'tw-group tw-block tw-rounded-lg tw-border-2 tw-bg-white tw-cursor-pointer tw-transition-all tw-duration-200 tw-overflow-hidden',
            form.progressBarStyle===style.value
              ? 'tw-border-[#3498db] tw-shadow-md tw-shadow-[#3498db]/30'
              : 'tw-border-gray-300 hover:tw-border-[#3498db]/50 hover:tw-shadow-sm'
          ]"
        >
          <input
            class="tw-sr-only"
            type="radio"
            name="progressBarStyle"
            :value="style.value"
            :checked="form.progressBarStyle===style.value"
            @change="update('progressBarStyle', style.value)"
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
              v-if="form.progressBarStyle===style.value"
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
                form.progressBarStyle===style.value
                  ? 'tw-bg-[#3498db] tw-border-[#3498db]'
                  : 'tw-border-gray-400 tw-bg-white group-hover:tw-border-[#3498db]'
              ]"
            >
              <svg
                v-if="form.progressBarStyle===style.value"
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
          v-model="form.progressBarColor"
          @active-change="val => update('progressBarColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.progressBarColor || '#05291B' }}</span>
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
          v-model="form.progressLabelTextColor"
          @active-change="val => update('progressLabelTextColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.progressLabelTextColor || '#ffffff' }}</span>
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
          v-model="form.progressLabelBgColor"
          @active-change="val => update('progressLabelBgColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.progressLabelBgColor || '#3498db' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for progress step labels.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Enable Thank You Page -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Enable Thank You Page", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="form.enableThankYouPage"
          @change="val => update('enableThankYouPage', val)"
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
    <div v-if="form.enableThankYouPage" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Thank You Display", "quick-cart-shopping")}}</h3>

      <el-radio-group
        v-model="form.thankYouDisplay"
        @change="val => update('thankYouDisplay', val)"
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
    <div v-if="form.enableThankYouPage && form.thankYouDisplay === 'popup'" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Popup Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="form.popupBgColor"
          @active-change="val => update('popupBgColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.popupBgColor || '#ffffff' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the thank you popup.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Show Order Summary (Conditional - Popup only) -->
    <div v-if="form.enableThankYouPage && form.thankYouDisplay === 'popup'" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Show Order Summary", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="form.showOrderSummary"
          @change="val => update('showOrderSummary', val)"
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
    <div v-if="form.enableThankYouPage && form.thankYouDisplay === 'page'" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Select Thank You Page", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-start tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap tw-pt-2">{{__("Page", "quick-cart-shopping")}}</label>
        <el-select
          v-model="form.thankYouPage"
          @change="val => update('thankYouPage', val)"
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

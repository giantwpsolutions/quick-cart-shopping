<!--
/**
 * Toggle Settings Page
 *
 * Manages cart toggle icon settings including position, style, size,
 * badge display, colors, border shape, and page visibility options.
 *
 * @component Toggle
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

const positionOptions = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
]

const base = (typeof qcshoppingPluginData !== 'undefined' && qcshoppingPluginData.pluginUrl)
  ? (qcshoppingPluginData.pluginUrl.endsWith('/') ? qcshoppingPluginData.pluginUrl : qcshoppingPluginData.pluginUrl + '/')
  : '/';

const iconStyleOptions = [
  { value: 'cart', label: 'Shopping Cart', img: `${base}assets/icons/shopping-cart.svg` },
  { value: 'cart-solid', label: 'Shopping Cart Solid', img: `${base}assets/icons/shopping-cart-solid.svg` },
  { value: 'bag', label: 'Shopping Bag', img: `${base}assets/icons/shopping-bag.svg` },
  { value: 'bag-solid', label: 'Shopping Bag Solid', img: `${base}assets/icons/shopping-bag-solid.svg` },
]

const borderShapeOptions = [
  { value: 'none', label: 'None' },
  { value: 'circle', label: 'Circle' },
  { value: 'rounded', label: 'Rounded' },
]

onMounted(() => {
  loadPagesData()
})

if (!form.value.iconPosition) update('iconPosition', 'bottom-right')
if (!form.value.iconStyle) update('iconStyle', 'cart')
if (!form.value.iconSize) update('iconSize', 60)
if (form.value.showBadge === undefined) update('showBadge', true)
if (!form.value.badgeBgColor) update('badgeBgColor', '#3498db')
if (!form.value.badgeTextColor) update('badgeTextColor', '#ffffff')
if (!form.value.iconBgColor) update('iconBgColor', '#05291B')
if (!form.value.iconColor) update('iconColor', '#ffffff')
if (!form.value.hideOnPages) update('hideOnPages', [])
if (!form.value.borderShape) update('borderShape', 'circle')
</script>

<template>
  <div class="tw-space-y-6 tw-pt-4 tw-pb-2">

    <!-- Cart Icon Position -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Cart Icon Position", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Position", "quick-cart-shopping")}}</label>
        <el-select
          v-model="form.iconPosition"
          @change="val => update('iconPosition', val)"
          size="default"
          style="width: 180px;"
        >
          <el-option
            v-for="opt in positionOptions"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label"
          />
        </el-select>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose where the cart toggle button appears on your site.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Icon Style -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Icon Style", "quick-cart-shopping")}}</h3>

      <!-- responsive grid: icon cards -->
      <div class="tw-flex tw-gap-3 tw-flex-wrap">
        <label
          v-for="icon in iconStyleOptions"
          :key="icon.value"
          :class="[
            'tw-group tw-block tw-rounded-lg tw-border-2 tw-bg-white tw-cursor-pointer tw-transition-all tw-duration-200 tw-overflow-hidden tw-w-[70px]',
            form.iconStyle===icon.value
              ? 'tw-border-[#3498db] tw-shadow-md tw-shadow-[#3498db]/30'
              : 'tw-border-gray-300 hover:tw-border-[#3498db]/50 hover:tw-shadow-sm'
          ]"
        >
          <input
            class="tw-sr-only"
            type="radio"
            name="iconStyle"
            :value="icon.value"
            :checked="form.iconStyle===icon.value"
            @change="update('iconStyle', icon.value)"
          />

          <!-- Icon container -->
          <div class="tw-relative tw-w-[70px] tw-h-[70px] tw-overflow-hidden tw-bg-gray-50 tw-p-2.5 tw-flex tw-items-center tw-justify-center">
            <img
              :src="icon.img"
              :alt="icon.label"
              class="tw-max-w-[50px] tw-max-h-[50px] tw-object-contain tw-transition-transform tw-duration-200 group-hover:tw-scale-110"
              loading="lazy"
              decoding="async"
            />
            <!-- Selected checkmark overlay -->
            <div
              v-if="form.iconStyle===icon.value"
              class="tw-absolute tw-top-1 tw-right-1 tw-bg-[#3498db] tw-rounded-full tw-w-4 tw-h-4 tw-flex tw-items-center tw-justify-center"
            >
              <svg
                class="tw-w-3 tw-h-3 tw-text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </label>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Select the icon design for the cart toggle button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Icon Size -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Icon Size", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Size", "quick-cart-shopping")}}</label>
        <div class="tw-flex tw-items-center tw-gap-1">
          <el-input-number
            v-model="form.iconSize"
            :min="40"
            :max="120"
            :step="1"
            size="small"
            @change="val => update('iconSize', val)"
            controls-position="right"
          />
          <span class="tw-text-gray-500 tw-text-sm">px</span>
        </div>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Set the size of the cart icon in pixels (40-120).", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Show Item Count Badge -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Show Item Count Badge", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="form.showBadge"
          @change="val => update('showBadge', val)"
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
        {{__("Display the number of items in the cart on the toggle icon.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Badge Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Badge Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="form.badgeBgColor"
          @active-change="val => update('badgeBgColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.badgeBgColor || '#3498db' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the item count badge.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Badge Text Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Badge Text Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="form.badgeTextColor"
          @active-change="val => update('badgeTextColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.badgeTextColor || '#ffffff' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the text color for the item count badge.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Icon Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Icon Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="form.iconBgColor"
          @active-change="val => update('iconBgColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.iconBgColor || '#05291B' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the cart icon button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Icon Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Icon Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="form.iconColor"
          @active-change="val => update('iconColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.iconColor || '#ffffff' }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the color for the cart icon itself.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Icon Border Shape -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Icon Border Shape", "quick-cart-shopping")}}</h3>

      <el-radio-group
        v-model="form.borderShape"
        @change="val => update('borderShape', val)"
        class="tw-flex tw-gap-3"
      >
        <el-radio
          v-for="opt in borderShapeOptions"
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
        {{__("Select the border style for the cart icon button.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Hide on Pages -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Hide on Pages", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-start tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap tw-pt-2">{{__("Pages", "quick-cart-shopping")}}</label>
        <el-select
          v-model="form.hideOnPages"
          @change="val => update('hideOnPages', val)"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="2"
          :placeholder="isLoadingPagesData ? 'Loading pages...' : 'Select pages'"
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
        {{__("Select pages where the cart icon should not be displayed.", "quick-cart-shopping")}}
      </p>
    </div>

  </div>
</template>

<style scoped>
/* Remove Element Plus input-number extra border */
:deep(.el-input-number) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-input-number .el-input__wrapper) {
  box-shadow: none !important;
}

/* Color picker styling */
:deep(.el-color-picker__trigger) {
  border: 2px solid #d1d5db;
}
</style>

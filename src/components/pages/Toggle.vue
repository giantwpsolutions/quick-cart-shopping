<!-- src/components/pages/Toggle.vue -->
<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])

const form = ref({ ...props.modelValue })
watch(() => props.modelValue, v => (form.value = { ...v }), { deep: true })

function update(k, v) {
  form.value[k] = v
  emit('update:modelValue', { ...form.value })
}

// Icon position options
const positionOptions = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
]

// Icon style options
const iconStyleOptions = [
  { value: 'cart', label: 'Shopping Cart' },
  { value: 'bag', label: 'Shopping Bag' },
  { value: 'basket', label: 'Basket' },
]

// Border shape options
const borderShapeOptions = [
  { value: 'none', label: 'None' },
  { value: 'circle', label: 'Circle' },
  { value: 'rounded', label: 'Rounded' },
]

// Pages list (will be fetched from API)
const pagesList = ref([])

// Fetch pages on mount
onMounted(async () => {
  try {
    const response = await fetch('/wp-json/quick-cart-shopping/v1/pages')
    if (response.ok) {
      pagesList.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch pages:', error)
  }
})

// Initialize defaults
if (!form.value.iconPosition) update('iconPosition', 'bottom-right')
if (!form.value.iconStyle) update('iconStyle', 'cart')
if (!form.value.iconSize) update('iconSize', 60)
if (form.value.showBadge === undefined) update('showBadge', true)
if (!form.value.badgeBgColor) update('badgeBgColor', '#3498db')
if (!form.value.iconBgColor) update('iconBgColor', '#05291B')
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

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Style", "quick-cart-shopping")}}</label>
        <el-select
          v-model="form.iconStyle"
          @change="val => update('iconStyle', val)"
          size="default"
          style="width: 180px;"
        >
          <el-option
            v-for="opt in iconStyleOptions"
            :key="opt.value"
            :value="opt.value"
            :label="opt.label"
          />
        </el-select>
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
          @change="val => update('badgeBgColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.badgeBgColor }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the item count badge.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Icon Background Color -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Icon Background Color", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Color", "quick-cart-shopping")}}</label>
        <el-color-picker
          v-model="form.iconBgColor"
          @change="val => update('iconBgColor', val)"
          size="default"
          show-alpha
        />
        <span class="tw-text-xs tw-text-gray-600 tw-font-mono">{{ form.iconBgColor }}</span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose the background color for the cart icon button.", "quick-cart-shopping")}}
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
          placeholder="Select pages"
          size="default"
          style="width: 100%; max-width: 400px;"
        >
          <el-option
            v-for="page in pagesList"
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

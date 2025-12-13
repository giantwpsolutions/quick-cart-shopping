<!-- src/components/pages/Layout.vue -->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit  = defineEmits(['update:modelValue'])

const form = ref({ ...props.modelValue })
watch(() => props.modelValue, v => (form.value = { ...v }), { deep: true })

function update(k, v) {
  form.value[k] = v
  emit('update:modelValue', { ...form.value })
}

/* Robust base:
   - Dev: served from '/'
   - Build (WP admin): use QC.distUrl from wp_localize_script, else pluginData.pluginUrl, else '/'
*/
const base = (typeof pluginData !== 'undefined' && pluginData.pluginUrl)
  ? (pluginData.pluginUrl.endsWith('/') ? pluginData.pluginUrl : pluginData.pluginUrl + '/')
  : '/';

const imgSide  = `${base}assets/images/sidecart.png`
const imgPopup = `${base}assets/images/middlecart.png`

const cartOptions = [
  { key: 'side',   title: 'Side Cart',  img: imgSide  },
  { key: 'popup',  title: 'Popup Cart', img: imgPopup },
]

// ensure defaults to avoid undefined when user first lands here
if (!form.value.cartOption) update('cartOption', 'side')
if (!form.value.cartWidth) update('cartWidth', 400)
if (!form.value.animation) update('animation', 'slide')
</script>

<template>
  <div class="tw-space-y-6 tw-pt-4 tw-pb-2">
    <!-- Cart option (image radios) -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Choose Cart Option", "quick-cart-shopping")}}</h3>

      <!-- responsive grid: smaller cards -->
      <div class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 tw-gap-3">
        <label
          v-for="o in cartOptions"
          :key="o.key"
          :class="[
            'tw-group tw-block tw-rounded-lg tw-border-2 tw-bg-white tw-cursor-pointer tw-transition-all tw-duration-200 tw-overflow-hidden',
            form.cartOption===o.key
              ? 'tw-border-[#3498db] tw-shadow-md tw-shadow-[#3498db]/30'
              : 'tw-border-gray-300 hover:tw-border-[#3498db]/50 hover:tw-shadow-sm'
          ]"
        >
          <input
            class="tw-sr-only"
            type="radio"
            name="cartOption"
            :value="o.key"
            :checked="form.cartOption===o.key"
            @change="update('cartOption', o.key)"
          />

          <!-- Image container -->
          <div class="tw-relative tw-aspect-[4/3] tw-overflow-hidden tw-bg-gray-50">
            <img
              :src="o.img"
              :alt="o.title"
              class="tw-h-full tw-w-full tw-object-cover tw-transition-transform tw-duration-200 group-hover:tw-scale-105"
              loading="lazy"
              decoding="async"
            />
            <!-- Selected badge overlay -->
            <div
              v-if="form.cartOption===o.key"
              class="tw-absolute tw-top-2 tw-right-2 tw-bg-gradient-to-r tw-from-[#3498db] tw-to-[#2980b9] tw-text-white tw-px-2 tw-py-0.5 tw-rounded-full tw-text-[10px] tw-font-semibold tw-shadow-md"
            >
              {{__("Selected", "quick-cart-shopping")}}
            </div>
          </div>

          <!-- Title and radio indicator -->
          <div class="tw-flex tw-items-center tw-justify-between tw-p-2.5 tw-bg-white">
            <div class="tw-text-xs tw-font-medium tw-text-gray-700">{{ o.title }}</div>
            <!-- Custom radio indicator -->
            <span
              :class="[
                'tw-inline-flex tw-h-4 tw-w-4 tw-rounded-full tw-border-2 tw-transition-all tw-duration-200 tw-flex-shrink-0',
                form.cartOption===o.key
                  ? 'tw-bg-[#3498db] tw-border-[#3498db]'
                  : 'tw-border-gray-400 tw-bg-white group-hover:tw-border-[#3498db]'
              ]"
              aria-hidden="true"
            >
              <svg
                v-if="form.cartOption===o.key"
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
        {{__("Choose the layout style for your shopping cart display.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Cart Width -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Cart Width", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Width", "quick-cart-shopping")}}</label>
        <div class="tw-flex tw-items-center tw-gap-1">
          <el-input-number
            v-model="form.cartWidth"
            :min="300"
            :max="800"
            :step="1"
            size="small"
            @change="val => update('cartWidth', val)"
            controls-position="right"
          />
          <span class="tw-text-gray-500 tw-text-sm">px</span>
        </div>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Set the width of the cart in pixels (300-800)", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Animation Style -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">{{__("Animation Style", "quick-cart-shopping")}}</h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-gray-700 tw-font-medium tw-whitespace-nowrap">{{__("Animation", "quick-cart-shopping")}}</label>
        <el-select
          v-model="form.animation"
          @change="val => update('animation', val)"
          size="default"
          style="width: 180px;"
        >
          <el-option value="slide" :label="__('Slide In', 'quick-cart-shopping')" />
          <el-option value="fade" :label="__('Fade In', 'quick-cart-shopping')" />
          <el-option value="slide-fade" :label="__('Slide & Fade', 'quick-cart-shopping')" />
          <el-option value="bounce" :label="__('Bounce In', 'quick-cart-shopping')" />
        </el-select>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Choose how the cart appears when opened.", "quick-cart-shopping")}}
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
</style>

<!--
/**
 * Settings Page
 *
 * Additional plugin configuration and advanced settings options.
 *
 * @component Settings
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { productService } from '@/api/services/productService'

const props = defineProps({ modelValue: { type: Object, required: true } })
const emit = defineEmits(['update:modelValue'])

const form = ref({ ...props.modelValue })
watch(() => props.modelValue, v => (form.value = { ...v }), { deep: true })

function update(k, v) {
  form.value[k] = v
  emit('update:modelValue', { ...form.value })
}

// Initialize default values
if (form.value.enableAdvancedSettings === undefined) update('enableAdvancedSettings', false)
if (form.value.showUpsellProducts === undefined) update('showUpsellProducts', false)
if (form.value.upsellProducts === undefined) update('upsellProducts', [])

// Products list for select
const products = ref([])
const loadingProducts = ref(false)

// Fetch products using productService
async function fetchProducts() {
  loadingProducts.value = true
  try {
    const data = await productService.getProducts({ per_page: 100 })
    products.value = data.map(product => ({
      value: product.id,
      label: product.name
    }))
  } catch (error) {
    console.error('Failed to fetch products:', error)
    ElMessage.error({ message: 'Failed to load products', offset: 120 })
  } finally {
    loadingProducts.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

// License management
const licenseKey = ref('')
const licenseStatus = ref('inactive') // 'active' or 'inactive'
const activatingLicense = ref(false)

// Check if Pro is active
const isProActive = computed(() => {
  return window.qcshoppingPluginData?.proActive || false
})

// Activate/Deactivate license
async function toggleLicense() {
  activatingLicense.value = true
  try {
    if (licenseStatus.value === 'active') {
      // Deactivate license
      licenseStatus.value = 'inactive'
      ElMessage.success({ message: 'License deactivated successfully', offset: 120 })
    } else {
      // Activate license
      if (!licenseKey.value.trim()) {
        ElMessage.warning({ message: 'Please enter a license key', offset: 120 })
        return
      }
      // TODO: Add API call to validate license
      licenseStatus.value = 'active'
      ElMessage.success({ message: 'License activated successfully', offset: 120 })
    }
  } catch (error) {
    ElMessage.error({ message: error.message || 'Failed to update license', offset: 120 })
  } finally {
    activatingLicense.value = false
  }
}
</script>

<template>
  <div class="tw-space-y-6 tw-pt-4 tw-pb-2">

        <!-- License Section - Only show when Pro is active -->
    <div v-if="isProActive" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-3">
        {{__("Pro License", "quick-cart-shopping")}}
      </h3>

      <div class="tw-flex tw-items-center tw-gap-3">
        <div class="tw-w-1/3">
          <el-input
            v-model="licenseKey"
            :placeholder="__('Enter your license key', 'quick-cart-shopping')"
            :disabled="licenseStatus === 'active'"
            size="default"
          />
        </div>

        <el-button
          :type="licenseStatus === 'active' ? 'danger' : 'primary'"
          :loading="activatingLicense"
          @click="toggleLicense"
        >
          {{ licenseStatus === 'active' ? __('Deactivate', 'quick-cart-shopping') : __('Activate', 'quick-cart-shopping') }}
        </el-button>

        <span v-if="licenseStatus === 'active'" class="tw-text-sm tw-text-green-600 tw-font-medium">
          ✓ {{__("Active", "quick-cart-shopping")}}
        </span>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Enter your license key to activate premium features and receive updates.", "quick-cart-shopping")}}
      </p>
    </div>
    <!-- Enable Advanced Settings -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Enable Advanced Settings", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="form.enableAdvancedSettings"
          @change="val => update('enableAdvancedSettings', val)"
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
        {{__("Enable advanced configuration options for the plugin.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Upsell Products Show on Cart Panel -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <div class="tw-flex tw-items-center tw-mb-3">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Upsell Products Show on Cart Panel", "quick-cart-shopping")}}</h4>
        <el-switch
          v-model="form.showUpsellProducts"
          @change="val => update('showUpsellProducts', val)"
          class="ml-2"
          size="large"
          inline-prompt
          active-color="#05291B"
          inactive-color="#d1d5db"
          active-text="Yes"
          inactive-text="No"
        />
      </div>

      <!-- Show product selection when enabled -->
      <div v-if="form.showUpsellProducts" class="tw-mt-4">
        <h5 class="tw-text-sm tw-font-medium tw-mb-2">{{__("Related Products", "quick-cart-shopping")}}</h5>
        <el-select
          v-model="form.upsellProducts"
          multiple
          :placeholder="__('Select up to 2 products', 'quick-cart-shopping')"
          :loading="loadingProducts"
          size="large"
          class="tw-w-full"
          :max-collapse-tags="2"
          collapse-tags
          collapse-tags-tooltip
          @change="val => update('upsellProducts', val)"
        >
          <el-option
            v-for="product in products"
            :key="product.value"
            :label="product.label"
            :value="product.value"
            :disabled="form.upsellProducts.length >= 2 && !form.upsellProducts.includes(product.value)"
          />
        </el-select>
        <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
          {{__("Select up to 2 products to display as upsell in the cart panel. Products will use your theme's default styling.", "quick-cart-shopping")}}
        </p>
      </div>

      <p v-if="!form.showUpsellProducts" class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Display related products in the cart panel to encourage additional purchases.", "quick-cart-shopping")}}
      </p>
    </div>



  </div>
</template>

<style scoped>
/* Settings page styling */
</style>

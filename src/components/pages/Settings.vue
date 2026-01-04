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
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { productService } from '@/api/services/productService'
import { licenseService } from '@/api/services/licenseService'

const props = defineProps({
  modelValue: { type: Object, required: true },
  isProPluginInstalled: { type: Boolean, default: false },
  isProActive: { type: Boolean, default: false },
  licenseStatus: { type: String, default: 'inactive' }
})
const emit = defineEmits(['update:modelValue', 'update:licenseStatus', 'update:isProActive'])

const form = ref({ ...props.modelValue })
watch(() => props.modelValue, v => (form.value = { ...v }), { deep: true })

function update(k, v) {
  form.value[k] = v
  emit('update:modelValue', { ...form.value })
}

// License management
const licenseKey = ref('')
const activatingLicense = ref(false)

// Fetch license key on mount and display as hashed
onMounted(async () => {
  fetchProducts()

  // Fetch current license key if Pro plugin is installed
  if (props.isProPluginInstalled) {
    try {
      const response = await licenseService.getStatus()
      if (response && response.license_key) {
        // Show license key as asterisks
        licenseKey.value = '*'.repeat(response.license_key.length)
      }
    } catch (error) {
      console.error('Failed to fetch license key:', error)
    }
  }
})

// Local reactive state for license that updates immediately
const localLicenseStatus = ref(props.licenseStatus)
const localIsProActive = ref(props.isProActive)

// Watch for prop changes
watch(() => props.licenseStatus, (newVal) => {
  localLicenseStatus.value = newVal
})

watch(() => props.isProActive, (newVal) => {
  localIsProActive.value = newVal
})

async function activateLicense() {
  if (!licenseKey.value.trim()) {
    ElMessage.warning({ message: 'Please enter a license key', offset: 120 })
    return
  }

  // Don't activate if already showing hashed key (already active)
  if (licenseKey.value.startsWith('*')) {
    ElMessage.info({ message: 'License is already active', offset: 120 })
    return
  }

  activatingLicense.value = true
  try {
    const result = await licenseService.activate(licenseKey.value.trim())

    if (result.success && result.data && result.data.status === 'valid') {
      // Show license key as hashed
      const keyLength = licenseKey.value.length
      licenseKey.value = '*'.repeat(keyLength)

      // Update local state immediately
      localLicenseStatus.value = 'valid'
      localIsProActive.value = true

      ElMessage.success({ message: 'License activated successfully!', offset: 120 })
    } else {
      const errorMessage = result.message || 'Failed to activate license'
      ElMessage.error({ message: errorMessage, offset: 120 })
    }
  } catch (error) {
    console.error('License activation error:', error)
    ElMessage.error({ message: error.message || 'Failed to activate license', offset: 120 })
  } finally {
    activatingLicense.value = false
  }
}

async function deactivateLicense() {
  activatingLicense.value = true
  try {
    const result = await licenseService.deactivate()

    if (result.success) {
      // Clear license key field
      licenseKey.value = ''

      // Update local state immediately
      localLicenseStatus.value = 'inactive'
      localIsProActive.value = false

      ElMessage.success({ message: 'License deactivated successfully!', offset: 120 })
    } else {
      ElMessage.error({ message: 'Failed to deactivate license', offset: 120 })
    }
  } catch (error) {
    console.error('License deactivation error:', error)
    ElMessage.error({ message: 'Failed to deactivate license', offset: 120 })
  } finally {
    activatingLicense.value = false
  }
}

function toggleLicense() {
  if (localLicenseStatus.value === 'valid') {
    deactivateLicense()
  } else {
    activateLicense()
  }
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

// Removed - merged with onMounted above
</script>

<template>
  <div class="tw-space-y-6 tw-pt-4 tw-pb-2">

    <!-- License Activation Section - Only show if Pro plugin is installed -->
    <div v-if="isProPluginInstalled" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm tw-max-w-2xl">
      <h4 class="tw-text-sm tw-font-medium tw-mb-3">{{__("Pro License", "quick-cart-shopping")}}</h4>

      <!-- License Status Display -->
      <div class="tw-mb-3">
        <div class="tw-flex tw-items-center tw-gap-2">
          <span class="tw-text-sm tw-text-gray-700">Status:</span>
          <span
            class="tw-px-2 tw-py-1 tw-text-xs tw-font-semibold tw-rounded"
            :class="{
              'tw-bg-green-100 tw-text-green-800': localLicenseStatus === 'valid',
              'tw-bg-red-100 tw-text-red-800': localLicenseStatus === 'invalid' || localLicenseStatus === 'disabled',
              'tw-bg-yellow-100 tw-text-yellow-800': localLicenseStatus === 'expired',
              'tw-bg-gray-100 tw-text-gray-800': localLicenseStatus === 'inactive' || !localLicenseStatus
            }"
          >
            {{ String(localLicenseStatus || 'inactive').toUpperCase() }}
          </span>
        </div>
      </div>

      <!-- License Input and Button -->
      <div class="tw-flex tw-gap-3">
        <input
          type="password"
          v-model="licenseKey"
          :placeholder="__('Enter your license key', 'quick-cart-shopping')"
          :disabled="localLicenseStatus === 'valid' || activatingLicense"
          class="tw-flex-1 tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-text-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-transparent disabled:tw-bg-gray-100 disabled:tw-cursor-not-allowed"
        />
        <button
          @click="toggleLicense"
          :disabled="activatingLicense || (!licenseKey.trim() && localLicenseStatus !== 'valid')"
          class="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-white tw-rounded-md tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
          :class="{
            'tw-bg-red-400 hover:tw-bg-red-500': localLicenseStatus === 'valid',
            'tw-bg-green-600 hover:tw-bg-green-700': localLicenseStatus !== 'valid'
          }"
        >
          {{ activatingLicense ? __('Processing...', 'quick-cart-shopping') :
             localLicenseStatus === 'valid' ? __('Deactivate', 'quick-cart-shopping') :
             __('Activate', 'quick-cart-shopping') }}
        </button>
      </div>

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-2">
        {{__("Enter your license key to activate Pro features.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Enable Advanced Settings - Commented out for next version -->
    <!-- <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
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
    </div> -->

    <!-- License Warning for Upsell (only show if Pro plugin installed but license not active) -->
    <div v-if="isProPluginInstalled && !localIsProActive" class="tw-border tw-border-red-500 tw-rounded-lg tw-p-4 tw-bg-red-50 tw-shadow-sm">
      <div class="tw-flex tw-items-start tw-gap-3">
        <svg class="tw-w-6 tw-h-6 tw-text-red-600 tw-flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div>
          <h4 class="tw-font-semibold tw-text-red-800 tw-mb-1">Pro License Required</h4>
          <p class="tw-text-sm tw-text-red-700">
            Upsell products feature is a Pro feature. Please activate your license to use these settings.
            <span v-if="localLicenseStatus" class="tw-block tw-mt-1 tw-text-xs">
              Current license status: <strong>{{ localLicenseStatus }}</strong>
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Upsell Products Show on Cart Panel -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm tw-max-w-2xl" :class="{ 'tw-opacity-60 tw-pointer-events-none tw-select-none': !localIsProActive }">
      <div class="tw-flex tw-items-center tw-mb-3">
        <h4 class="tw-text-sm tw-font-medium tw-pr-2">{{__("Upsell Products Show on Cart Panel", "quick-cart-shopping")}}</h4>
        <span v-if="!localIsProActive" class="tw-px-2 tw-py-0.5 tw-text-xs tw-font-bold tw-text-white tw-bg-red-600 tw-rounded tw-ml-2">PRO</span>
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

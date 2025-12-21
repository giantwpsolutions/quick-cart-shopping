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
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

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

    <!-- License Section - Only show when Pro is active -->
    <div v-if="isProActive" class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-4 tw-bg-white tw-shadow-sm">
      <h3 class="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-4">
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

      <p class="tw-text-xs tw-text-gray-500 tw-italic tw-mt-3">
        {{__("Enter your license key to activate premium features and receive updates.", "quick-cart-shopping")}}
      </p>
    </div>

    <!-- Placeholder for future settings -->
    <div class="tw-border tw-border-gray-400 tw-rounded-lg tw-p-6 tw-bg-white tw-shadow-sm tw-text-center">
      <p class="tw-text-sm tw-text-gray-600">
        {{__("More settings options coming soon...", "quick-cart-shopping")}}
      </p>
    </div>

  </div>
</template>

<style scoped>
/* Settings page styling */
</style>

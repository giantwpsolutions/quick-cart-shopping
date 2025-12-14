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
import { ref, watch } from 'vue'

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

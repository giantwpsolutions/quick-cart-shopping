<!--
/**
 * Top Header Navigation Component
 *
 * Displays main navigation menu with logo, responsive mobile menu,
 * and upgrade button. Handles section navigation.
 *
 * @component TopHeader
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, required: true }
})
const emit = defineEmits(['update:modelValue', 'selected', 'upgrade'])

const items = [
  { key: 'general',  label: 'General' },
  { key: 'layout',   label: 'Layout' },
  { key: 'toggle',   label: 'Toggle' },
  { key: 'cart',     label: 'Cart' },
  { key: 'checkout', label: 'Checkout' },
  { key: 'variationPopup', label: 'Variation Popup' },
  { key: 'settings', label: 'Settings' },
]

const mobileMenuOpen = ref(false)

function select(key) {
  emit('update:modelValue', key)
  emit('selected')
  mobileMenuOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const logoUrl = `${qcshoppingPluginData.pluginUrl}assets/images/logo.png`;
</script>
<template>
<header class="qc-header tw-bg-[#2c3e50] tw-text-white tw-shadow-lg tw-border-b tw-border-[#3498db]/20">


    <div class="tw-max-w-[1400px] tw-mx-auto tw-px-3 sm:tw-px-4">
      <div class="tw-min-h-[60px] sm:tw-min-h-[70px] tw-flex tw-items-center tw-gap-3 sm:tw-gap-6">
        <img :src="logoUrl" alt="Logo" class="tw-h-8 sm:tw-h-10 tw-w-auto tw-drop-shadow-md tw-flex-shrink-0" />

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="toggleMobileMenu"
          class="lg:tw-hidden tw-p-2 tw-rounded-lg tw-bg-gray-600/50 hover:tw-bg-gray-600 tw-transition-all"
          aria-label="Toggle menu"
        >
          <svg class="tw-w-6 tw-h-6 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Desktop Navigation -->
        <nav class="tw-hidden lg:tw-flex tw-items-center tw-gap-2 tw-flex-1">
          <button
            v-for="i in items"
            :key="i.key"
            @click="select(i.key)"
            :class="[
              'tw-relative tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm tw-font-medium tw-whitespace-nowrap tw-transition-all tw-duration-200 tw-cursor-pointer',
              modelValue === i.key
                ? 'tw-bg-gradient-to-r tw-from-[#3498db] tw-to-[#2980b9] tw-text-white tw-shadow-lg tw-shadow-[#3498db]/30'
                : 'tw-bg-gray-600/50 tw-text-white hover:tw-bg-gray-600 hover:tw-shadow-md'
            ]"
          >
            {{ i.label }}
          </button>
        </nav>

        <!-- Spacer for mobile -->
        <div class="tw-flex-1 lg:tw-hidden"></div>

        <!-- Upgrade Button -->
        <button
          class="tw-relative tw-px-2.5 sm:tw-px-3 tw-py-1.5 tw-rounded-lg tw-bg-gradient-to-r tw-from-[#3498db] tw-to-[#2980b9] tw-text-white tw-text-xs tw-font-semibold tw-shadow-md hover:tw-shadow-lg hover:tw-from-[#2980b9] hover:tw-to-[#21618c] tw-transition-all tw-duration-200 tw-flex-shrink-0 tw-whitespace-nowrap"
          @click="emit('upgrade')"
        >
          <span>Pro</span>
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div
      v-if="mobileMenuOpen"
      class="lg:tw-hidden tw-bg-[#1e293b] tw-border-t tw-border-[#3498db]/10 tw-max-h-[60vh] tw-overflow-y-auto"
    >
      <nav class="tw-p-3 tw-space-y-2">
        <button
          v-for="i in items"
          :key="i.key"
          @click="select(i.key)"
          :class="[
            'tw-w-full tw-text-left tw-px-4 tw-py-2.5 tw-rounded-lg tw-text-sm tw-font-medium tw-transition-all tw-duration-200',
            modelValue === i.key
              ? 'tw-bg-gradient-to-r tw-from-[#3498db] tw-to-[#2980b9] tw-text-white tw-shadow-lg'
              : 'tw-bg-gray-700/50 tw-text-white hover:tw-bg-gray-700'
          ]"
        >
          {{ i.label }}
        </button>
      </nav>
    </div>

    <div class="tw-h-[2px] sm:tw-h-[3px] tw-bg-gradient-to-r tw-from-[#3498db] tw-via-[#5dade2] tw-to-[#3498db]"></div>
  </header>
</template>


<style scoped>
/* brand color hook for potential usage */
</style>

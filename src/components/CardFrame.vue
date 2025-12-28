<!--
/**
 * Card Frame Component
 *
 * Reusable card wrapper with header, scrollable content area, and footer.
 * Provides save/reset functionality for settings sections.
 *
 * @component CardFrame
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
const props = defineProps({
  title:  { type: String, required: true },
  dirty:  { type: Boolean, default: false },
  saving: { type: Boolean, default: false }
})
const emit = defineEmits(['save','reset'])
</script>

<template>
  <section
    class="tw-bg-white tw-rounded-2xl tw-border tw-border-[#05291B]/10
           tw-shadow-[0_8px_24px_rgba(5,41,27,0.08)]
           tw-flex tw-flex-col tw-overflow-hidden
           tw-h-[calc(100vh-180px)]"
  >
    <!-- Header -->
    <header class="tw-flex tw-items-center tw-justify-between tw-px-4 sm:tw-px-6 tw-py-3 sm:tw-py-4 tw-border-b tw-border-[#05291B]/10 tw-gap-4">
      <div class="tw-flex-1">
        <h2 class="tw-text-lg sm:tw-text-xl tw-font-semibold tw-capitalize tw-text-gray-800">{{ title }}</h2>
        <p class="tw-text-xs sm:tw-text-sm tw-text-slate-500 tw-mt-0.5">Configure {{ title }} options</p>
      </div>
      <el-button
        type="primary"
        class="brand"
        :loading="saving"
        :disabled="!dirty"
        @click="emit('save')"
      >Save</el-button>
    </header>

    <!-- Scrollable body (only this area scrolls) -->
    <div class="tw-flex-1 tw-overflow-y-auto tw-px-4 sm:tw-px-6 tw-py-4">
      <slot />
    </div>

    <!-- Footer (fixed at bottom of the card due to flex layout) -->
    <footer
      class="tw-bg-white tw-border-t tw-border-gray-200
             tw-px-4 sm:tw-px-6 tw-py-2.5 sm:tw-py-3 tw-flex tw-justify-end tw-gap-2"
    >
      <el-button plain :disabled="!dirty" @click="emit('reset')">Reset</el-button>
      <el-button
        type="primary"
        class="brand"
        :loading="saving"
        :disabled="!dirty"
        @click="emit('save')"
      >Save</el-button>
    </footer>
  </section>
</template>

<style scoped>
.brand { --el-color-primary:#0598FB; }
</style>

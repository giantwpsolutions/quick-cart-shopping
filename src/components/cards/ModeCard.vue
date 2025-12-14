<!--
/**
 * Mode Card Component
 *
 * Selectable card for display mode options with visual preview.
 * Supports solid, dark, glass, and gradient styles.
 *
 * @component ModeCard
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  preview: {
    type: String,
    required: true,
    validator: (val) => ['solid','dark','glass','gradient'].includes(val)
  },
  selected: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const previewClass = computed(() => {
  return {
    solid: 'tw-bg-white',
    dark: 'tw-bg-slate-900',
    glass: 'tw-backdrop-blur-sm tw-bg-white/50 tw-border tw-border-white/40',
    gradient: 'tw-bg-gradient-to-br tw-from-[#e9f5f1] tw-to-[#d7e7e1]'
  }[props.preview]
})
</script>

<template>
  <div
    :class="[
      'tw-rounded-xl tw-border tw-bg-white tw-p-3 tw-transition tw-cursor-pointer',
      props.selected
        ? 'tw-border-[#05291B] tw-shadow-[0_0_0_3px_rgba(5,41,27,0.07)]'
        : 'tw-border-[#05291B]/10 hover:tw-border-[#05291B]/40'
    ]"
    @click="emit('click')"
  >
    <div :class="['tw-h-24 tw-rounded-lg tw-border tw-border-[#05291B]/10 tw-mb-2', previewClass]" />
    <div class="tw-text-sm tw-font-medium">{{ props.label }}</div>
  </div>
</template>

<!--
/**
 * Layout Card Component
 *
 * Selectable card for layout options with optional badge.
 *
 * @component LayoutCard
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
const props = defineProps({
  title: { type: String, required: true },
  badge: { type: String, default: '' },
  selected: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
</script>

<template>
  <div
    :class="[
      'tw-relative tw-rounded-xl tw-border tw-bg-white tw-p-4 tw-h-28 tw-flex tw-items-end tw-justify-between tw-cursor-pointer',
      selected
        ? 'tw-border-[#05291B] tw-shadow-[0_0_0_3px_rgba(5,41,27,0.07)]'
        : 'tw-border-[#05291B]/10 hover:tw-border-[#05291B]/40'
    ]"
    @click="$emit('click')"
  >
    <div class="tw-text-lg tw-font-semibold tw-capitalize">{{ title }}</div>
    


    <span
      v-if="badge"
      class="tw-text-[10px] tw-font-semibold tw-tracking-wide tw-bg-[#05291B]/10 tw-text-[#05291B] tw-rounded-md tw-px-2 tw-py-0.5"
    >
      {{ badge }}
    </span>
  </div>
</template>

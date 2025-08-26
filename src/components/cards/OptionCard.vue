<script setup>
const props = defineProps({
  title: { type: String, required: true },
  selected: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
</script>

<template>
  <div
    :class="[
      'tw-relative tw-rounded-xl tw-border tw-bg-white tw-p-4 tw-cursor-pointer tw-transition tw-h-28 tw-flex tw-items-end tw-justify-between',
      props.selected
        ? 'tw-border-[#05291B] tw-shadow-[0_0_0_3px_rgba(5,41,27,0.07)]'
        : 'tw-border-[#05291B]/10 hover:tw-border-[#05291B]/40'
    ]"
    @click="emit('click')"
  >
    <div class="tw-text-sm tw-font-medium">{{ props.title }}</div>
    <span
      :class="[
        'tw-h-4 tw-w-4 tw-rounded-full tw-border',
        props.selected
          ? 'tw-bg-[#05291B] tw-border-[#05291B]'
          : 'tw-border-[#05291B]/30'
      ]"
    />
  </div>
</template>

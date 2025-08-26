<script setup>
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  free: { type: Boolean, default: false }
})

const emit = defineEmits(['install'])
</script>

<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-border tw-border-[#05291B]/10 tw-rounded-xl tw-p-3">
    <div class="tw-flex tw-items-center tw-gap-3">
      <div class="tw-h-10 tw-w-10 tw-rounded-lg tw-bg-[#05291B]/10 tw-flex tw-items-center tw-justify-center tw-font-semibold tw-text-[#05291B]">
        {{ props.title.charAt(0) }}
      </div>
      <div>
        <div class="tw-text-sm tw-font-medium">{{ props.title }}</div>
        <div class="tw-text-xs tw-text-slate-500">{{ props.subtitle }}</div>
      </div>
    </div>

    <el-button
      size="small"
      class="brand-outline"
      plain
      @click="emit('install')"
    >
      {{ props.free ? 'Free' : 'Install' }}
    </el-button>
  </div>
</template>

<style scoped>
.brand-outline {
  --el-color-primary: #05291B;
}
</style>

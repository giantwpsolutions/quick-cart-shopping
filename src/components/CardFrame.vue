<!-- CardFrame.vue -->
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
    class="tw-bg-white tw-rounded-2xl tw-border tw-border-[#05291B]/10 tw-shadow-sm
           tw-flex tw-flex-col tw-overflow-hidden
           tw-h-[calc(100vh-var(--qc-adminbar-h,0px)-64px)]"
  >
    <!-- Header -->
    <header class="tw-flex tw-items-center tw-justify-between tw-p-5 tw-border-b tw-border-[#05291B]/10">
      <div>
        <h2 class="tw-text-lg tw-font-semibold tw-capitalize">{{ title }}</h2>
        <p class="tw-text-xs tw-text-slate-500">Configure {{ title }} options</p>
      </div>
      <el-button
        type="primary"
        class="brand"
        :loading="saving"
        :disabled="!dirty"
        @click="$emit('save')"
      >Save</el-button>
    </header>

    <!-- Scrollable body -->
    <div class="tw-flex-1 tw-overflow-auto tw-p-5">
      <slot />
    </div>

    <!-- Sticky footer -->
    <footer
      class="tw-bg-white tw-border-t tw-border-gray-200
             tw-px-5 tw-pt-3 tw-pb-[18px]  <!-- 3 (12px) + extra ~15px = 27px total bottom padding -->
             tw-flex tw-justify-end tw-gap-2"
    >
      <el-button plain :disabled="!dirty" @click="$emit('reset')">Reset</el-button>
      <el-button
        type="primary"
        class="brand"
        :loading="saving"
        :disabled="!dirty"
        @click="$emit('save')"
      >Save</el-button>
    </footer>
  </section>
</template>

<style scoped>
.brand { --el-color-primary:#05291B; }
</style>

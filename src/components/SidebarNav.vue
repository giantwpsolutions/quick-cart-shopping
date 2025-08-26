<script setup>
const props = defineProps({
  modelValue: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue', 'selected'])

const items = [
  { key: 'general', label: 'General' },
  { key: 'layout', label: 'Layout' },
  { key: 'toggle', label: 'Toggle' },
  { key: 'cart', label: 'Cart' },
  { key: 'mini', label: 'Mini Cart' },
  { key: 'design', label: 'Design' },
  { key: 'checkout', label: 'Checkout Editor' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'opt', label: 'Optimization' },
]

function onSelect(idx) {
  emit('update:modelValue', idx)
  emit('selected')
}
</script>

<template>
  <div>
    <div class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-5 tw-border-b tw-border-[#05291B]/10">
      <span class="tw-inline-flex tw-h-8 tw-w-8 tw-rounded-lg tw-bg-[#05291B] tw-text-white tw-items-center tw-justify-center tw-font-bold">
        Q
      </span>
      <div class="tw-leading-tight">
        <div class="tw-font-semibold">Quick Cart</div>
        <div class="tw-text-xs tw-text-slate-500">Admin Panel</div>
      </div>
    </div>

    <el-menu :default-active="props.modelValue" class="tw-border-0" @select="onSelect">
      <el-menu-item v-for="i in items" :key="i.key" :index="i.key">
        {{ i.label }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

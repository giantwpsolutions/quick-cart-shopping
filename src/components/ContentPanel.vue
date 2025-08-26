<script setup>
import OptionCard from './cards/OptionCard.vue'
import ModeCard from './cards/ModeCard.vue'
import LayoutCard from './cards/LayoutCard.vue'

const props = defineProps({
  active: { type: String, required: true },
  modelValue: {
    type: Object,
    required: true,
    default: () => ({ cartOption: 'side', mode: 'light', layout: 'standard' })
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'reset'])

const cartOptions = [
  { key: 'direct', title: 'Direct Checkout' },
  { key: 'side',   title: 'Side Cart' },
  { key: 'popup',  title: 'Popup Cart' },
]

const modes = [
  { key: 'light', label: 'Light', preview: 'solid' },
  { key: 'dark',  label: 'Dark',  preview: 'dark' },
  { key: 'glass', label: 'Glass', preview: 'glass' },
  { key: 'gradient', label: 'Gradient', preview: 'gradient' },
]

const layouts = [
  { key: 'standard', title: 'Standard' },
  { key: 'split',    title: 'Split', badge: 'PRO' },
  { key: 'compact',  title: 'Compact' },
]

function update(patch) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}
</script>


<template>
  <section class="tw-bg-white tw-rounded-2xl tw-border tw-border-[#05291B]/10 tw-shadow-sm tw-overflow-hidden">
    <div class="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-p-5 tw-border-b tw-border-[#05291B]/10">
      <div>
        <h2 class="tw-text-lg tw-font-semibold capitalize">{{ active }}</h2>
        <p class="tw-text-xs tw-text-slate-500">Choose how your cart behaves and looks</p>
      </div>
      <el-button type="primary" round class="brand-primary" @click="$emit('save')">Save</el-button>
    </div>

    <div class="tw-p-5 tw-space-y-8">
      <div>
        <h3 class="tw-font-medium tw-mb-3">Choose cart option</h3>
        <div class="tw-grid sm:tw-grid-cols-3 tw-gap-4">
          <OptionCard v-for="o in cartOptions" :key="o.key" :title="o.title" :selected="modelValue.cartOption===o.key"
            @click="update({ cartOption: o.key })" />
        </div>
      </div>

      <div>
        <h3 class="tw-font-medium tw-mb-3">Choose mode</h3>
        <div class="tw-grid sm:tw-grid-cols-4 tw-gap-4">
          <ModeCard v-for="m in modes" :key="m.key" :label="m.label" :preview="m.preview" :selected="modelValue.mode===m.key"
            @click="update({ mode: m.key })" />
        </div>
      </div>

      <div>
        <h3 class="tw-font-medium tw-mb-3">Choose layout</h3>
        <div class="tw-grid sm:tw-grid-cols-3 tw-gap-4">
          <LayoutCard v-for="l in layouts" :key="l.key" :title="l.title" :badge="l.badge" :selected="modelValue.layout===l.key"
            @click="update({ layout: l.key })" />
        </div>
      </div>

      <div class="tw-pt-2 tw-flex tw-justify-end">
        <el-button plain @click="$emit('reset')">Reset</el-button>
        <el-button type="primary" class="tw-ml-2 brand-primary" @click="$emit('save')">Save</el-button>
      </div>
    </div>
  </section>
</template>



<style scoped>
.brand-primary { --el-color-primary: #05291B; }
</style>

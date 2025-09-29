<!-- src/components/pages/LayoutSection.vue -->
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ modelValue: { type: Object, required: true } })
const emit  = defineEmits(['update:modelValue'])
const form  = ref({ ...props.modelValue })
watch(() => props.modelValue, v => form.value = { ...v }, { deep: true })

function update(k, v){ form.value[k] = v; emit('update:modelValue', { ...form.value }) }
</script>

<template>
  <div class="tw-space-y-8">
    <!-- Cart option -->
    <div>
      <h3 class="tw-font-medium tw-mb-3">Choose cart option</h3>
      <div class="tw-grid sm:tw-grid-cols-3 tw-gap-4">
        <div :class="['tw-rounded-xl tw-border tw-p-4 tw-cursor-pointer',
                      form.cartOption==='direct' ? 'tw-border-[#05291B]' : 'tw-border-[#05291B]/10']"
             @click="update('cartOption','direct')">Direct Checkout</div>

        <div :class="['tw-rounded-xl tw-border tw-p-4 tw-cursor-pointer',
                      form.cartOption==='side' ? 'tw-border-[#05291B]' : 'tw-border-[#05291B]/10']"
             @click="update('cartOption','side')">Side Cart</div>

        <div :class="['tw-rounded-xl tw-border tw-p-4 tw-cursor-pointer',
                      form.cartOption==='popup' ? 'tw-border-[#05291B]' : 'tw-border-[#05291B]/10']"
             @click="update('cartOption','popup')">Popup Cart</div>
      </div>
    </div>

    <!-- Mode -->
    <div>
      <h3 class="tw-font-medium tw-mb-3">Choose mode</h3>
      <el-radio-group v-model="form.mode" @change="val=>update('mode',val)">
        <el-radio-button label="light">Light</el-radio-button>
        <el-radio-button label="dark">Dark</el-radio-button>
        <el-radio-button label="glass">Glass</el-radio-button>
        <el-radio-button label="gradient">Gradient</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Layout -->
    <div>
      <h3 class="tw-font-medium tw-mb-3">Choose layout</h3>
      <el-select class="tw-w-64" v-model="form.layout" @change="val=>update('layout', val)">
        <el-option label="Standard" value="standard" />
        <el-option label="Split" value="split" />
        <el-option label="Compact" value="compact" />
      </el-select>
    </div>
  </div>
</template>

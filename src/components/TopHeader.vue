<!-- src/components/admin/TopHeader.vue -->
<script setup>

const props = defineProps({
  modelValue: { type: String, required: true } // active key
})
const emit = defineEmits(['update:modelValue', 'selected', 'upgrade'])

const items = [
  { key: 'general',  label: 'General' },
  { key: 'layout',   label: 'Layout' },
  { key: 'toggle',   label: 'Toggle' },
  { key: 'cart',     label: 'Cart' },
  { key: 'mini',     label: 'Mini Cart' },
  { key: 'design',   label: 'Design' },
  { key: 'checkout', label: 'Checkout Editor' },
  { key: 'mobile',   label: 'Mobile' },
  { key: 'opt',      label: 'Optimization' },
]

function select(key) {
  emit('update:modelValue', key)
  emit('selected')
}

const logoUrl = `${pluginData.pluginUrl}assets/images/logo.png`;
</script>

<template>
  <header
    class="tw-sticky fix-adminbar-top tw-top-0 tw-z-50 tw-w-full
           tw-bg-[#1f2937] tw-text-white tw-shadow-sm tw-border-b tw-border-black/10"
  >
    <div class="tw-max-w-[1400px] tw-mx-auto tw-px-4">
      <!-- set min-h-[70px] for logo support -->
      <div class="tw-min-h-[70px] tw-flex tw-items-center tw-gap-5">
        <!-- Logo -->
        <div class="tw-flex tw-items-center tw-gap-2 tw-shrink-0">
          <!-- Replace this with your actual <img> logo -->
          <img :src="logoUrl" alt="Logo" class="tw-h-10 tw-w-auto" />
        </div>
        <!-- Nav -->
        <nav class="tw-flex tw-items-center tw-gap-1 tw-overflow-x-auto tw-flex-1 tw-pr-2">
          <button
            v-for="i in items"
            :key="i.key"
            @click="select(i.key)"
            :class="[ 
              'tw-px-3 tw-py-1.5 tw-rounded-lg tw-text-sm tw-whitespace-nowrap tw-transition tw-cursor-pointer',
              props.modelValue === i.key
                ? 'tw-bg-white/10 tw-text-white tw-ring-1 tw-ring-white/20'
                : 'tw-text-black/80 hover:tw-text-white hover:tw-bg-white/5'
            ]">
            {{ i.label }}
          </button>
        </nav>

        <!-- Right actions -->
        <div class="tw-flex tw-items-center tw-gap-3">
          <button
            class="tw-relative tw-px-3 tw-py-1.5 tw-rounded-lg tw-bg-white/10 tw-text-white tw-text-sm hover:tw-bg-white/15"
            @click="$emit('upgrade')"
          >
            Upgrade
            <span
              class="tw-ml-2 tw-align-middle tw-text-[11px] tw-font-bold tw-rounded tw-px-1.5 tw-py-0.5
                     tw-bg-red-500 tw-text-white"
            >Pro</span>
          </button>
        </div>
      </div>
    </div>

    <!-- subtle divider under the dark bar -->
    <div class="tw-h-[6px] tw-bg-gray-100"></div>
  </header>
</template>

<style scoped>
/* brand color hook for potential usage */
</style>

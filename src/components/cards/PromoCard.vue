<!--
/**
 * Promo Card Component
 *
 * Displays promotional content for recommended add-ons with
 * install button and icon.
 *
 * @component PromoCard
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  icon: { type: String, default: '' },
  installUrl: { type: String, required: true }
})

const handleInstall = () => {
  window.open(props.installUrl, '_blank')
}
</script>

<template>
  <div class="tw-group tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-transition-all tw-duration-200 hover:tw-border-gray-300 hover:tw-shadow-sm tw-bg-gray-50">
    <div class="tw-flex tw-items-start tw-gap-3 tw-mb-3">
      <div v-if="props.icon" class="tw-flex-shrink-0 tw-h-14 tw-w-14 tw-rounded-lg tw-bg-white tw-border tw-border-gray-200 tw-flex tw-items-center tw-justify-center tw-transition-transform group-hover:tw-scale-105">
        <img :src="props.icon" :alt="props.title" class="tw-h-12 tw-w-12 tw-object-contain" />
      </div>
      <div v-else class="tw-flex-shrink-0 tw-h-14 tw-w-14 tw-rounded-lg tw-bg-gray-200 tw-flex tw-items-center tw-justify-center tw-font-bold tw-text-gray-700 tw-text-xl tw-transition-transform group-hover:tw-scale-105">
        {{ props.title.charAt(0) }}
      </div>
      <div class="tw-flex-1 tw-min-w-0">
        <h4 class="tw-text-sm tw-font-bold tw-text-gray-900 tw-mb-1">{{ props.title }}</h4>
        <p class="tw-text-xs tw-text-slate-600 tw-leading-relaxed">{{ props.subtitle }}</p>
      </div>
    </div>

    <el-button
      size="small"
      class="brand-outline tw-w-full"
      plain
      @click="handleInstall"
    >
      {{__("Install", "quick-cart-shopping")}}
    </el-button>
  </div>
</template>

<style scoped>
.brand-outline {
  --el-color-primary: #05291B;
}
</style>

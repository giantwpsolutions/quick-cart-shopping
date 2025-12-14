<!--
/**
 * Promo Panel Component
 *
 * Displays recommended add-ons, customization offer, and help links
 * in the sidebar area.
 *
 * @component PromoPanel
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
import PromoCard from './cards/PromoCard.vue'

const promos = [
  { title: 'Hydra',  subtitle: 'All-in-One Booking System', free: true },
  { title: 'BEAF',   subtitle: 'Before/After Image Gallery', free: true },
  { title: 'Tourfic',subtitle: 'Travel & Hotel Booking', free: true },
]
</script>

<template>
  <aside class="tw-bg-white tw-rounded-2xl tw-border tw-border-[#05291B]/10
         tw-shadow-[0_8px_24px_rgba(5,41,27,0.08)] tw-h-fit">
    <div class="tw-px-4 sm:tw-px-5 tw-py-2.5 sm:tw-py-3 tw-border-b tw-border-[#05291B]/10">
      <h3 class="tw-text-base sm:tw-text-lg tw-font-semibold tw-text-gray-800">Recommended Add-ons</h3>
      <p class="tw-text-xs sm:tw-text-sm tw-text-slate-500">Curated tools that work well with Quick Cart</p>
    </div>

    <div class="tw-p-3 sm:tw-p-4 tw-space-y-3">
      <PromoCard
        v-for="p in promos"
        :key="p.title"
        :title="p.title"
        :subtitle="p.subtitle"
        :free="p.free"
        @install="$emit('contact')"
      />

      <div class="tw-border tw-border-dashed tw-border-[#05291B]/20 tw-rounded-xl tw-p-4">
        <div class="tw-text-sm tw-font-medium tw-mb-1">Need Customization?</div>
        <p class="tw-text-xs tw-text-slate-500 tw-mb-3">Our team can tailor the checkout to your exact needs.</p>
        <el-button class="brand-outline" plain @click="$emit('contact')">Get Free Quote</el-button>
      </div>

      <div class="tw-space-y-2">
        <a href="#" class="help-link">Documentation</a>
        <a href="#" class="help-link">Get Support</a>
        <a href="#" class="help-link">Join our Community</a>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.brand-outline { --el-color-primary:#05291B; }

/* Replace @apply with plain CSS so it always works */
.help-link {
  font-size: 0.875rem;        /* tw-text-sm */
  line-height: 1.25rem;       /* tw-text-sm line-height */
  color: #05291B;             /* tw-text-[#05291B] */
  text-decoration: none;
}
.help-link:hover {
  text-decoration: underline; /* hover:tw-underline */
}
</style>

<!--
/**
 * Promo Panel Component
 *
 * Displays recommended add-ons and help links in the sidebar area.
 *
 * @component PromoPanel
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
import PromoCard from './cards/PromoCard.vue'
import { computed } from 'vue'

// Get plugin URL from WordPress localized data
const pluginUrl = computed(() => {
  return window.qcshoppingPluginData?.pluginUrl || ''
})

const promos = computed(() => [
  {
    title: 'PrimeKit Addons',
    subtitle: 'Powerful Elementor Addons for WordPress',
    icon: `${pluginUrl.value}assets/images/primekit.png`,
    installUrl: window.qcshoppingPluginData?.primekit_search_url || 'https://wordpress.org/plugins/primekit-addons/'
  },
  {
    title: 'GiantWP Discount Rules',
    subtitle: 'Advanced WooCommerce Discount & Pricing Plugin',
    icon: `${pluginUrl.value}assets/images/giantwpdiscountrules.png`,
    installUrl: window.qcshoppingPluginData?.giantwp_discount_rules_url || 'https://wordpress.org/plugins/giantwp-discount-rules/'
  },
])

const helpLinks = computed(() => [
  {
    url: window.qcshoppingPluginData?.docsUrl || 'https://www.docs.giantwpsolutions.com/',
    icon: '📚',
    label: 'Documentation'
  },
  {
    url: window.qcshoppingPluginData?.supportUrl || 'https://www.giantwpsolutions.com/support/',
    icon: '💬',
    label: 'Get Support'
  },
  {
    url: window.qcshoppingPluginData?.communityUrl || 'https://www.facebook.com/groups/giantwpsolutions',
    icon: '👥',
    label: 'Join Community'
  }
])
</script>

<template>
  <aside class="tw-bg-white tw-rounded-lg tw-border tw-border-gray-200
         tw-shadow-md tw-h-fit tw-sticky tw-top-4">
    <!-- Header -->
    <div class="tw-px-4 sm:tw-px-5 tw-py-3.5 sm:tw-py-4 tw-border-b tw-border-gray-200">
      <h3 class="tw-text-base sm:tw-text-lg tw-font-bold tw-text-gray-800">{{__("Our Other Plugins", "quick-cart-shopping")}}</h3>
      <p class="tw-text-xs sm:tw-text-sm tw-text-slate-500 tw-mt-0.5">{{__("Explore more tools to enhance your store", "quick-cart-shopping")}}</p>
    </div>

    <!-- Promo Cards -->
    <div class="tw-p-3 sm:tw-p-4 tw-space-y-3">
      <PromoCard
        v-for="p in promos"
        :key="p.title"
        :title="p.title"
        :subtitle="__(p.subtitle, 'quick-cart-shopping')"
        :icon="p.icon"
        :install-url="p.installUrl"
      />

      <!-- Help Links Section -->
      <div class="tw-pt-3 tw-mt-3 tw-border-t tw-border-gray-200">
        <h4 class="tw-text-sm tw-font-semibold tw-text-gray-800 tw-mb-2.5">{{__("Need Help?", "quick-cart-shopping")}}</h4>
        <div class="tw-space-y-2">
          <a
            v-for="link in helpLinks"
            :key="link.label"
            :href="link.url"
            class="help-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="tw-mr-2">{{ link.icon }}</span>
            <span>{{__(link.label, "quick-cart-shopping")}}</span>
          </a>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.brand-outline {
  --el-color-primary: #05291B;
}

/* Help links styling */
.help-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #05291B;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background-color: transparent;
}

.help-link:hover {
  background-color: rgba(5, 41, 27, 0.05);
  transform: translateX(4px);
}
</style>

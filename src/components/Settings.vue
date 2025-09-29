<!-- Settings.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopHeader from './TopHeader.vue'
import CardFrame from './CardFrame.vue'
import PromoPanel from './PromoPanel.vue'

const route = useRoute()
const router = useRouter()

// v-model target for TopHeader
const activeMenu = computed({
  get: () => (route.name ? String(route.name) : 'general'),
  set: (name) => { if (name && name !== route.name) router.push({ name }) }
})

// …your settings state + save/reset as you already have…
</script>

<template>
  <!-- Put the header at the very top -->
  <TopHeader v-model="activeMenu" @upgrade="() => window.open('https://your-upgrade-url', '_blank')" />

  <!-- Your existing layout below -->
  <div class="tw-px-3 md:tw-px-6 tw-pt-6">
    <div class="tw-grid tw-grid-cols-1 xl:tw-grid-cols-[1fr_320px] tw-gap-6">
      <CardFrame :title="String($route.name || 'general')" :dirty="/* your dirty flag */ false">
        <RouterView />
      </CardFrame>
      <PromoPanel />
    </div>
  </div>
</template>

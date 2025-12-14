<!--
/**
 * Settings Container Component
 *
 * Manages plugin settings state, routing, and dirty tracking.
 * Provides centralized state management for all settings sections.
 *
 * @component Settings
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
import { reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopHeader from './TopHeader.vue'
import CardFrame from './CardFrame.vue'
import PromoPanel from './PromoPanel.vue'
import { ElMessage } from 'element-plus'

const defaults = {
  general  : { enableQuickCart: true, brandColor: '#05291B' },
  layout   : { cartOption: 'side', mode: 'light', layout: 'standard' },
  toggle   : { iconPosition: 'bottom-right', iconStyle: 'cart', iconSize: 60, showBadge: true, badgeBgColor: '#3498db', badgeTextColor: '#ffffff', iconBgColor: '#05291B', iconColor: '#ffffff', hideOnPages: [], borderShape: 'circle' },
  cart     : { showShipping: true, showCouponField: true, checkoutBtnBgColor: '#05291B', checkoutBtnTextColor: '#ffffff', showCheckoutBtn: true },
  checkout : { progressBarStyle: 'style1', progressBarColor: '#05291B', progressLabelTextColor: '#ffffff', progressLabelBgColor: '#3498db', enableThankYouPage: true, thankYouDisplay: 'popup', popupBgColor: '#ffffff', showOrderSummary: true, thankYouPage: null },
  settings : { enableAdvancedSettings: false },
}

const settings = reactive(structuredClone(defaults))

const route = useRoute()
const router = useRouter()

const sectionKey = computed(() => {
  const name = typeof route.name === 'string' ? route.name : 'general'
  if (!(name in settings) && (name in defaults)) settings[name] = structuredClone(defaults[name])
  return name in settings ? name : 'general'
})

const activeMenu = computed({
  get: () => sectionKey.value,
  set: (name) => { if (name && name !== route.name) router.push({ name }) }
})

const dirty = reactive({})
watch(() => settings[sectionKey.value], () => { dirty[sectionKey.value] = true }, { deep: true })

function save()   { dirty[sectionKey.value] = false; ElMessage.success('Settings saved') }
function reset()  { settings[sectionKey.value] = structuredClone(defaults[sectionKey.value]); dirty[sectionKey.value] = false; ElMessage.info('Reset to defaults') }
</script>

<template>
  <div class="tw-min-h-screen tw-bg-gray-50 tw-pt-[62px] ">
    <!--  header -->
    <TopHeader v-model="activeMenu" @upgrade="() => window.open('https://your-upgrade-url', '_blank')" />


    <!-- Content -->
    <div class="tw-px-3 sm:tw-px-4 md:tw-px-6 lg:tw-px-8 tw-pb-8 tw-pt-3 sm:tw-pt-4">
    <div class="tw-grid tw-grid-cols-1 xl:tw-grid-cols-[1fr_360px] tw-gap-4 sm:tw-gap-6 lg:tw-gap-8 tw-items-start">
      <CardFrame :title="sectionKey" :dirty="!!dirty[sectionKey]" @save="save" @reset="reset">
        <!-- IMPORTANT: pass v-model to the route component -->
        <RouterView v-slot="{ Component }">
          <component :is="Component" v-if="settings[sectionKey]" v-model="settings[sectionKey]" />
          <div v-else class="tw-text-sm tw-text-red-600">Section not initialized.</div>
        </RouterView>
      </CardFrame>

      <PromoPanel />
    </div>
    </div>
  </div>
</template>

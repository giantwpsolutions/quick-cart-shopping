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
import { reactive, computed, watch, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TopHeader from './TopHeader.vue'
import CardFrame from './CardFrame.vue'
import PromoPanel from './PromoPanel.vue'
import { ElMessage } from 'element-plus'
import { generalSettingsService } from '@/api/services/generalSettingsService'
import { layoutSettingsService } from '@/api/services/layoutSettingsService'
import { toggleSettingsService } from '@/api/services/toggleSettingsService'
import { cartSettingsService } from '@/api/services/cartSettingsService'
import { checkoutSettingsService } from '@/api/services/checkoutSettingsService'
import { generalMessages, layoutMessages, toggleMessages, cartMessages, checkoutMessages, commonMessages } from '@/data/messages'

const defaults = {
  general  : { enableQuickCart: true, enableVarProduct: true, enableDragAndDrop: true, enableDirectCheckout: true },
  layout   : { cartOption: 'side', cartWidth: 400, animation: 'slide' },
  toggle   : { iconPosition: 'bottom-right', iconStyle: 'cart', iconSize: 60, showBadge: true, badgeBgColor: '#3498db', badgeTextColor: '#ffffff', iconBgColor: '#05291B', iconColor: '#ffffff', hideOnPages: [], borderShape: 'circle' },
  cart     : { showShipping: true, showCouponField: true, checkoutBtnBgColor: '#05291B', checkoutBtnTextColor: '#ffffff', showCheckoutBtn: true },
  checkout : { progressBarStyle: 'style1', progressBarColor: '#05291B', progressLabelTextColor: '#ffffff', progressLabelBgColor: '#3498db', enableThankYouPage: true, thankYouDisplay: 'popup', popupBgColor: '#ffffff', showOrderSummary: true, thankYouPage: null },
  settings : { enableAdvancedSettings: false },
}

const settings = reactive(structuredClone(defaults))
const saving = ref(false)
const loading = ref(true)

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

async function save() {
  saving.value = true
  try {
    if (sectionKey.value === 'general') {
      await generalSettingsService.save(settings.general)
      dirty[sectionKey.value] = false
      ElMessage.success({ message: generalMessages.saveSuccess, offset: 120 })
    } else if (sectionKey.value === 'layout') {
      await layoutSettingsService.save(settings.layout)
      dirty[sectionKey.value] = false
      ElMessage.success({ message: layoutMessages.saveSuccess, offset: 120 })
    } else if (sectionKey.value === 'toggle') {
      await toggleSettingsService.save(settings.toggle)
      dirty[sectionKey.value] = false
      ElMessage.success({ message: toggleMessages.saveSuccess, offset: 120 })
    } else if (sectionKey.value === 'cart') {
      await cartSettingsService.save(settings.cart)
      dirty[sectionKey.value] = false
      ElMessage.success({ message: cartMessages.saveSuccess, offset: 120 })
    } else if (sectionKey.value === 'checkout') {
      await checkoutSettingsService.save(settings.checkout)
      dirty[sectionKey.value] = false
      ElMessage.success({ message: checkoutMessages.saveSuccess, offset: 120 })
    } else {
      dirty[sectionKey.value] = false
      ElMessage.success({ message: commonMessages.settingsSaved, offset: 120 })
    }
  } catch (error) {
    const errorMsg = sectionKey.value === 'general' ? generalMessages.saveFailed :
                     sectionKey.value === 'layout' ? layoutMessages.saveFailed :
                     sectionKey.value === 'toggle' ? toggleMessages.saveFailed :
                     sectionKey.value === 'cart' ? cartMessages.saveFailed :
                     sectionKey.value === 'checkout' ? checkoutMessages.saveFailed :
                     'Failed to save settings'
    ElMessage.error({ message: error.message || errorMsg, offset: 120 })
  } finally {
    saving.value = false
  }
}

function reset() {
  settings[sectionKey.value] = structuredClone(defaults[sectionKey.value])
  dirty[sectionKey.value] = false

  const resetMsg = sectionKey.value === 'general' ? generalMessages.resetSuccess :
                   sectionKey.value === 'layout' ? layoutMessages.resetSuccess :
                   sectionKey.value === 'toggle' ? toggleMessages.resetSuccess :
                   sectionKey.value === 'cart' ? cartMessages.resetSuccess :
                   sectionKey.value === 'checkout' ? checkoutMessages.resetSuccess :
                   'Reset to defaults'
  ElMessage.info({ message: resetMsg, offset: 120 })
}

onMounted(async () => {
  try {
    // Load general settings
    const generalResponse = await generalSettingsService.get()
    if (generalResponse.success && generalResponse.settings && Object.keys(generalResponse.settings).length > 0) {
      const data = generalResponse.settings
      if (data.enableQuickCart !== undefined) settings.general.enableQuickCart = data.enableQuickCart
      if (data.enableVarProduct !== undefined) settings.general.enableVarProduct = data.enableVarProduct
      if (data.enableDragAndDrop !== undefined) settings.general.enableDragAndDrop = data.enableDragAndDrop
      if (data.enableDirectCheckout !== undefined) settings.general.enableDirectCheckout = data.enableDirectCheckout
      dirty.general = false
    }

    // Load layout settings
    const layoutResponse = await layoutSettingsService.get()
    if (layoutResponse.success && layoutResponse.settings && Object.keys(layoutResponse.settings).length > 0) {
      const data = layoutResponse.settings
      if (data.cartOption !== undefined) settings.layout.cartOption = data.cartOption
      if (data.cartWidth !== undefined) settings.layout.cartWidth = data.cartWidth
      if (data.animation !== undefined) settings.layout.animation = data.animation
      dirty.layout = false
    }

    // Load toggle settings
    const toggleResponse = await toggleSettingsService.get()
    if (toggleResponse.success && toggleResponse.settings && Object.keys(toggleResponse.settings).length > 0) {
      const data = toggleResponse.settings
      if (data.iconPosition !== undefined) settings.toggle.iconPosition = data.iconPosition
      if (data.iconStyle !== undefined) settings.toggle.iconStyle = data.iconStyle
      if (data.iconSize !== undefined) settings.toggle.iconSize = data.iconSize
      if (data.showBadge !== undefined) settings.toggle.showBadge = data.showBadge
      if (data.badgeBgColor !== undefined) settings.toggle.badgeBgColor = data.badgeBgColor
      if (data.badgeTextColor !== undefined) settings.toggle.badgeTextColor = data.badgeTextColor
      if (data.iconBgColor !== undefined) settings.toggle.iconBgColor = data.iconBgColor
      if (data.iconColor !== undefined) settings.toggle.iconColor = data.iconColor
      if (data.hideOnPages !== undefined) settings.toggle.hideOnPages = data.hideOnPages
      if (data.borderShape !== undefined) settings.toggle.borderShape = data.borderShape
      dirty.toggle = false
    }

    // Load cart settings
    const cartResponse = await cartSettingsService.get()
    if (cartResponse.success && cartResponse.settings && Object.keys(cartResponse.settings).length > 0) {
      const data = cartResponse.settings
      if (data.showShipping !== undefined) settings.cart.showShipping = data.showShipping
      if (data.showCouponField !== undefined) settings.cart.showCouponField = data.showCouponField
      if (data.checkoutBtnBgColor !== undefined) settings.cart.checkoutBtnBgColor = data.checkoutBtnBgColor
      if (data.checkoutBtnTextColor !== undefined) settings.cart.checkoutBtnTextColor = data.checkoutBtnTextColor
      if (data.showCheckoutBtn !== undefined) settings.cart.showCheckoutBtn = data.showCheckoutBtn
      dirty.cart = false
    }

    // Load checkout settings
    const checkoutResponse = await checkoutSettingsService.get()
    if (checkoutResponse.success && checkoutResponse.settings && Object.keys(checkoutResponse.settings).length > 0) {
      const data = checkoutResponse.settings
      if (data.progressBarStyle !== undefined) settings.checkout.progressBarStyle = data.progressBarStyle
      if (data.progressBarColor !== undefined) settings.checkout.progressBarColor = data.progressBarColor
      if (data.progressLabelTextColor !== undefined) settings.checkout.progressLabelTextColor = data.progressLabelTextColor
      if (data.progressLabelBgColor !== undefined) settings.checkout.progressLabelBgColor = data.progressLabelBgColor
      if (data.enableThankYouPage !== undefined) settings.checkout.enableThankYouPage = data.enableThankYouPage
      if (data.thankYouDisplay !== undefined) settings.checkout.thankYouDisplay = data.thankYouDisplay
      if (data.popupBgColor !== undefined) settings.checkout.popupBgColor = data.popupBgColor
      if (data.showOrderSummary !== undefined) settings.checkout.showOrderSummary = data.showOrderSummary
      if (data.thankYouPage !== undefined) settings.checkout.thankYouPage = data.thankYouPage
      dirty.checkout = false
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="tw-min-h-screen tw-bg-gray-50 tw-pt-[46px] ">
    <!--  header -->
    <TopHeader v-model="activeMenu" @upgrade="() => window.open('https://your-upgrade-url', '_blank')" />


    <!-- Content -->
    <div class="tw-px-3 sm:tw-px-4 md:tw-px-6 lg:tw-px-8 tw-pb-8 tw-pt-3 sm:tw-pt-4">
    <div class="tw-grid tw-grid-cols-1 xl:tw-grid-cols-[1fr_360px] tw-gap-4 sm:tw-gap-6 lg:tw-gap-8 tw-items-start">
      <CardFrame :title="sectionKey" :dirty="!!dirty[sectionKey]" :saving="saving" @save="save" @reset="reset">
        <!-- Loading State -->
        <div v-if="loading" class="tw-flex tw-items-center tw-justify-center tw-py-20">
          <div class="tw-text-center">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-b-2 tw-border-[#05291B]"></div>
            <p class="tw-mt-4 tw-text-sm tw-text-gray-600">Loading settings...</p>
          </div>
        </div>

        <!-- IMPORTANT: pass v-model to the route component -->
        <RouterView v-else v-slot="{ Component }">
          <component :is="Component" v-if="settings[sectionKey]" v-model="settings[sectionKey]" />
          <div v-else class="tw-text-sm tw-text-red-600">Section not initialized.</div>
        </RouterView>
      </CardFrame>

      <PromoPanel />
    </div>
    </div>
  </div>
</template>

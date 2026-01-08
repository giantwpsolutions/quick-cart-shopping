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
import { variationPopupSettingsService } from '@/api/services/variationPopupSettingsService'
import { settingsService } from '@/api/services/settingsService'
import { licenseService } from '@/api/services/licenseService'
import { generalMessages, layoutMessages, toggleMessages, cartMessages, checkoutMessages, variationPopupMessages, commonMessages } from '@/data/messages'

// License state
const isProPluginInstalled = ref(false)
const licenseStatus = ref('inactive')
const isProActive = ref(window.qcshoppingPluginData?.proActive || false)

const defaults = {
  general  : { enableQuickCart: true, enableVarProduct: true, enableDragAndDrop: true, enableDirectCheckout: true },
  layout   : { cartOption: 'side', cartWidth: 650, animation: 'slide' },
  toggle   : { iconPosition: 'bottom-right', iconStyle: 'cart', iconSize: 60, showBadge: true, badgeBgColor: '#3498db', badgeTextColor: '#ffffff', iconBgColor: '#05291B', iconColor: '#ffffff', hideOnPages: [], borderShape: 'circle', offsetTop: 20, offsetBottom: 20, offsetLeft: 20, offsetRight: 20 },
  cart     : { showShipping: true, showCouponField: true, couponBtnBgColor: '#05291B', couponBtnTextColor: '#ffffff', checkoutBtnBgColor: '#05291B', checkoutBtnTextColor: '#ffffff', viewCartBtnBgColor: '#ffffff', viewCartBtnTextColor: '#05291B', showCheckoutBtn: true },
  checkout : { enableStep1: true, step1Label: 'Cart Review', enableStep2: true, step2Label: 'Billing Details', enableStep3: true, step3Label: 'Shipping Details', enableStep4: true, step4Label: 'Payment', progressBarStyle: 'style1', progressBarColor: '#05291B', progressLabelTextColor: '#ffffff', progressLabelBgColor: '#3498db', nextBtnBgColor: '#05291B', nextBtnTextColor: '#ffffff', previousBtnBgColor: '#6b7280', previousBtnTextColor: '#ffffff', backToCartBtnBgColor: '#e5e7eb', backToCartBtnTextColor: '#374151', enableThankYouPage: true, thankYouDisplay: 'popup', popupBgColor: '#ffffff', showOrderSummary: true, thankYouPage: null },
  variationPopup : { closeButtonBgColor: '#f5f5f5', closeButtonIconColor: '#666666', popupWidth: 1000, addToCartButtonBgColor: '#05291B', addToCartButtonTextColor: '#ffffff' },
  settings : { enableAdvancedSettings: false, showUpsellProducts: false, upsellProducts: [] },
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
      // Ensure offset values are numbers before saving
      const toggleData = {
        ...settings.toggle,
        offsetTop: Number(settings.toggle.offsetTop || 20),
        offsetBottom: Number(settings.toggle.offsetBottom || 20),
        offsetLeft: Number(settings.toggle.offsetLeft || 20),
        offsetRight: Number(settings.toggle.offsetRight || 20)
      }
      await toggleSettingsService.save(toggleData)
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
    } else if (sectionKey.value === 'variationPopup') {
      await variationPopupSettingsService.save(settings.variationPopup)
      dirty[sectionKey.value] = false
      ElMessage.success({ message: variationPopupMessages.saveSuccess, offset: 120 })
    } else if (sectionKey.value === 'settings') {
      await settingsService.save(settings.settings)
      dirty[sectionKey.value] = false
      ElMessage.success({ message: 'Settings saved successfully', offset: 120 })
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
                     sectionKey.value === 'variationPopup' ? variationPopupMessages.saveFailed :
                     sectionKey.value === 'settings' ? 'Failed to save settings' :
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
                   sectionKey.value === 'variationPopup' ? variationPopupMessages.resetSuccess :
                   'Reset to defaults'
  ElMessage.info({ message: resetMsg, offset: 120 })
}

function handleUpgrade() {
  // Direct redirect to upgrade page
  window.location.href = 'https://giantwpsolutions.com/quick-cart-shopping/'
}

onMounted(async () => {
  try {
    // Check license status first (if Pro is installed)
    try {
      const licenseResponse = await licenseService.getStatus()
      if (licenseResponse && licenseResponse.license_status !== undefined) {
        // Pro plugin is installed
        isProPluginInstalled.value = true
        licenseStatus.value = licenseResponse.license_status
        isProActive.value = licenseResponse.license_status === 'valid'
      }
    } catch (error) {
      // License API not available - Pro plugin likely not installed
      // Use the initial value from PHP
      isProPluginInstalled.value = isProActive.value
    }

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
      if (data.offsetTop !== undefined) settings.toggle.offsetTop = Number(data.offsetTop)
      if (data.offsetBottom !== undefined) settings.toggle.offsetBottom = Number(data.offsetBottom)
      if (data.offsetLeft !== undefined) settings.toggle.offsetLeft = Number(data.offsetLeft)
      if (data.offsetRight !== undefined) settings.toggle.offsetRight = Number(data.offsetRight)
      dirty.toggle = false
    }

    // Load cart settings
    const cartResponse = await cartSettingsService.get()
    if (cartResponse.success && cartResponse.settings && Object.keys(cartResponse.settings).length > 0) {
      const data = cartResponse.settings
      if (data.showShipping !== undefined) settings.cart.showShipping = data.showShipping
      if (data.showCouponField !== undefined) settings.cart.showCouponField = data.showCouponField
      if (data.couponBtnBgColor !== undefined) settings.cart.couponBtnBgColor = data.couponBtnBgColor
      if (data.couponBtnTextColor !== undefined) settings.cart.couponBtnTextColor = data.couponBtnTextColor
      if (data.checkoutBtnBgColor !== undefined) settings.cart.checkoutBtnBgColor = data.checkoutBtnBgColor
      if (data.checkoutBtnTextColor !== undefined) settings.cart.checkoutBtnTextColor = data.checkoutBtnTextColor
      if (data.viewCartBtnBgColor !== undefined) settings.cart.viewCartBtnBgColor = data.viewCartBtnBgColor
      if (data.viewCartBtnTextColor !== undefined) settings.cart.viewCartBtnTextColor = data.viewCartBtnTextColor
      if (data.showCheckoutBtn !== undefined) settings.cart.showCheckoutBtn = data.showCheckoutBtn
      dirty.cart = false
    }

    // Load checkout settings (Pro feature only)
    if (isProPluginInstalled.value) {
      try {
        const checkoutResponse = await checkoutSettingsService.get()
        if (checkoutResponse.success && checkoutResponse.settings && Object.keys(checkoutResponse.settings).length > 0) {
          const data = checkoutResponse.settings
          if (data.enableStep1 !== undefined) settings.checkout.enableStep1 = data.enableStep1
          if (data.step1Label !== undefined) settings.checkout.step1Label = data.step1Label
          if (data.enableStep2 !== undefined) settings.checkout.enableStep2 = data.enableStep2
          if (data.step2Label !== undefined) settings.checkout.step2Label = data.step2Label
          if (data.enableStep3 !== undefined) settings.checkout.enableStep3 = data.enableStep3
          if (data.step3Label !== undefined) settings.checkout.step3Label = data.step3Label
          if (data.enableStep4 !== undefined) settings.checkout.enableStep4 = data.enableStep4
          if (data.step4Label !== undefined) settings.checkout.step4Label = data.step4Label
          if (data.progressBarStyle !== undefined) settings.checkout.progressBarStyle = data.progressBarStyle
          if (data.progressBarColor !== undefined) settings.checkout.progressBarColor = data.progressBarColor
          if (data.progressLabelTextColor !== undefined) settings.checkout.progressLabelTextColor = data.progressLabelTextColor
          if (data.progressLabelBgColor !== undefined) settings.checkout.progressLabelBgColor = data.progressLabelBgColor
          if (data.nextBtnBgColor !== undefined) settings.checkout.nextBtnBgColor = data.nextBtnBgColor
          if (data.nextBtnTextColor !== undefined) settings.checkout.nextBtnTextColor = data.nextBtnTextColor
          if (data.previousBtnBgColor !== undefined) settings.checkout.previousBtnBgColor = data.previousBtnBgColor
          if (data.previousBtnTextColor !== undefined) settings.checkout.previousBtnTextColor = data.previousBtnTextColor
          if (data.backToCartBtnBgColor !== undefined) settings.checkout.backToCartBtnBgColor = data.backToCartBtnBgColor
          if (data.backToCartBtnTextColor !== undefined) settings.checkout.backToCartBtnTextColor = data.backToCartBtnTextColor
          if (data.enableThankYouPage !== undefined) settings.checkout.enableThankYouPage = data.enableThankYouPage
          if (data.thankYouDisplay !== undefined) settings.checkout.thankYouDisplay = data.thankYouDisplay
          if (data.popupBgColor !== undefined) settings.checkout.popupBgColor = data.popupBgColor
          if (data.showOrderSummary !== undefined) settings.checkout.showOrderSummary = data.showOrderSummary
          if (data.thankYouPage !== undefined) settings.checkout.thankYouPage = data.thankYouPage
          dirty.checkout = false
        }
      } catch (error) {
        console.warn('[Settings] Checkout settings not available:', error.message)
      }
    }

    // Load variation popup settings
    const variationPopupResponse = await variationPopupSettingsService.get()
    if (variationPopupResponse.success && variationPopupResponse.settings && Object.keys(variationPopupResponse.settings).length > 0) {
      const data = variationPopupResponse.settings
      if (data.closeButtonBgColor !== undefined) settings.variationPopup.closeButtonBgColor = data.closeButtonBgColor
      if (data.closeButtonIconColor !== undefined) settings.variationPopup.closeButtonIconColor = data.closeButtonIconColor
      if (data.popupWidth !== undefined) settings.variationPopup.popupWidth = data.popupWidth
      if (data.addToCartButtonBgColor !== undefined) settings.variationPopup.addToCartButtonBgColor = data.addToCartButtonBgColor
      if (data.addToCartButtonTextColor !== undefined) settings.variationPopup.addToCartButtonTextColor = data.addToCartButtonTextColor
      dirty.variationPopup = false
    }

    // Load advanced settings (upsell products, etc.)
    const settingsResponse = await settingsService.get()
    if (settingsResponse.success && settingsResponse.settings && Object.keys(settingsResponse.settings).length > 0) {
      const data = settingsResponse.settings
      if (data.enableAdvancedSettings !== undefined) settings.settings.enableAdvancedSettings = data.enableAdvancedSettings
      if (data.showUpsellProducts !== undefined) settings.settings.showUpsellProducts = data.showUpsellProducts
      if (data.upsellProducts !== undefined) settings.settings.upsellProducts = data.upsellProducts
      dirty.settings = false
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="tw-min-h-screen">
    <!--  header -->
    <TopHeader v-model="activeMenu" :isProActive="isProActive" @upgrade="handleUpgrade" />


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
          <component
            :is="Component"
            v-if="settings[sectionKey]"
            v-model="settings[sectionKey]"
            :isProPluginInstalled="isProPluginInstalled"
            :isProActive="isProActive"
            :licenseStatus="licenseStatus"
          />
          <div v-else class="tw-text-sm tw-text-red-600">Section not initialized.</div>
        </RouterView>
      </CardFrame>

      <PromoPanel />
    </div>
    </div>
  </div>
</template>

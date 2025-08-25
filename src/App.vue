<template>
  <div class="tw-min-h-screen tw-bg-[#f8faf9] tw-text-slate-800">
    <el-container>
      <el-aside width="260px" class="tw-bg-white tw-sticky tw-top-0 tw-h-screen tw-hidden md:tw-block">
        <SidebarNav v-model:active="activeMenu" />
      </el-aside>

      <el-main class="tw-w-full tw-px-3 md:tw-px-6 tw-py-6">
        <div class="tw-grid tw-grid-cols-1 xl:tw-grid-cols-[1fr_320px] tw-gap-6">
          <ContentPanel
            v-model:form="form"
            :active="activeMenu"
            @save="save"
            @reset="reset"
          />
          <PromoPanel @contact="contact" />
        </div>
      </el-main>
    </el-container>

    <!-- mobile actions -->
    <div class="md:tw-hidden tw-fixed tw-bottom-4 tw-inset-x-0 tw-px-4 tw-flex tw-justify-center">
      <div class="tw-bg-white tw-rounded-full tw-shadow-lg tw-border tw-border-[#05291B]/10 tw-p-1 tw-flex tw-gap-1">
        <el-button size="small" class="tw-rounded-full" @click="drawer = true">Menu</el-button>
        <el-button size="small" type="primary" class="tw-rounded-full brand-primary" @click="save">Save</el-button>
      </div>
    </div>

    <!-- mobile drawer -->
    <el-drawer v-model="drawer" size="80%" :with-header="false">
      <SidebarNav v-model:active="activeMenu" @selected="drawer=false" class="tw-p-2" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeMenu = ref('layout')
const drawer = ref(false)

const form = ref({
  cartOption: 'side',
  mode: 'light',
  layout: 'standard',
})

function save() {
  ElMessage.success('Settings saved')
}
function reset() {
  form.value = { cartOption: 'side', mode: 'light', layout: 'standard' }
  ElMessage.info('Reset to defaults')
}
function contact() {
  ElMessage.info('We will reach out shortly!')
}
</script>

<style scoped>
.brand-primary { --el-color-primary: #05291B; }
</style>

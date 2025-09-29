// src/router.js
import { createRouter, createWebHashHistory } from 'vue-router'

import General  from '@/components/pages/General.vue'
import Layout   from '@/components/pages/Layout.vue'
import Toggle   from '@/components/pages/Toggle.vue'
import Cart    from '@/components/pages/Cart.vue'
import Mini     from '@/components/pages/Mini.vue'
import Design   from '@/components/pages/Design.vue'
import Checkout from '@/components/pages/Checkout.vue'



export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/general' },
    { path: '/general',  name: 'general',  component: General },
    { path: '/layout',   name: 'layout',   component: Layout },
    { path: '/toggle',   name: 'toggle',   component: Toggle },
    { path: '/cart',     name: 'cart',     component: Cart },
    { path: '/mini',     name: 'mini',     component: Mini },
    { path: '/design',   name: 'design',   component: Design },
    { path: '/checkout', name: 'checkout', component: Checkout },

  ],
  scrollBehavior: () => ({ top: 0 })
})
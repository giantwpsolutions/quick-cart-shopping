/**
 * Router Configuration
 *
 * Defines application routes and navigation for all settings pages.
 * Uses hash-based routing for WordPress admin compatibility.
 *
 * @module router
 * @since 1.0.0
 * @package Quick Cart Shopping
 */

import { createRouter, createWebHashHistory } from 'vue-router'

import General  from '@/components/pages/General.vue'
import Layout   from '@/components/pages/Layout.vue'
import Toggle   from '@/components/pages/Toggle.vue'
import Cart    from '@/components/pages/Cart.vue'
import Checkout from '@/components/pages/Checkout.vue'
import Settings from '@/components/pages/Settings.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/general' },
    { path: '/general',  name: 'general',  component: General },
    { path: '/layout',   name: 'layout',   component: Layout },
    { path: '/toggle',   name: 'toggle',   component: Toggle },
    { path: '/cart',     name: 'cart',     component: Cart },
    { path: '/checkout', name: 'checkout', component: Checkout },
    { path: '/settings', name: 'settings', component: Settings },
  ],
  scrollBehavior: () => ({ top: 0 })
})

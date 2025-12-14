/**
 * Main Entry Point
 *
 * Initializes the Vue application with routing, Element Plus UI library,
 * and WordPress i18n translation functions.
 *
 * @module main
 * @since 1.0.0
 * @package Quick Cart Shopping
 */

import './assets/main.css'
import { createApp } from 'vue'
import './style.css'
import './tailwindcss.css'
import { router } from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import App from './App.vue'

const { __, _x, _n, _nx } = wp.i18n;

const app = createApp(App);

app.config.globalProperties.__ = __;
app.config.globalProperties._x = _x;
app.config.globalProperties._n = _n;
app.config.globalProperties._nx = _nx;

app.use(router);
app.use(ElementPlus);

app.mount('#quick-cart-shopping');

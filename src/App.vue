<!--
/**
 * App Root Component
 *
 * Main application wrapper that renders the Settings component.
 *
 * @component App
 * @since 1.0.0
 * @package Quick Cart Shopping
 */
-->
<script setup>
import Settings from './components/Settings.vue';
</script>

<template>
  <div class="qc-app-wrapper">
    <Settings />
  </div>
</template>

<style>
.qc-app-wrapper {
  min-height: 100vh;
  position: relative;
}
</style>
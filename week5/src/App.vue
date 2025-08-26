<script setup>
import BHeader from './components/BHeader.vue'
</script>

<template>
  <BHeader />
  <main class="container py-4 app-container">
    <router-view/>
  </main>
</template>

<style>
/* keep empty or minimal; global styles live in src/assets/theme.css */
</style>

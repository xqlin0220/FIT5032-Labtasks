<template>
  <section class="mt-5 text-center">
    <h1 class="mb-3">Access Denied</h1>
    <p class="text-muted mb-4">You must be logged in to view this page.</p>
    <router-link class="btn btn-outline-primary" :to="{ name: 'Login', query: { redirect: nextPath } }">
      Go to Login
    </router-link>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const nextPath = route.query.redirect || '/about'
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3 position-relative">
      <!-- middle: navigation -->
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/books/add" class="nav-link" active-class="active" aria-current="page">Add Book</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/GetBookCount" class="nav-link" active-class="active">Get Book Count</router-link>
        </li>

        <!-- not logged in -->
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/signup" class="nav-link" active-class="active">Firebase Register</router-link>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/signin" class="nav-link" active-class="active">Firebase Login</router-link>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/WeatherCheck" class="nav-link" active-class="active">Get Weather</router-link>
        </li>

        <!-- already logged in -->
      </ul>

      <!-- right side: user info and logout -->
      <div class="position-absolute end-0 top-50 translate-middle-y d-flex align-items-center gap-2 me-3">
        <span v-if="isAuthenticated" class="text-muted small">
          Hello, {{ currentUserEmail }}
          <span v-if="currentUserRole"> (role: {{ currentUserRole }})</span>
        </span>
        <span v-else class="text-muted small">Not signed in</span>
        <button v-if="isAuthenticated" class="btn btn-outline-danger btn-sm" @click="doLogout">Logout</button>
      </div>
    </header>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, currentUserEmail, currentUserRole, logout } from '@/stores/firebaseAuth' // import store

const router = useRouter()
const doLogout = async () => {
  await logout()
  router.push('/signin')
}
</script>

<style scoped>
.avatar{
  width: 26px; height: 26px;
  display:inline-flex; align-items:center; justify-content:center;
  border-radius: 50%; background:#e9ecef; color:#495057;
  font-weight:700; font-size:12px;
}
</style>
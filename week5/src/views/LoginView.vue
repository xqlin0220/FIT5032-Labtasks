<template>
  <div class="login mt-5">
    <h1 class="text-center mb-4">Login</h1>

    <form @submit.prevent="handleLogin" class="w-50 mx-auto">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input id="username" type="text" class="form-control" v-model="username" required />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input id="password" type="password" class="form-control" v-model="password" required />
      </div>

      <button type="submit" class="btn btn-primary w-100">Login</button>

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../stores/auth'

const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''
  const ok = login(username.value, password.value)
  if (!ok) {
    error.value = 'Invalid username or password.'
    return
  }
  const redirect = route.query.redirect || '/about'
  router.push(redirect)
}
</script>

<style scoped>
.login { max-width: 600px; margin: 0 auto; }
</style>

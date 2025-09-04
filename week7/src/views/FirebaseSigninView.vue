<template>
  <div class="login mt-5">
    <h1 class="text-center mb-4">Login</h1>

    <form @submit.prevent="handleLogin" class="w-50 mx-auto">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input id="email" type="email" class="form-control" v-model="email" required />
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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const auth = getAuth()

const handleLogin = () => {
  error.value = ''
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((cred) => {
      console.log('[Login] success user:', cred.user) // print user info to console
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    })
    .catch((err) => {
      console.error('Login failed:', err.code, err.message)
      error.value = err.message
    })
}
</script>

<style scoped>
.login { max-width: 600px; margin: 0 auto; }
</style>
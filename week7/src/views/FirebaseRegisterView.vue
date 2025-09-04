<template>
  <div class="register mt-5">
    <h1 class="text-center mb-4">Create an account</h1>

    <form @submit.prevent="handleRegister" class="w-50 mx-auto">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          class="form-control"
          v-model="email"
          required
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          type="password"
          class="form-control"
          v-model="password"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary w-100">Register</button>

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const auth = getAuth()

const handleRegister = () => {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password'
    return
  }
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((cred) => {
      console.log('Firebase registered successfully:', cred.user?.uid)
      router.push('/signin')
    })
    .catch((err) => {
      console.error('Register failed:', err.code, err.message)
      error.value = err.message
    })
}
</script>

<style scoped>
.register {
  max-width: 600px;
  margin: 0 auto;
}
</style>
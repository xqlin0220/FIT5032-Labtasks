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

      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'
import { getUserRole, currentUserRole } from '@/stores/firebaseAuth'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const roleToRoute: Record<string, { name: string }> = {
  admin: { name: 'About' }, 
  user:  { name: 'Home'  }, 
}

async function handleLogin() {
  error.value = null
  loading.value = true
  try {
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value)

    const redirect = route.query.redirect as string | undefined
    if (redirect) { await router.replace(redirect); return }

    const role = (await getUserRole(cred.user.uid)) ?? currentUserRole.value
    await router.replace(role && roleToRoute[role] ? roleToRoute[role] : { name: 'Home' })
  } catch (e: any) {
    error.value = e?.message ?? 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login { max-width: 600px; margin: 0 auto; }
</style>
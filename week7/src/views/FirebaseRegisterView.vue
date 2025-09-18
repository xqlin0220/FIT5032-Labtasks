<template>
  <div class="register mt-5">
    <h1 class="text-center mb-4">Create an account</h1>

    <form @submit.prevent="handleRegister" class="w-50 mx-auto">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input id="email" type="email" class="form-control" v-model="email" required />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input id="password" type="password" class="form-control" v-model="password" required />
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        {{ loading ? 'Registering…' : 'Register' }}
      </button>

      <p v-if="error" class="text-danger mt-3">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebaseClient'

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)
const router = useRouter()

async function handleRegister() {
  error.value = null
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password'
    return
  }
  loading.value = true
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, password.value)

    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email ?? '',
      displayName: cred.user.displayName ?? '',
      role: 'user',         
      createdAt: Date.now(),
    }, { merge: true })

    router.push({ name: 'Home' })
  } catch (e: any) {
    console.error('Register failed:', e?.code, e?.message)
    error.value = e?.message ?? 'Register failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register { max-width: 600px; margin: 0 auto; }
</style>
import { ref } from 'vue'

export const isAuthenticated = ref(false)
export const currentUser = ref(null)

const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'password123'

export function login(username, password) {
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    isAuthenticated.value = true
    currentUser.value = username
    return true
  }
  return false
}

export function logout() {
  isAuthenticated.value = false
  currentUser.value = null
}

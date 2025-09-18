import { ref } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebaseClient'

export const isAuthenticated  = ref(false)
export const currentUser      = ref(null)
export const currentUserEmail = ref(null)
export const currentUserRole  = ref(null) // 'user' | 'admin' | null
export const loadingUser      = ref(true)

export async function ensureUserDoc(user) {
  const refDoc = doc(db, 'users', user.uid)
  const snap = await getDoc(refDoc)
  if (!snap.exists()) {
    await setDoc(refDoc, {
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      role: 'user',        
      createdAt: Date.now(),
    }, { merge: true })
  }
}

export async function getUserRole(uid) {
  const refDoc = doc(db, 'users', uid)
  const snap = await getDoc(refDoc)
  if (!snap.exists()) return null
  return snap.data().role ?? null
}

export function waitUntilAuthReady() {
  return new Promise((resolve) => {
    const stop = onAuthStateChanged(auth, () => {
      stop()
      const t = setInterval(() => {
        if (!loadingUser.value) { clearInterval(t); resolve() }
      }, 20)
    })
  })
}

export function hasRole(...roles) {
  const r = currentUserRole.value
  return r != null && roles.includes(r)
}

onAuthStateChanged(auth, async (user) => {
  loadingUser.value = true
  isAuthenticated.value  = !!user
  currentUser.value      = user
  currentUserEmail.value = user?.email ?? null
  currentUserRole.value  = null

  if (user) {
    try {
      await ensureUserDoc(user)                        
      currentUserRole.value = await getUserRole(user.uid)
    } catch (e) {
      console.error('[AuthState] ensure/load role failed:', e)
    }
  }

  loadingUser.value = false
})

export async function logout() {
  await signOut(auth)
}
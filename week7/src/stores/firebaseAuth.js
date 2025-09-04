// src/stores/firebaseAuth.js
import { ref } from 'vue'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKn1hCOuusjch3ShDYYK5h_KaeBbk8yTY",
  authDomain: "week7-xuqing.firebaseapp.com",
  projectId: "week7-xuqing",
  storageBucket: "week7-xuqing.firebasestorage.app",
  messagingSenderId: "560933900931",
  appId: "1:560933900931:web:52ebf5a7048bc461f8c1b6",
  measurementId: "G-DSSWRDJ7C0"
}

// initialize firebase app & auth
const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)

// responsive state
export const isAuthenticated = ref(false)
export const currentUser = ref(null)
export const currentUserEmail = ref(null)
export const loadingUser = ref(true)

// watch auth state change
onAuthStateChanged(auth, (user) => {
  isAuthenticated.value = !!user
  currentUser.value = user
  currentUserEmail.value = user?.email ?? null
  loadingUser.value = false

  if (user) {
    console.log('[AuthState] Signed in:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerData: user.providerData?.map(p => p.providerId)
    })
  } else {
    console.log('[AuthState] Signed out')
  }

  // For debugging in browser console
  if (typeof window !== 'undefined') {
    window.currentUser = user
  }
})

// logout function
export async function logout() {
  await signOut(auth)
}
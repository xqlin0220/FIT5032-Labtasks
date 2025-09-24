// src/lib/firebaseClient.js
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBKn1hCOuusjch3ShDYYK5h_KaeBbk8yTY",
  authDomain: "week7-xuqing.firebaseapp.com",
  projectId: "week7-xuqing",
  storageBucket: "week7-xuqing.appspot.com",
  messagingSenderId: "560933900931",
  appId: "1:560933900931:web:52ebf5a7048bc461f8c1b6",
  measurementId: "G-DSSWRDJ7C0"
}

// Avoid duplicate-app & avoid TDZ in cycles
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)